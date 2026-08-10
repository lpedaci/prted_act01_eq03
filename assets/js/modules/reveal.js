/* =============================================================
   MÓDULO · APARICIÓN AL HACER SCROLL
   Agrega la clase de visibilidad a hitos y etapas cuando entran
   en pantalla. Degrada con elegancia:
     - sin IntersectionObserver -> muestra todo
     - con movimiento reducido  -> muestra todo, sin animación
   ============================================================= */

(function (global) {
  'use strict';

  var App = (global.App = global.App || {});
  var doc = global.document;

  function showAll(nodes) {
    var visible = App.config.classes.visible;
    nodes.forEach(function (node) {
      node.classList.add(visible);
    });
  }

  App.reveal = {

    init: function () {
      var cfg   = App.config;
      var nodes = Array.prototype.slice.call(
        doc.querySelectorAll(cfg.selectors.revealables)
      );

      if (!nodes.length) { return; }

      if (!('IntersectionObserver' in global) || App.prefersReducedMotion()) {
        showAll(nodes);
        return;
      }

      var observer = new global.IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) { return; }
          entry.target.classList.add(cfg.classes.visible);
          observer.unobserve(entry.target);
        });
      }, {
        threshold:  cfg.reveal.threshold,
        rootMargin: cfg.reveal.rootMargin
      });

      nodes.forEach(function (node) {
        observer.observe(node);
      });
    }
  };

}(window));
