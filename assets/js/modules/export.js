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

  /* El factor de escala se acota por presupuesto de píxeles y por el
     lado máximo que admite un canvas: una página muy larga no puede
     multiplicarse por 2 sin pasarse. */
  function pickScale(width, height, limits) {
    var byPixels = Math.sqrt(limits.maxPixels / (width * height));
    var byEdge   = limits.maxEdge / Math.max(width, height);
    return Math.max(1, Math.min(limits.maxScale, byPixels, byEdge));
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

  /* Prepara el clon que html2canvas va a dibujar. Se toca el clon y no
     la página real, así el usuario no ve ningún parpadeo. */
  function prepareClone(clonedDoc, cfg) {
    clonedDoc.documentElement.classList.add(cfg.export.exportingClass);

    var hidden = clonedDoc.querySelectorAll(cfg.selectors.revealables);
    Array.prototype.forEach.call(hidden, function (node) {
      node.classList.add(cfg.classes.visible);
    });
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
            /* Sonda de permisos antes de gastar tiempo y memoria */
            var photo = images.filter(function (img) {
              return img.complete && img.naturalWidth > 0;
            })[0];

            if (!canReadPixels(photo)) {
              var err = new Error('tainted');
              err.code = 'TAINTED';
              throw err;
            }

            say('Generando la imagen…');

            /* Capturar desde arriba evita desfasajes de posición */
            doc.documentElement.classList.add(cfg.export.capturingClass);
            global.scrollTo(0, 0);

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
              onclone: function (clonedDoc) { prepareClone(clonedDoc, cfg); }
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
