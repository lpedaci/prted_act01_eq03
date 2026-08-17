/* =============================================================
   MÓDULO · EXPORTAR LA PÁGINA COMO IMAGEN
   Genera un PNG de alta resolución de toda la página.

   Dos detalles que condicionan el diseño de este módulo:

   1) Las fotos se cargan en diferido y las animaciones de entrada
      dejan los hitos en opacidad 0 hasta que se ven. Antes de
      capturar hay que forzar la carga y revelar todo.

   2) Si el sitio se abre como archivo local (file://), el navegador
      trata cada imagen como de otro origen y "contamina" el canvas:
      leer los píxeles falla. En ese caso no se puede generar el PNG
      y se ofrece el camino de impresión (Guardar como PDF), que sí
      funciona sin servidor.
   ============================================================= */

(function (global) {
  'use strict';

  var App = (global.App = global.App || {});
  var doc = global.document;

  /* --- Helpers ---------------------------------------------------------- */

  function loadAll(images) {
    return Promise.all(images.map(function (img) {
      if (img.getAttribute('loading') === 'lazy') {
        img.setAttribute('loading', 'eager');
      }
      if (img.complete && img.naturalWidth > 0) {
        return null;
      }
      return new Promise(function (resolve) {
        img.addEventListener('load', resolve, { once: true });
        img.addEventListener('error', resolve, { once: true });
      });
    }));
  }

  /* Sonda: ¿el navegador nos deja leer los píxeles de esta foto? */
  function canReadPixels(img) {
    if (!img) { return true; }
    try {
      var probe = doc.createElement('canvas');
      probe.width = 1;
      probe.height = 1;
      probe.getContext('2d').drawImage(img, 0, 0, 1, 1);
      probe.toDataURL();
      return true;
    } catch (err) {
      return false;
    }
  }

  /* ¿Se puede realmente crear y leer un canvas de este tamaño?
     Los navegadores tienen dos topes distintos —lado máximo y área
     máxima— y varían mucho entre equipos (en iOS el área es bastante
     chica). En vez de adivinarlos, se prueba el tamaño exacto que hace
     falta y se libera el lienzo enseguida. */
  function canAllocate(width, height) {
    var probe = doc.createElement('canvas');
    var ok    = false;

    try {
      probe.width  = width;
      probe.height = height;

      var ctx = probe.getContext('2d');
      if (ctx) {
        /* Se pinta y se lee la última esquina: si el lienzo no se creó
           del todo, vuelve transparente en vez de fallar. */
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(width - 1, height - 1, 1, 1);
        ok = ctx.getImageData(width - 1, height - 1, 1, 1).data[3] !== 0;
      }
    } catch (err) {
      ok = false;
    }

    probe.width  = 0;
    probe.height = 0;
    return ok;
  }

  /* Elige la mayor escala que el navegador aguante de verdad. */
  function pickScale(width, height, limits) {
    var steps   = (limits.scaleSteps && limits.scaleSteps.length)
      ? limits.scaleSteps
      : [2, 1.5, 1];

    /* Techo por presupuesto de memoria, además del tope configurado */
    var ceiling = Math.min(
      limits.maxScale || 2,
      Math.sqrt((limits.maxPixels || 40000000) / (width * height))
    );

    for (var i = 0; i < steps.length; i++) {
      var scale = steps[i];
      if (scale > ceiling) { continue; }
      if (canAllocate(Math.round(width * scale), Math.round(height * scale))) {
        return scale;
      }
    }

    return 1;
  }

  function stamp() {
    var d = new Date();
    return [
      d.getFullYear(),
      ('0' + (d.getMonth() + 1)).slice(-2),
      ('0' + d.getDate()).slice(-2)
    ].join('-');
  }

  function save(blob, name) {
    var url  = global.URL.createObjectURL(blob);
    var link = doc.createElement('a');

    link.href = url;
    link.download = name;
    doc.body.appendChild(link);
    link.click();
    link.remove();

    /* Se libera recién cuando el navegador ya tomó el blob */
    global.setTimeout(function () { global.URL.revokeObjectURL(url); }, 10000);
  }

  /* Recorre la página entera de arriba a abajo antes de capturar.
     Con esto se "lee" todo el sitio: se disparan los observadores que
     revelan los hitos, entran en pantalla las fotos diferidas y el riel
     de progreso se completa. Recién después se saca la imagen. */
  function warmUp() {
    var step  = Math.max(200, global.innerHeight * 0.9);
    var total = doc.documentElement.scrollHeight;
    var y     = 0;

    return new Promise(function (resolve) {
      function next() {
        if (y >= total) {
          global.scrollTo(0, 0);
          /* Un par de cuadros para que el salto al tope se asiente */
          global.requestAnimationFrame(function () {
            global.requestAnimationFrame(resolve);
          });
          return;
        }

        global.scrollTo(0, y);
        y += step;

        /* Dos cuadros por paso: uno aplica el scroll, el otro le da lugar
           al IntersectionObserver para que marque los hitos como visibles. */
        global.requestAnimationFrame(function () {
          global.requestAnimationFrame(next);
        });
      }
      next();
    });
  }

  /* Prepara el clon que html2canvas va a dibujar. Se toca el clon y no
     la página real, así el usuario no ve ningún parpadeo. */
  function prepareClone(clonedDoc, cfg, railHeight) {
    clonedDoc.documentElement.classList.add(cfg.export.exportingClass);

    var hidden = clonedDoc.querySelectorAll(cfg.selectors.revealables);
    Array.prototype.forEach.call(hidden, function (node) {
      node.classList.add(cfg.classes.visible);
    });

    /* El riel va dibujado completo: en una imagen estática no tiene
       sentido que el progreso dependa de dónde quedó el scroll. */
    var bar = clonedDoc.querySelector(cfg.selectors.progress);
    if (bar && railHeight) {
      bar.style.height = railHeight + 'px';
    }
  }

  /* --- API -------------------------------------------------------------- */

  App.exporter = {

    init: function () {
      var cfg    = App.config;
      var button = doc.querySelector(cfg.selectors.exportButton);
      var status = doc.querySelector(cfg.selectors.exportStatus);
      var print  = doc.querySelector(cfg.selectors.exportPrint);
      var root   = doc.querySelector(cfg.selectors.exportRoot);

      if (!button || !root) { return; }

      /* El botón vive oculto en el marcado: sin JS no sirve de nada */
      button.hidden = false;

      function say(message) {
        if (status) { status.textContent = message || ''; }
      }

      function offerPrint(message) {
        say(message);
        if (print) { print.hidden = false; }
      }

      if (print) {
        print.addEventListener('click', function () {
          global.print();
        });
      }

      button.addEventListener('click', function () {
        if (typeof global.html2canvas !== 'function') {
          offerPrint('No se pudo cargar el generador de imágenes. Podés usar la impresión y elegir «Guardar como PDF».');
          return;
        }

        button.disabled = true;
        if (print) { print.hidden = true; }
        say('Preparando la página…');

        var images = Array.prototype.slice.call(doc.images);
        var keepY  = global.scrollY;

        Promise.resolve()
          .then(function () { return loadAll(images); })
          .then(function () {
            return doc.fonts && doc.fonts.ready ? doc.fonts.ready : null;
          })
          .then(function () {
            say('Recorriendo la página…');

            /* Desactiva el scroll suave: el recorrido tiene que ser inmediato */
            doc.documentElement.classList.add(cfg.export.capturingClass);
            return warmUp();
          })
          .then(function () {
            /* El recorrido pudo haber disparado fotos que antes no se
               habían pedido: se espera a que terminen de cargar. */
            return loadAll(Array.prototype.slice.call(doc.images));
          })
          .then(function () {
            /* Sonda de permisos antes de gastar tiempo y memoria */
            var photo = Array.prototype.slice.call(doc.images).filter(function (img) {
              return img.complete && img.naturalWidth > 0;
            })[0];

            if (!canReadPixels(photo)) {
              var err = new Error('tainted');
              err.code = 'TAINTED';
              throw err;
            }

            say('Generando la imagen…');

            /* Se mide con todo ya cargado: las alturas están definitivas */
            var timeline   = doc.querySelector(cfg.selectors.timeline);
            var railHeight = timeline
              ? Math.round(timeline.getBoundingClientRect().height)
              : 0;

            var width  = doc.documentElement.scrollWidth;
            var height = doc.documentElement.scrollHeight;
            var scale  = pickScale(width, height, cfg.export);

            return global.html2canvas(root, {
              scale: scale,
              width: width,
              height: height,
              backgroundColor: global.getComputedStyle(doc.body).backgroundColor,
              useCORS: true,
              allowTaint: false,
              logging: false,
              onclone: function (clonedDoc) {
                prepareClone(clonedDoc, cfg, railHeight);
              }
            });
          })
          .then(function (canvas) {
            return new Promise(function (resolve, reject) {
              canvas.toBlob(function (blob) {
                if (blob) { resolve(blob); } else { reject(new Error('blob vacío')); }
              }, 'image/png');
            });
          })
          .then(function (blob) {
            save(blob, cfg.export.fileName + '-' + stamp() + '.png');
            say('Listo: imagen descargada (' + Math.round(blob.size / 1024) + ' KB).');
          })
          .catch(function (err) {
            if (err && (err.code === 'TAINTED' || err.name === 'SecurityError')) {
              offerPrint('El navegador no permite leer las fotos cuando la página se abre como archivo local. ' +
                         'Subila a un servidor (o usá GitHub Pages) para bajar el PNG, o generá un PDF con la impresión.');
            } else {
              offerPrint('No se pudo generar la imagen. Probá con la impresión y elegí «Guardar como PDF».');
            }
          })
          .then(function () {
            doc.documentElement.classList.remove(cfg.export.capturingClass);
            global.scrollTo(0, keepY);
            button.disabled = false;
          });
      });
    }
  };

}(window));
