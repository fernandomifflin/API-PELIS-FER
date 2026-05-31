
# API de Películas

API REST desarrollada con Node.js, Express y Sequelize para la gestión de un catálogo de películas.

El proyecto implementa operaciones CRUD, autenticación mediante JSON Web Tokens (JWT), persistencia de datos utilizando SQLite y PostgreSQL, además de una interfaz web para visualizar el catálogo desde el navegador.

---

## Descripción General

La aplicación permite administrar un catálogo de películas mediante una API RESTful.

Las operaciones de consulta son públicas, mientras que las operaciones de creación, actualización y eliminación están protegidas mediante autenticación JWT.

Además de los endpoints REST, la aplicación incluye una interfaz visual que permite visualizar el catálogo desde el navegador mediante una tabla HTML estilizada.

---

## Características

- CRUD completo de películas.
- Autenticación mediante JWT.
- Middleware de validación de tokens.
- Middleware de logging para monitoreo de solicitudes.
- Persistencia de datos con SQLite.
- Compatibilidad con PostgreSQL para producción.
- Tabla HTML para visualización del catálogo.
- Página principal personalizada.
- Despliegue en Render.

---

## Arquitectura del Proyecto

La aplicación está organizada utilizando una arquitectura sencilla basada en capas.

### Express.js

Express se encarga de gestionar las rutas, recibir solicitudes HTTP y devolver respuestas al cliente.

### Sequelize ORM

Sequelize funciona como una capa de abstracción entre la aplicación y la base de datos.

Permite:

- Crear modelos.
- Consultar registros.
- Actualizar información.
- Eliminar registros.
- Sincronizar tablas automáticamente.

### SQLite

Durante el desarrollo se utiliza SQLite para almacenar permanentemente los datos en el archivo:

```text
peliculas.sqlite
```

### PostgreSQL

Para producción se utiliza PostgreSQL hospedado en Render.

La conexión se realiza mediante la variable de entorno:

```env
DATABASE_URL
```

### JWT (JSON Web Token)

La autenticación se realiza mediante tokens JWT.

Cuando un usuario inicia sesión correctamente:

1. Se validan sus credenciales.
2. Se genera un token.
3. El token debe enviarse en las rutas protegidas.

Ejemplo:

```http
Authorization: Bearer TOKEN_GENERADO
```

---

## Tecnologías Utilizadas

| Tecnología | Función |
|------------|----------|
| Node.js | Entorno de ejecución |
| Express.js | Framework backend |
| Sequelize | ORM |
| SQLite | Base de datos local |
| PostgreSQL | Base de datos en producción |
| JWT | Autenticación |
| Render | Despliegue |
| HTML/CSS | Interfaz visual |

---

## Endpoints Disponibles

| Método | Ruta | Descripción | Protección |
|----------|----------|----------|----------|
| GET | / | Página principal | No |
| GET | /peliculas | Obtener todas las películas | No |
| GET | /ver-tabla | Mostrar catálogo en HTML | No |
| POST | /login | Obtener token JWT | No |
| POST | /peliculas | Crear película | Sí |
| PUT | /peliculas/:id | Actualizar película | Sí |
| DELETE | /peliculas/:id | Eliminar película | Sí |

---

## Credenciales de Prueba

```text
Usuario: admin
Contraseña: 1234
```

---

## Instalación Local

### Clonar el repositorio

```bash
git clone https://github.com/fernandomifflin/API-PELIS-FER.git

cd API-PELIS-FER
```
### Instalar dependencias

```bash
npm install
```

### Ejecutar la aplicación

```bash
node app.js
```

Servidor:

```text
http://localhost:3000
```

---

## Variables de Entorno

Para producción:

```env
DATABASE_URL=postgresql://usuario:password@host:5432/database
JWT_SECRET=Contraseña_Perrona_JWT
```

---

## Estructura del Proyecto

```text
.
├── app.js
├── database.js
├── peliculas.sqlite
├── middleware
│   └── logger.js
├── models
│   └── Pelicula.js
├── package.json
└── README.md
```

---

## Uso con Postman

### Login

POST

```http
http://localhost:3000/login
```

Body:

```json
{
    "username": "admin",
    "password": "1234"
}
```

Respuesta:

```json
{
    "token": "..."
}
```

---

### Obtener películas

GET

```http
http://localhost:3000/peliculas
```

---

### Crear película

POST

```http
http://localhost:3000/peliculas
```

Header:

```http
Authorization: Bearer TOKEN
```

Body:

```json
{
    "titulo": "El Padrino",
    "director": "Francis Ford Coppola",
    "anio": 1972,
    "genero": "Drama",
    "puntuacion": 9
}
```

---

### Actualizar película

PUT

```http
http://localhost:3000/peliculas/1
```

Header:

```http
Authorization: Bearer TOKEN
```

Body:

```json
{
    "puntuacion": 10
}
```

---

### Eliminar película

DELETE

```http
http://localhost:3000/peliculas/1
```

Header:

```http
Authorization: Bearer TOKEN
```

---

## Interfaz Web

La aplicación incluye una interfaz accesible desde el navegador.

Características:

- Página principal personalizada.
- Tabla HTML generada dinámicamente.
- Diseño responsivo.
- Tema visual oscuro.
- Fondos temáticos relacionados con cine y espacio.
- Efectos visuales modernos y animaciones.

---

## Despliegue

El proyecto se encuentra preparado para ejecutarse tanto en entorno local como en Render utilizando PostgreSQL.

Pasos generales:

1. Conectar repositorio GitHub.
2. Crear base de datos PostgreSQL.
3. Configurar variable DATABASE_URL.
4. Realizar deploy automático.

---

## Aprendizajes del Proyecto

Durante el desarrollo de esta práctica se implementaron conceptos fundamentales de desarrollo backend:

- Diseño de APIs REST.
- Operaciones CRUD.
- Persistencia de datos.
- Uso de Sequelize ORM.
- Middleware personalizado.
- Autenticación JWT.
- Protección de rutas.
- Integración con PostgreSQL.
- Despliegue en la nube.

---

## Autor

 Jesús Fernando López Vázquez

---
Proyecto desarrollado con fines académicos para la asignatura de Desarrollo web del lado cliente
