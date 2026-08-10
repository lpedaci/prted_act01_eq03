/* =============================================================
   DATOS · LÍNEA DE TIEMPO
   Contenido puro: etapas e hitos. Para agregar, corregir o
   reordenar un hito se edita únicamente este archivo.

   Cada hito:
     person -> id del equipo (ver equipo.data.js)
     phase  -> id de la etapa
     date   -> texto libre de la fecha
     title  -> título del hito
     text   -> relato (admite <mark class="hl"> para resaltar)
     quotes -> lista de citas { text, source }; [] si no hay
   ============================================================= */

(function (global) {
  'use strict';

  var App = (global.App = global.App || {});
  App.data = App.data || {};

  /* --- Etapas (el orden define el de la línea de tiempo) ---------------- */
  App.data.phases = [
    {
      id: 'desc',
      step: 'Etapa 1',
      title: 'Descubrimiento',
      subtitle: 'primeros contactos con la tecnología'
    },
    {
      id: 'ins',
      step: 'Etapa 2',
      title: 'Inserción en el mundo de la tecnología',
      subtitle: 'elegir el camino y formarnos'
    },
    {
      id: 'av',
      step: 'Etapa 3',
      title: 'El avance hasta hoy',
      subtitle: 'la tecnología en nuestra práctica'
    },
    {
      id: 'conv',
      step: 'Etapa 4',
      title: 'Convergencia',
      subtitle: 'juntas en la Licenciatura'
    }
  ];

  /* --- Hitos ------------------------------------------------------------ */
  App.data.events = [
    {
      person: 'silvia',
      phase: 'desc',
      date: 'Adultez',
      title: 'Primer contacto',
      text: 'La computadora de mi hijo. No tenía mail ni sabía encenderla; <mark class="hl">empecé a investigar por mi cuenta</mark>.',
      quotes: [{
        text: 'muchas personas tienen dificultad para entender que los diferentes artilugios que utilizamos en la vida cotidiana, una vez integrados en nuestra forma de vida, sean tecnología',
        source: '(Sancho Gil, 2009, p. 50)'
      }]
    },
    {
      person: 'lourdes',
      phase: 'desc',
      date: 'Infancia (~10)',
      title: 'Rodeada de electrónica',
      text: 'Mi papá, técnico electrónico, reparaba diversos aparatos electrónicos en casa. La <mark class="hl">reparación de una computadora me fascinó</mark>. En casa el acceso a internet era limitado, y eso me impulsó todavía más.',
      quotes: []
    },
    {
      person: 'lourdes',
      phase: 'desc',
      date: 'Infancia y adolescencia',
      title: 'Los videojuegos, otro motor',
      text: 'Los videojuegos también fueron un motor: disfrutaba de <mark class="hl">aquellos que me llevaban a razonar, aprender y empatizar</mark>.',
      quotes: []
    },
    {
      person: 'clara',
      phase: 'desc',
      date: 'Escuela',
      title: 'Los primeros contactos',
      text: 'Mi relación con la tecnología empezó en la escuela, en la <mark class="hl">sala de informática</mark>, y siguió con mi primer celular, un Motorola.',
      quotes: []
    },
    {
      person: 'silvia',
      phase: 'desc',
      date: 'Descubrimiento',
      title: 'Aprender jugando',
      text: 'Me enganché con los juegos y con la edición de video; <mark class="hl">aprendí investigando sola</mark> y pidiendo ayuda.',
      quotes: [{
        text: 'el ordenador reconfigura las condiciones de aprendizaje y supone nuevas formas de aprender',
        source: '(De Pablos Pons, 2009, p. 101)'
      }]
    },
    {
      person: 'lourdes',
      phase: 'desc',
      date: 'Secundaria',
      title: 'Escuela técnica',
      text: 'Antes, me la pasaba leyendo <mark class="hl">manuales de tecnología</mark> (ofimática, hardware y software que mis papás conseguían). Después llegó la secundaria con orientación en informática, y el interés se volvió formación.',
      quotes: [{
        text: '[los libros son] la tecnología más privilegiada de tratamiento de la información',
        source: '(Sancho Gil, 2009, p. 47)'
      }]
    },
    {
      person: 'lourdes',
      phase: 'ins',
      date: 'Nivel superior',
      title: 'Buscando el camino',
      text: 'Casi 2 años de Ingeniería en Informática, donde no me hallé. Por eso decidí inscribirme en el Profesorado en Educación Superior en Informática. <mark class="hl">Sabía que la tecnología era mi camino</mark>, pero lo estaba buscando.',
      quotes: [{
        text: 'han vinculado la presencia de su acción en el campo educativo a la profesionalización de la enseñanza',
        source: '(De Pablos Pons, 2009, p. 97)'
      }]
    },
    {
      person: 'clara',
      phase: 'ins',
      date: 'Formación',
      title: 'De la PC a la netbook',
      text: 'Vi la evolución de las computadoras, desde las primeras PC de escritorio hasta la <mark class="hl">netbook</mark>, que fue clave para poder estudiar y seguir formándome.',
      quotes: [{
        text: 'el usuario ha superado la fase de uso receptivo para situarse en un nivel participativo',
        source: '(De Pablos Pons, 2009, p. 96)'
      }]
    },
    {
      person: 'silvia',
      phase: 'ins',
      date: 'Profesorado',
      title: 'Formarme como docente',
      text: 'Estudio para ser docente de Nivel Inicial; descubro la PC y la <mark class="hl">pizarra digital</mark> como aliadas.',
      quotes: [{
        text: 'el valor de los materiales de enseñanza como mediadores del aprendizaje',
        source: '(Sancho Gil, 2009, p. 60)'
      }]
    },
    {
      person: 'lourdes',
      phase: 'ins',
      date: 'Especializaciones',
      title: 'Ampliar el panorama',
      text: 'Diseño, análisis de datos y <mark class="hl">creación de contenido con IA</mark>.',
      quotes: [{
        text: 'La usamos para potenciar nuestro alcance, sin anular nuestras capacidades',
        source: '(Sigman y Bilinkis, 2023, p. 121)'
      }]
    },
    {
      person: 'silvia',
      phase: 'ins',
      date: 'Docencia',
      title: 'La tecnología en la sala',
      text: 'Planificaciones, videos de reuniones, <mark class="hl">juegos educativos</mark> y cursos de formación continua.',
      quotes: [{
        text: 'una incumbencia cultural a la hora de incorporar las nuevas tecnologías digitales a las situaciones de enseñanza, que permita los necesarios procesos de adaptación e integración, especialmente de las tecnologías de la información y la comunicación',
        source: '(De Pablos Pons, 2009, p. 97)'
      }]
    },
    {
      person: 'lourdes',
      phase: 'av',
      date: '2017',
      title: 'Profesora en escuela técnica',
      text: 'Sistemas operativos, seguridad informática y ciudadanía digital, gestión de proyectos y mantenimiento de sistemas. Ahí busco vincular el <mark class="hl">comportamiento humano con los medios tecnológicos</mark> (UX, Ciencias del Comportamiento).',
      quotes: [{
        text: 'Resituar el foco de atención del estudio de la interacción de los individuos con los medios',
        source: '(Sancho Gil, 2009, p. 59)'
      }]
    },
    {
      person: 'clara',
      phase: 'av',
      date: 'Docencia',
      title: 'La tecnología en mis clases',
      text: 'Como Profesora de Economía me permitió actualizarme, crear contenidos y <mark class="hl">acompañar a mis estudiantes de Fines</mark>, por ejemplo armando sus CV con computadoras, celulares y apps.',
      quotes: [{
        text: 'las tecnologías sociales, las formas de hacer la vida',
        source: '(Sancho Gil, 2009, p. 47)'
      }]
    },
    {
      person: 'silvia',
      phase: 'av',
      date: '2020 · Pandemia',
      title: 'Referente tecnológica',
      text: 'Me convertí en la <mark class="hl">referente tecnológica</mark> de la escuela; coordinaba el Padlet para compartir con las familias.',
      quotes: [{
        text: 'el profesorado tiene un papel fundamental a la hora de determinar lo que es posible realizar con las TIC en el aula',
        source: '(Sancho Gil, 2009, p. 64)'
      }]
    },
    {
      person: 'lourdes',
      phase: 'av',
      date: '2020 · Pandemia',
      title: 'Sin límites de horario',
      text: 'Hice la <mark class="hl">residencia virtual</mark> mientras trabajaba. Lo virtual fue el puente para conectar, pero no poder desconectar me pasó factura en la salud. Eso disparó mi interés por profundizar cómo media la tecnología en los estudiantes y en nosotros como personas: para algunos puede ser positiva y con propósito, pero sin un límite claro se vuelve un problema que se profundiza a mediano y largo plazo.',
      quotes: [
        {
          text: 'lo que parece estar haciendo la Web es debilitar mi capacidad de concentración y contemplación',
          source: '(Carr, 2011, p. 11)'
        },
        {
          text: '[los medios de la Red] pueden ser vigorizantes, estimulantes... Pero también son una agotadora y constante distracción',
          source: '(Carr, 2011, p. 165)'
        }
      ]
    },
    {
      person: 'clara',
      phase: 'av',
      date: 'Hoy',
      title: 'Del cómo al para qué',
      text: 'Mi mirada ya no está solo en aprender a usar una herramienta, sino en preguntarme <mark class="hl">para qué usarla</mark>, qué aporta y qué necesidad educativa ayuda a resolver.',
      quotes: [{
        text: 'la tecnología de la educación ya no se refiere solamente a productos o equipos, sino a pensar cuidadosamente acerca de la enseñanza y el aprendizaje',
        source: '(De Pablos Pons, 2009, p. 109)'
      }]
    },
    {
      person: 'lourdes',
      phase: 'av',
      date: '2021',
      title: 'Un antes y un después',
      text: 'Descubrí la Licenciatura, pero la postergué por lo económico. <mark class="hl">La pandemia me terminó de decidir</mark>.',
      quotes: []
    },
    {
      person: 'juntas',
      phase: 'conv',
      date: '2025 · Agosto',
      title: 'Empieza la Licenciatura',
      text: 'Arrancamos la <mark class="hl">Licenciatura en Tecnología Educativa</mark> (UTN): primer cuatrimestre.',
      quotes: [{
        text: 'La sociedad del conocimiento demanda un salto cualitativo en los sistemas educativos; requiere avanzar en la nueva alfabetización digital',
        source: '(De Pablos Pons, 2009, p. 113)'
      }]
    },
    {
      person: 'juntas',
      phase: 'conv',
      date: '2026 · Marzo',
      title: 'Segundo cuatrimestre',
      text: 'Avanzando en nuestros perfiles como <mark class="hl">futuras Tecnólogas educativas</mark>.',
      quotes: [{
        text: 'el objetivo de la Tecnología Educativa es el de mejorar la calidad del proceso de enseñanza y aprendizaje',
        source: '(De Pablos Pons, 2009, p. 109)'
      }]
    },
    {
      person: 'juntas',
      phase: 'conv',
      date: '2026 · Agosto',
      title: 'Tercer y último cuatrimestre',
      text: 'Encarando las últimas asignaturas y el <mark class="hl">proyecto de tesina</mark>.',
      quotes: [{
        text: 'la innovación es un compromiso de carácter colectivo, institucional, que sólo se produce cuando las personas interactúan, comparten ideas',
        source: '(De Pablos Pons, 2009, p. 114)'
      }]
    }
  ];

}(window));
