const { Pool } = require('pg');

// Configuración de conexión (ajusta según tu instalación)
const baseDatos = new Pool({
  user: 'postgres',           // Usuario por defecto de PostgreSQL
  host: 'localhost',          // Servidor local
  database: 'voting_system',  // Nombre de tu base de datos
  password: '123',      // Contraseña de tu usuario (ajusta según tu configuración)
  port: 5432,                 // Puerto por defecto de PostgreSQL
});

// Probar conexión
baseDatos.on('connect', () => {
  console.log(' Conectado a PostgreSQL');
});

baseDatos.on('error', (err) => {
  console.error(' Error en la conexión:', err);
});

module.exports = baseDatos;
