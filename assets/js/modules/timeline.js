/* =============================================================
   MÓDULO · LÍNEA DE TIEMPO
   Construye el DOM de etapas e hitos a partir de los datos.
   No conoce colores ni medidas: eso lo resuelve el CSS a través
   de las clases .tone-* y del atributo data-person.
   ============================================================= */

(function (global) {
  'use strict';

  var App = (global.App = global.App || {});
  var doc = global.document;

  /* --- Helpers ---------------------------------------------------------- */

  function el(tag, className, html) {
    var node = doc.createElement(tag);
    if (className) { node.className = className; }
    if (html != null) { node.innerHTML = html; }
    return node;
  }

  function indexById(list) {
    return list.reduce(function (acc, item) {
      acc[item.id] = item;
      return acc;
    }, {});
  }

  /* --- Fragmentos ------------------------------------------------------- */

  function buildPhase(phase) {
    return el('div', 'phase',
      '<div class="phase__band">' +
        '<span class="phase__step">' + phase.step + '</span>' +
        '<h3 class="phase__title">' + phase.title + '</h3>' +
        '<small class="phase__subtitle">' + phase.subtitle + '</small>' +
      '</div>'
    );
  }

  function buildQuotes(quotes) {
    if (!quotes || !quotes.length) { return ''; }

    return quotes.map(function (quote) {
      return '<div class="cita">' +
               '<span class="q">' + quote.text + '</span> ' +
               '<span class="src">' + quote.source + '</span>' +
             '</div>';
    }).join('');
  }

  function buildEvent(event, person, side) {
    var classNames = ['event', 'tone-' + person.tone];

    if (person.joint) {
      classNames.push('event--joint');
    } else {
      classNames.push('event--' + side);
    }

    var node = el('article', classNames.join(' '),
      '<div class="node"></div>' +
      '<p class="date">' + event.date + '</p>' +
      '<p class="narr"><i aria-hidden="true"></i>' + person.name + '</p>' +
      '<div class="card">' +
        '<h4 class="card__title">' + event.title + '</h4>' +
        '<p>' + event.text + '</p>' +
        buildQuotes(event.quotes) +
      '</div>'
    );

    node.setAttribute('data-person', event.person);
    return node;
  }

  /* --- API -------------------------------------------------------------- */

  App.timeline = {

    /**
     * Renderiza etapas e hitos dentro del contenedor indicado.
     * @param {HTMLElement} root contenedor de la línea de tiempo
     */
    render: function (root) {
      if (!root) { return; }

      var sides       = App.config.layout.sides;
      var equipo      = App.data.equipo;
      var phasesById  = indexById(App.data.phases);
      var fragment    = doc.createDocumentFragment();
      var currentPhase = null;
      var sideIndex    = 0;

      App.data.events.forEach(function (event) {
        var person = equipo[event.person];

        /* Un hito sin persona conocida se ignora en vez de romper la página */
        if (!person) { return; }

        if (event.phase !== currentPhase && phasesById[event.phase]) {
          currentPhase = event.phase;
          fragment.appendChild(buildPhase(phasesById[currentPhase]));
        }

        var side = sides[sideIndex % sides.length];
        if (!person.joint) { sideIndex += 1; }

        fragment.appendChild(buildEvent(event, person, side));
      });

      root.appendChild(fragment);
    }
  };

}(window));
