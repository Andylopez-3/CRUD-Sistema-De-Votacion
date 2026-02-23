// controllers/topicController.js
// CONTROLADOR: Recibe solicitudes, usa el Modelo y elige la Vista

const modeloTemas = require('../models/topicModel');

class ControladorTemas {
  // Mostrar todos los temas
  async index(solicitud, respuesta) {
    try {
      const temas = await modeloTemas.getAllTopics();
      respuesta.render('index', { topics: temas });
    } catch (error) {
      console.error('Error al cargar temas:', error);
      respuesta.status(500).send('Error al cargar los datos');
    }
  }

  // Crear nuevo tema
  async create(solicitud, respuesta) {
    try {
      const { name: nombre } = solicitud.body;
      if (nombre && nombre.trim()) {
        await modeloTemas.createTopic(nombre.trim());
      }
      respuesta.redirect('/');
    } catch (error) {
      console.error('Error al crear tema:', error);
      respuesta.status(500).send('Error al crear el tema');
    }
 }

  // Actualizar tema
  async update(solicitud, respuesta) {
    try {
      const { id } = solicitud.params;
      const { name: nombre } = solicitud.body;
      if (nombre && nombre.trim()) {
        await modeloTemas.updateTopic(id, nombre.trim());
      }
      respuesta.redirect('/');
    } catch (error) {
      console.error('Error al actualizar tema:', error);
      respuesta.status(500).send('Error al actualizar el tema');
    }
  }

  // Eliminar tema
  async delete(solicitud, respuesta) {
    try {
      const { id } = solicitud.params;
      await modeloTemas.deleteTopic(id);
      respuesta.redirect('/');
    } catch (error) {
      console.error('Error al eliminar tema:', error);
      respuesta.status(500).send('Error al eliminar el tema');
    }
  }

  // Votar por tema
  async vote(solicitud, respuesta) {
    try {
      const { id } = solicitud.params;
      const tema = await modeloTemas.voteTopic(id);
      respuesta.json({ success: true, votes: tema ? tema.votes : 0 });
    } catch (error) {
      console.error('Error al votar tema:', error);
      respuesta.status(500).json({ success: false, error: 'Error al votar' });
    }
  }

  // Añadir enlace
  async addLink(solicitud, respuesta) {
    try {
      const { topicId: idTema } = solicitud.params;
      const { url: enlace, description: descripcion } = solicitud.body;
      if (enlace && enlace.trim() && descripcion && descripcion.trim()) {
        await modeloTemas.addLink(parseInt(idTema), enlace.trim(), descripcion.trim());
      }
      respuesta.redirect('/');
    } catch (error) {
      console.error('Error al agregar enlace:', error);
      respuesta.status(500).send('Error al agregar el enlace');
    }
  }

  // Actualizar enlace
  async updateLink(solicitud, respuesta) {
    try {
      const { topicId: idTema, linkId: idEnlace } = solicitud.params;
      const { url: enlace, description: descripcion } = solicitud.body;
      if (enlace && enlace.trim() && descripcion && descripcion.trim()) {
        await modeloTemas.updateLink(idTema, idEnlace, enlace.trim(), descripcion.trim());
      }
      respuesta.redirect('/');
    } catch (error) {
      console.error('Error al actualizar enlace:', error);
      respuesta.status(500).send('Error al actualizar el enlace');
    }
  }

  // Eliminar enlace
  async deleteLink(solicitud, respuesta) {
    try {
      const { topicId: idTema, linkId: idEnlace } = solicitud.params;
      await modeloTemas.deleteLink(idTema, idEnlace);
      respuesta.redirect('/');
    } catch (error) {
      console.error('Error al eliminar enlace:', error);
      respuesta.status(500).send('Error al eliminar el enlace');
    }
  }

  // Votar por enlace
  async voteLink(solicitud, respuesta) {
    try {
      const { topicId: idTema, linkId: idEnlace } = solicitud.params;
      const enlace = await modeloTemas.voteLink(idTema, idEnlace);
      respuesta.json({ success: true, votes: enlace ? enlace.votes : 0 });
    } catch (error) {
      console.error('Error al votar enlace:', error);
      respuesta.status(500).json({ success: false, error: 'Error al votar' });
    }
  }
}

module.exports = new ControladorTemas();
