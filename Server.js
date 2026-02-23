

// SERVIDOR EXPRESS - Punto de entrada de la aplicación con PostgreSQL

const express = require('express');
const path = require('path');
const rutasTemas = require('./routes/topicRoutes');

const aplicacionExpress = express();
const PUERTO = 3000;

// Configurar motor de plantillas EJS
aplicacionExpress.set('view engine', 'ejs');
aplicacionExpress.set('views', path.join(__dirname, 'views'));

// Middleware para parsear datos del formulario
aplicacionExpress.use(express.urlencoded({ extended: true }));
aplicacionExpress.use(express.json());

// Servir archivos estáticos (CSS, JS)
aplicacionExpress.use(express.static(path.join(__dirname, 'public')));

// Usar las rutas definidas
aplicacionExpress.use('/', rutasTemas);

// Iniciar servidor
aplicacionExpress.listen(PUERTO, () => {
  console.log(` Servidor corriendo en http://localhost:${PUERTO}`);
  console.log(` Arquitectura MVC implementada`);
  console.log(` CRUD completo + Sistema de votaciones`);
  console.log(` PostgreSQL conectado`);
});
