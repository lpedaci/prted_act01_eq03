/* =============================================================
   MÓDULO · BARRA DE PROGRESO DEL RIEL
   Colorea el riel de la línea de tiempo según lo ya recorrido.
   El scroll se atiende con requestAnimationFrame para no
   recalcular más de una vez por cuadro.
   ============================================================= */

(function (global) {
  'use strict';

  var App = (global.App = global.App || {});
  var doc = global.document;

  App.progress = {

    init: function () {
      var cfg      = App.config;
      var timeline = doc.querySelector(cfg.selectors.timeline);
      var bar      = doc.querySelector(cfg.selectors.progress);

      if (!timeline || !bar) { return; }

      var anchorRatio = cfg.progress.anchorRatio;
      var ticking     = false;

      function update() {
        ticking = false;

        var box    = timeline.getBoundingClientRect();
        var anchor = global.innerHeight * anchorRatio;
        var done   = Math.min(Math.max(anchor - box.top, 0), box.height);

        bar.style.height = done + 'px';
      }

      function requestUpdate() {
        if (ticking) { return; }
        ticking = true;
        global.requestAnimationFrame(update);
      }

      update();
      global.addEventListener('scroll', requestUpdate, { passive: true });
      global.addEventListener('resize', requestUpdate);
    }
  };

}(window));
