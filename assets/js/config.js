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
      revealables: '.event, .phase',
      exportRoot:   'body',        /* qué se captura: la página completa */
      exportButton: '#export-btn',
      exportPrint:  '#export-print',
      exportStatus: '#export-status'
    },

    /* Clases que aplica el JS */
    classes: {
      visible: 'is-visible'
    },

    /* Exportación a PNG.
       maxScale   -> tope de nitidez (2 = el doble de resolución)
       maxPixels  -> presupuesto de memoria del lienzo
       scaleSteps -> escalas a intentar, de mayor a menor. El módulo
                     prueba cada una creando un canvas del tamaño real,
                     así respeta los límites del navegador sin adivinarlos. */
    export: {
      fileName:        'tecnoautobiografia-equipo03',
      maxScale:        2,
      maxPixels:       80000000,
      scaleSteps:      [2, 1.75, 1.5, 1.25, 1],
      exportingClass:  'is-exporting',
      capturingClass:  'is-capturing'
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
