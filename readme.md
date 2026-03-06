# Sistema CRUD con Votaciones + PostgreSQL

Sistema de gestión de temas de aprendizaje con sistema de votaciones, implementado con **Node.js**, **Express**, **arquitectura MVC** y **PostgreSQL**.

## 🎯 Características Implementadas

✅ **Servidor Express** configurado con Node.js  
✅ **Arquitectura MVC** (Modelo-Vista-Controlador)  
✅ **CRUD Completo** para temas y enlaces  
✅ **Sistema de votaciones** en tiempo real  
✅ **Motor de plantillas EJS**  
✅ **JavaScript puro** en el frontend  
✅ **PostgreSQL** para persistencia de datos  
✅ **SQL puro** (sin ORM)  
✅ **Datos persisten** entre reinicios del servidor  

## 📁 Estructura del Proyecto

```
express-crud-voting/
├── config/
│   ├── database.js         # Configuración de PostgreSQL
│   └── setup.js            # Script para crear tablas
├── models/
│   └── topicModel.js       # MODELO: Queries SQL
├── views/
│   └── index.ejs           # VISTA: Interfaz de usuario
├── controllers/
│   └── topicController.js  # CONTROLADOR: Lógica de negocio
├── routes/
│   └── topicRoutes.js      # Definición de rutas
├── public/
│   ├── js/
│   │   └── app.js          # JavaScript puro del cliente
│   └── css/
│       └── styles.css      # Estilos CSS
├── server.js               # Servidor Express principal
└── package.json            # Dependencias
```

## 🚀 Instalación y Configuración

### 1. Instalar dependencias de Node.js
```bash
npm install
```

### 2. Configurar PostgreSQL

**Opción A: Usar la configuración por defecto**
El proyecto viene configurado para:
- Usuario: `postgres`
- Contraseña: `postgres`
- Puerto: `5432`
- Base de datos: `voting_system`

**Opción B: Cambiar la configuración**
Edita `config/database.js` y `config/setup.js` con tus credenciales:
```javascript
const pool = new Pool({
  user: 'TU_USUARIO',
  host: 'localhost',
  database: 'voting_system',
  password: 'TU_CONTRASEÑA',
  port: 5432,
});
```

### 3. Crear la base de datos y tablas
```bash
npm run setup
```

Este comando:
- ✅ Crea la base de datos `voting_system`
- ✅ Crea las tablas `topics` y `links`
- ✅ Inserta datos de ejemplo

### 4. Ejecutar el servidor
```bash
npm start
```

### 5. Abrir en el navegador
```
http://localhost:3000
```

## 🗄️ Estructura de Base de Datos

### Tabla: topics
```sql
CREATE TABLE topics (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabla: links
```sql
CREATE TABLE links (
  id SERIAL PRIMARY KEY,
  topic_id INTEGER NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  description TEXT NOT NULL,
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Relación:** Un tema puede tener muchos enlaces (1:N)  
**Cascada:** Si eliminas un tema, se eliminan automáticamente sus enlaces

## 📝 Funcionalidades

### Temas
- ✅ **Crear** nuevos temas de aprendizaje
- ✅ **Leer** todos los temas (ordenados por votos)
- ✅ **Actualizar** nombre de temas existentes
- ✅ **Eliminar** temas (y sus enlaces en cascada)
- ✅ **Votar** por temas (actualización en tiempo real)

### Enlaces
- ✅ **Agregar** enlaces a temas
- ✅ **Editar** URL y descripción
- ✅ **Eliminar** enlaces
- ✅ **Votar** por enlaces (reordenamiento automático)

### Persistencia
- ✅ **Datos guardados** en PostgreSQL
- ✅ **Persisten** entre reinicios del servidor
- ✅ **Queries SQL** eficientes con JOINs

## 🏗️ Arquitectura MVC

### Modelo (`models/topicModel.js`)
- Queries SQL con `pg` (node-postgres)
- CRUD para temas y enlaces
- Manejo de votos y ordenamiento
- Joins entre tablas

### Vista (`views/index.ejs`)
- Motor de plantillas EJS
- Renderiza datos desde PostgreSQL
- Interfaz de usuario interactiva

### Controlador (`controllers/topicController.js`)
- Recibe solicitudes HTTP
- Ejecuta queries asíncronas con async/await
- Maneja errores
- Coordina Modelo y Vista

## 🔧 Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **EJS** - Motor de plantillas
- **PostgreSQL** - Base de datos relacional
- **pg** - Cliente de PostgreSQL para Node.js
- **JavaScript puro** - Interacciones del cliente
- **CSS3** - Estilos y animaciones

## 📡 Endpoints API

### Temas
- `GET /` - Listar todos los temas
- `POST /topics` - Crear nuevo tema
- `POST /topics/:id/update` - Actualizar tema
- `POST /topics/:id/delete` - Eliminar tema
- `POST /topics/:id/vote` - Votar por tema

### Enlaces
- `POST /topics/:topicId/links` - Agregar enlace
- `POST /topics/:topicId/links/:linkId/update` - Actualizar enlace
- `POST /topics/:topicId/links/:linkId/delete` - Eliminar enlace
- `POST /topics/:topicId/links/:linkId/vote` - Votar por enlace

## 🐘 Queries SQL Importantes

### Obtener todos los temas con sus enlaces
```sql
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
```

### Incrementar votos
```sql
UPDATE topics SET votes = votes + 1 WHERE id = $1 RETURNING *
```

## ⚠️ Solución de Problemas

### Error de conexión a PostgreSQL
**Problema:** `Error: connect ECONNREFUSED`
**Solución:**
1. Verifica que PostgreSQL esté corriendo
2. Revisa las credenciales en `config/database.js`
3. Asegúrate que el puerto sea 5432

### Error al crear la base de datos
**Problema:** `permission denied to create database`
**Solución:**
```bash
# En Windows, abre pgAdmin y crea la BD manualmente
# O usa el usuario postgres con privilegios de superusuario
```

### Los datos no persisten
**Problema:** Los datos se pierden al reiniciar
**Solución:**
1. Verifica que PostgreSQL esté corriendo
2. Ejecuta `npm run setup` de nuevo
3. Revisa los logs del servidor

## 📚 Aprendizaje - Diferencias con SQLite

| Aspecto | SQLite | PostgreSQL |
|---------|--------|------------|
| **Conexión** | Archivo local | Servidor de BD |
| **Setup** | Automático | Requiere instalación |
| **Queries** | SQL estándar | SQL + funciones avanzadas |
| **Producción** | No recomendado | ✅ Sí, profesional |
| **Escalabilidad** | Limitada | Alta |

**El SQL básico es 95% igual**, solo cambia cómo te conectas.

## 🎓 Conceptos Aplicados

- **Separación de responsabilidades** (MVC)
- **Async/Await** para operaciones asíncronas
- **Prepared Statements** ($1, $2) para seguridad
- **Relaciones de base de datos** (1:N)
- **Cascade Delete** en SQL
- **Joins y agregaciones** (JSON_AGG)
- **Código limpio y mantenible**

## ✨ Características Especiales

1. **Persistencia real** - Los datos NO se pierden
2. **Votaciones en tiempo real** - Actualización sin recargar
3. **Queries optimizadas** - JOINs eficientes
4. **SQL puro** - Sin ORM, aprendés SQL real
5. **Manejo de errores** - Try/catch en todas las operaciones
6. **Cascada** - Eliminar tema elimina sus enlaces
7. **Animaciones** - Feedback visual inmediato

---

**¡Listo para aprobar el desafío con PostgreSQL! 🐘🚀**
