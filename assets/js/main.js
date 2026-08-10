/* =============================================================
   PUNTO DE ENTRADA
   Orquesta el arranque: primero se pinta la línea de tiempo y
   recién después se enganchan los observadores, que necesitan
   los hitos ya presentes en el DOM.
   ============================================================= */

(function (global) {
  'use strict';

  var App = global.App;
  var doc = global.document;

  function start() {
    App.timeline.render(doc.querySelector(App.config.selectors.timeline));
    App.reveal.init();
    App.progress.init();
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

}(window));
