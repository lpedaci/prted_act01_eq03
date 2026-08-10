/* =============================================================
   CONFIGURACIÓN
   Todos los valores que antes estaban "sueltos" dentro de la
   lógica (selectores, umbrales, proporciones) viven acá.
   ============================================================= */

(function (global) {
  'use strict';

  var App = (global.App = global.App || {});

  App.config = {

    /* Selectores del DOM: si cambia el marcado, se toca solo esto */
    selectors: {
      timeline:    '#timeline',
      progress:    '#progress',
      revealables: '.event, .phase'
    },

    /* Clases que aplica el JS */
    classes: {
      visible: 'is-visible'
    },

    /* Aparición progresiva de los hitos al hacer scroll */
    reveal: {
      threshold:  0.16,
      rootMargin: '0px 0px -8% 0px'
    },

    /* Barra de progreso del riel.
       anchorRatio: a qué altura de la ventana se considera
       "recorrido" un punto de la línea (0 = arriba, 1 = abajo). */
    progress: {
      anchorRatio: 0.55
    },

    /* Alternancia izquierda/derecha en desktop */
    layout: {
      sides: ['left', 'right']
    },

    /* Consulta usada para respetar la preferencia del sistema */
    motion: {
      reducedMotionQuery: '(prefers-reduced-motion: reduce)'
    }
  };

  /* Helper único para no repetir la consulta en cada módulo */
  App.prefersReducedMotion = function () {
    return global.matchMedia
      ? global.matchMedia(App.config.motion.reducedMotionQuery).matches
      : false;
  };

}(window));
