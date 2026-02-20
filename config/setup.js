// config/setup.js
// SCRIPT PARA CREAR LAS TABLAS EN POSTGRESQL

const { Pool } = require('pg');

// Conexión temporal para crear la base de datos
const presaConfiguración = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres', // Conectar a la BD por defecto primero
  password: '123',
  port: 5432,
});

async function configurarBaseDatos() {
  try {
    console.log(' Configurando base de datos...');

    // Crear base de datos si no existe
    await presaConfiguración.query(`
      SELECT 'CREATE DATABASE voting_system'
      WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'voting_system')
    `).catch(() => {
      // Si falla, intentar crear directamente
      return presaConfiguración.query('CREATE DATABASE voting_system');
    });

    console.log(' Base de datos "voting_system" lista');
    await presaConfiguración.end();

    // Conectar a la nueva base de datos
    const baseDatos = new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'voting_system',
      password: '123',
      port: 5432,
    });

    // Crear tabla de temas
    await baseDatos.query(`
      CREATE TABLE IF NOT EXISTS topics (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        votes INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log(' Tabla "topics" creada');

    // Crear tabla de enlaces
    await baseDatos.query(`
      CREATE TABLE IF NOT EXISTS links (
        id SERIAL PRIMARY KEY,
        topic_id INTEGER NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
        url TEXT NOT NULL,
        description TEXT NOT NULL,
        votes INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log(' Tabla "links" creada');

    // Insertar datos de ejemplo
    const verificacionTemas = await baseDatos.query('SELECT COUNT(*) FROM topics');
    if (verificacionTemas.rows[0].count === '0') {
      console.log(' Insertando datos de ejemplo...');
      
      const tema1 = await baseDatos.query(
        'INSERT INTO topics (name, votes) VALUES ($1, $2) RETURNING id',
        ['JavaScript', 5]
      );
      
      const tema2 = await baseDatos.query(
        'INSERT INTO topics (name, votes) VALUES ($1, $2) RETURNING id',
        ['Node.js', 3]
      );

      await baseDatos.query(
        'INSERT INTO links (topic_id, url, description, votes) VALUES ($1, $2, $3, $4)',
        [tema1.rows[0].id, 'https://javascript.info', 'Tutorial completo', 3]
      );

      await baseDatos.query(
        'INSERT INTO links (topic_id, url, description, votes) VALUES ($1, $2, $3, $4)',
        [tema1.rows[0].id, 'https://mdn.mozilla.org', 'MDN Web Docs', 2]
      );

      await baseDatos.query(
        'INSERT INTO links (topic_id, url, description, votes) VALUES ($1, $2, $3, $4)',
        [tema2.rows[0].id, 'https://nodejs.org', 'Documentación oficial', 1]
      );

      console.log(' Datos de ejemplo insertados');
    }

    await baseDatos.end();
    console.log('\n ¡Base de datos configurada correctamente!');
    console.log(' Ahora ejecuta: npm start');

  } catch (error) {
    console.error(' Error al configurar la base de datos:', error.message);
    console.log('\n Asegúrate de que PostgreSQL esté corriendo y que:');
    console.log('   - Usuario: postgres');
    console.log('   - Contraseña: 123');
    console.log('   - Puerto: 5432');
    process.exit(1);
  }
}

configurarBaseDatos();
