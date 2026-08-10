/* =============================================================
   DATOS · EQUIPO
   Quién es quién en la línea de tiempo.

   tone  -> nombre del token de color (ver .tone-* en timeline.css).
   joint -> hito compartido por las tres integrantes.
   ============================================================= */

(function (global) {
  'use strict';

  var App = (global.App = global.App || {});
  App.data = App.data || {};

  App.data.equipo = {
    lourdes: { name: 'Lourdes', tone: 'teal' },
    silvia:  { name: 'Silvia',  tone: 'violet' },
    clara:   { name: 'Clara',   tone: 'pink' },
    juntas:  { name: 'Juntas',  tone: 'gold', joint: true }
  };

}(window));
