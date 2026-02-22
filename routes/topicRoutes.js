// routes/topicRoutes.js
// RUTAS: Define las URLs y conecta con el controlador

const express = require('express');
const enrutador = express.Router();
const controladorTemas = require('../controllers/topicController');

// Rutas para TEMAS
enrutador.get('/', controladorTemas.index.bind(controladorTemas));
enrutador.post('/topics', controladorTemas.create.bind(controladorTemas));
enrutador.post('/topics/:id/update', controladorTemas.update.bind(controladorTemas));
enrutador.post('/topics/:id/delete', controladorTemas.delete.bind(controladorTemas));
enrutador.post('/topics/:id/vote', controladorTemas.vote.bind(controladorTemas));

// Rutas para ENLACES
enrutador.post('/topics/:topicId/links', controladorTemas.addLink.bind(controladorTemas));
enrutador.post('/topics/:topicId/links/:linkId/update', controladorTemas.updateLink.bind(controladorTemas));
enrutador.post('/topics/:topicId/links/:linkId/delete', controladorTemas.deleteLink.bind(controladorTemas));
enrutador.post('/topics/:topicId/links/:linkId/vote', controladorTemas.voteLink.bind(controladorTemas));

module.exports = enrutador;
