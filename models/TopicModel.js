
// MODELO: Maneja los datos usando PostgreSQL con SQL puro

const baseDatos = require('../config/database');  // Conexión reutilizable al pool de PostgreSQL.

class ModeloTemas {
  
  // CRUD para TEMAS
  
  async getAllTopics() {   // Traer todos los temas con sus enlaces asociados (si los hay) y ordenados por votos ,
  //  y si no tienen enlaces, mostrar igual el tema con un array vacío de enlaces
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
      links: tema.links || [] // Si no hay enlaces, asignar un array vacío
    }));
  }  

  async getTopicById(id) {  // Traer un tema específico por su ID, con sus enlaces asociados (si los hay) y ordenados por votos
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
    if (resultado.rows.length === 0) return null;  // Si no se encuentra el tema, retornar null
    
    const tema = resultado.rows[0];  // Formatear resultado para que links sea un array (no null)
    return {
      ...tema,
      links: tema.links || []  // Si no hay enlaces, asignar un array vacío
    };
  }

  async createTopic(nombre) { // Crear un nuevo tema con el nombre proporcionado y votos iniciales en 0
    const consulta = 'INSERT INTO topics (name, votes) VALUES ($1, 0) RETURNING *';
    const resultado = await baseDatos.query(consulta, [nombre]); // Retornar el tema recién creado con su ID generado automáticamente 
    return resultado.rows[0]
  }

  async updateTopic(id, nombre) { // Actualizar el nombre de un tema específico por su ID, manteniendo los votos actuales
    const consulta = 'UPDATE topics SET name = $1 WHERE id = $2 RETURNING *';
    const resultado = await baseDatos.query(consulta, [nombre, id]);  // Retornar el tema actualizado con su ID y votos actuales
    return resultado.rows[0];
  }

  async deleteTopic(id) { // Eliminar un tema específico por su ID, junto con sus enlaces asociados (gracias a ON DELETE CASCADE)
    const consulta = 'DELETE FROM topics WHERE id = $1';
    await baseDatos.query(consulta, [id]); // No es necesario eliminar enlaces manualmente debido a la relación ON DELETE CASCADE en la tabla links
    return true;
  }

  async voteTopic(id) { // Incrementar el conteo de votos de un tema específico por su ID y retornar el tema actualizado 
    const consulta = 'UPDATE topics SET votes = votes + 1 WHERE id = $1 RETURNING *';
    const resultado = await baseDatos.query(consulta, [id]); // Retornar el tema actualizado con su ID, nombre y nuevo conteo de votos
    return resultado.rows[0];
  }

  // CRUD para ENLACES

  async addLink(idTema, enlace, descripcion) {  // Agrega un nuevo enlace a un tema en especifico por su ID , con votos iniciales en 0
    const consulta = 'INSERT INTO links (topic_id, url, description, votes) VALUES ($1, $2, $3, 0) RETURNING *';
    const resultado = await baseDatos.query(consulta, [idTema, enlace, descripcion]); // Retornar el enlace recién creado con su ID generado automáticamente, asociado al tema correspondiente
    return resultado.rows[0];
  }

  async updateLink(idTema, idEnlace, enlace, descripcion) {  // Actualiza un enlace específico por su ID y el ID del tema al que pertenece, manteniendo los votos actuales
    const consulta = 'UPDATE links SET url = $1, description = $2 WHERE id = $3 AND topic_id = $4 RETURNING *';
    const resultado = await baseDatos.query(consulta, [enlace, descripcion, idEnlace, idTema]);
    return resultado.rows[0];
  }

  async deleteLink(idTema, idEnlace) {  // Elimina un enlace específico por su ID y el ID del tema al que pertenece
    const consulta = 'DELETE FROM links WHERE id = $1 AND topic_id = $2';
    await baseDatos.query(consulta, [idEnlace, idTema]); 
    return true;
  }

  async voteLink(idTema, idEnlace) { // Incrementa el conteo de votos de un enlace específico por su ID y el ID del tema al que pertenece, y retorna el enlace actualizado
    const consulta = 'UPDATE links SET votes = votes + 1 WHERE id = $1 AND topic_id = $2 RETURNING *';
    const resultado = await baseDatos.query(consulta, [idEnlace, idTema]); // Retornar el enlace actualizado con su ID, URL, descripción y nuevo conteo de votos
    return resultado.rows[0];
  }
}

module.exports = new ModeloTemas();  // Exportar una instancia de la clase ModeloTemas para ser utilizada en el controlador y otras partes de la aplicación.
