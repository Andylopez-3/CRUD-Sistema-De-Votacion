// models/topicModel.js
// MODELO: Maneja los datos usando PostgreSQL con SQL puro

const baseDatos = require('../config/database');

class ModeloTemas {
  
  // CRUD para TEMAS
  
  async getAllTopics() {
    const consulta = `
      SELECT t.*, 
             json_agg(
               json_build_object(
                 'id', l.id,
                 'url', l.url,
                 'description', l.description,
                 'votes', l.votes
               ) ORDER BY l.votes DESC
             ) FILTER (WHERE l.id IS NOT NULL) as links
      FROM topics t
      LEFT JOIN links l ON t.id = l.topic_id
      GROUP BY t.id
      ORDER BY t.votes DESC
    `;
    const resultado = await baseDatos.query(consulta);
    // Formatear resultado para que links sea un array (no null)
    return resultado.rows.map(tema => ({
      ...tema,
      links: tema.links || []
    }));
  }

  async getTopicById(id) {
    const consulta = `
      SELECT t.*, 
             json_agg(
               json_build_object(
                 'id', l.id,
                 'url', l.url,
                 'description', l.description,
                 'votes', l.votes
               ) ORDER BY l.votes DESC
             ) FILTER (WHERE l.id IS NOT NULL) as links
      FROM topics t
      LEFT JOIN links l ON t.id = l.topic_id
      WHERE t.id = $1
      GROUP BY t.id
    `;
    const resultado = await baseDatos.query(consulta, [id]);
    if (resultado.rows.length === 0) return null;
    
    const tema = resultado.rows[0];
    return {
      ...tema,
      links: tema.links || []
    };
  }

  async createTopic(nombre) {
    const consulta = 'INSERT INTO topics (name, votes) VALUES ($1, 0) RETURNING *';
    const resultado = await baseDatos.query(consulta, [nombre]);
    return resultado.rows[0];
  }

  async updateTopic(id, nombre) {
    const consulta = 'UPDATE topics SET name = $1 WHERE id = $2 RETURNING *';
    const resultado = await baseDatos.query(consulta, [nombre, id]);
    return resultado.rows[0];
  }

  async deleteTopic(id) {
    const consulta = 'DELETE FROM topics WHERE id = $1';
    await baseDatos.query(consulta, [id]);
    return true;
  }

  async voteTopic(id) {
    const consulta = 'UPDATE topics SET votes = votes + 1 WHERE id = $1 RETURNING *';
    const resultado = await baseDatos.query(consulta, [id]);
    return resultado.rows[0];
  }

  // CRUD para ENLACES

  async addLink(idTema, enlace, descripcion) {
    const consulta = 'INSERT INTO links (topic_id, url, description, votes) VALUES ($1, $2, $3, 0) RETURNING *';
    const resultado = await baseDatos.query(consulta, [idTema, enlace, descripcion]);
    return resultado.rows[0];
  }

  async updateLink(idTema, idEnlace, enlace, descripcion) {
    const consulta = 'UPDATE links SET url = $1, description = $2 WHERE id = $3 AND topic_id = $4 RETURNING *';
    const resultado = await baseDatos.query(consulta, [enlace, descripcion, idEnlace, idTema]);
    return resultado.rows[0];
  }

  async deleteLink(idTema, idEnlace) {
    const consulta = 'DELETE FROM links WHERE id = $1 AND topic_id = $2';
    await baseDatos.query(consulta, [idEnlace, idTema]);
    return true;
  }

  async voteLink(idTema, idEnlace) {
    const consulta = 'UPDATE links SET votes = votes + 1 WHERE id = $1 AND topic_id = $2 RETURNING *';
    const resultado = await baseDatos.query(consulta, [idEnlace, idTema]);
    return resultado.rows[0];
  }
}

module.exports = new ModeloTemas();
