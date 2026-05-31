// Importar las librerías que vamos a necesitar
const express = require('express');
const jwt = require('jsonwebtoken');
const { Sequelize, DataTypes } = require('sequelize');
const logger = require('./middleware/logger');

// ============================================
// CONFIGURACIÓN DE LA BASE DE DATOS
// ============================================
let sequelize;

const databaseUrl = process.env.DATABASE_URL;

if (databaseUrl) {
    sequelize = new Sequelize(databaseUrl, {
        dialect: 'postgres',
        protocol: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        logging: false
    });
    console.log('Conectando a PostgreSQL en la nube, apá');
} else {
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: './peliculas.sqlite',
        logging: false
    });
    console.log('Conectando a SQLite local');
}

// ============================================
// DEFINIR EL MODELO DE PELICULA
// ============================================
const Pelicula = sequelize.define('Pelicula', {
    titulo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    director: {
        type: DataTypes.STRING,
        allowNull: false
    },
    anio: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    genero: {
        type: DataTypes.STRING,
        allowNull: false
    },
    puntuacion: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'peliculas'
});

// Crear la aplicación de express y definir el puerto
const app = express();
const PORT = process.env.PORT || 3000;

// Clave secreta para firmar los tokens
const SECRET_KEY = 'Contraseña_Perrona_JWT';

// Usar el middleware que registra todas las peticiones en consola
app.use(logger);
// Usar el middleware que permite leer JSON en el cuerpo de las peticiones
app.use(express.json());

// ============================================
// MIDDLEWARE PARA VERIFICAR EL TOKEN
// ============================================
const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ 
            exito: false, 
            mensaje: 'Acceso denegado. Token requerido' 
        });
    }
    
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ 
                exito: false, 
                mensaje: 'Token invalido o expirado' 
            });
        }
        
        req.usuario = decoded;
        next();
    });
};

// ============================================
// RUTA DE LOGIN
// ============================================
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === 'admin' && password === '1234') {
        const usuario = { 
            id: 1, 
            nombre: 'Administrador',
            rol: 'admin'
        };
        
        const token = jwt.sign(usuario, SECRET_KEY, { expiresIn: '1h' });
        
        res.json({
            exito: true,
            mensaje: 'Login exitoso',
            token: token
        });
    } else {
        res.status(401).json({
            exito: false,
            mensaje: 'Usuario o contrasena incorrectos'
        });
    }
});

// ============================================
// FUNCIÓN PARA INICIALIZAR LA BASE DE DATOS
// ============================================
async function iniciarBaseDeDatos() {
    try {
        await sequelize.sync();
        console.log('Base de datos sincronizada');

        const cantidad = await Pelicula.count();
        
        if (cantidad === 0) {
            await Pelicula.bulkCreate([
                { titulo: 'El Padrino', director: 'Francis Ford Coppola', anio: 1972, genero: 'Drama', puntuacion: 9 },
                { titulo: 'El Padrino 2', director: 'Francis Ford Coppola', anio: 1974, genero: 'Drama', puntuacion: 9 },
                { titulo: 'El Padrino 3', director: 'Francis Ford Coppola', anio: 1990, genero: 'Drama', puntuacion: 7 },
                { titulo: 'El Irlandes', director: 'Martin Scorsese', anio: 2019, genero: 'Crimen', puntuacion: 8 },
                { titulo: 'Taxi Driver', director: 'Martin Scorsese', anio: 1976, genero: 'Drama', puntuacion: 9 },
                { titulo: 'Goodfellas', director: 'Martin Scorsese', anio: 1990, genero: 'Crimen', puntuacion: 9 },
                { titulo: 'Pulp Fiction', director: 'Quentin Tarantino', anio: 1994, genero: 'Crimen', puntuacion: 9 },
                { titulo: 'Kill Bill Vol.1', director: 'Quentin Tarantino', anio: 2003, genero: 'Accion', puntuacion: 8 },
                { titulo: 'Django Unchained', director: 'Quentin Tarantino', anio: 2012, genero: 'Western', puntuacion: 8 },
                { titulo: 'The Dark Knight', director: 'Christopher Nolan', anio: 2008, genero: 'Accion', puntuacion: 9 },
                { titulo: 'Inception', director: 'Christopher Nolan', anio: 2010, genero: 'Ciencia Ficcion', puntuacion: 8 },
                { titulo: 'Interstellar', director: 'Christopher Nolan', anio: 2014, genero: 'Ciencia Ficcion', puntuacion: 9 },
                { titulo: 'The Matrix', director: 'Lana Wachowski', anio: 1999, genero: 'Ciencia Ficcion', puntuacion: 9 },
                { titulo: 'Forrest Gump', director: 'Robert Zemeckis', anio: 1994, genero: 'Drama', puntuacion: 8 },
                { titulo: 'Gladiator', director: 'Ridley Scott', anio: 2000, genero: 'Accion', puntuacion: 8 },
                { titulo: 'Saving Private Ryan', director: 'Steven Spielberg', anio: 1998, genero: 'Guerra', puntuacion: 9 },
                { titulo: 'The Shawshank Redemption', director: 'Frank Darabont', anio: 1994, genero: 'Drama', puntuacion: 9 },
                { titulo: 'Parasite', director: 'Bong Joon-ho', anio: 2019, genero: 'Suspenso', puntuacion: 9 },
                { titulo: 'Your Name', director: 'Makoto Shinkai', anio: 2016, genero: 'Animacion', puntuacion: 8 },
                { titulo: 'Oldboy', director: 'Park Chan-wook', anio: 2003, genero: 'Suspenso', puntuacion: 8 },
                { titulo: 'Amelie', director: 'Jean-Pierre Jeunet', anio: 2001, genero: 'Comedia', puntuacion: 8 },
                { titulo: 'City of God', director: 'Fernando Meirelles', anio: 2002, genero: 'Drama', puntuacion: 9 },
                { titulo: 'The Secret in Their Eyes', director: 'Juan Jose Campanella', anio: 2009, genero: 'Suspenso', puntuacion: 8 },
                { titulo: 'Wild Tales', director: 'Damian Szifron', anio: 2014, genero: 'Comedia', puntuacion: 8 },
                { titulo: 'Roma', director: 'Alfonso Cuaron', anio: 2018, genero: 'Drama', puntuacion: 8 },
                { titulo: 'The Handmaiden', director: 'Park Chan-wook', anio: 2016, genero: 'Drama', puntuacion: 8 },
                { titulo: 'Portrait of a Lady on Fire', director: 'Celine Sciamma', anio: 2019, genero: 'Drama', puntuacion: 8 },
                { titulo: 'Fight Club', director: 'David Fincher', anio: 1999, genero: 'Drama', puntuacion: 9 },
                { titulo: 'Se7en', director: 'David Fincher', anio: 1995, genero: 'Suspenso', puntuacion: 9 },
                { titulo: 'The Social Network', director: 'David Fincher', anio: 2010, genero: 'Drama', puntuacion: 8 },
                { titulo: 'Jurassic Park', director: 'Steven Spielberg', anio: 1993, genero: 'Aventura', puntuacion: 8 },
                { titulo: 'E.T.', director: 'Steven Spielberg', anio: 1982, genero: 'Ciencia Ficcion', puntuacion: 8 },
                { titulo: 'Schindler List', director: 'Steven Spielberg', anio: 1993, genero: 'Drama', puntuacion: 9 },
                { titulo: 'Alien', director: 'Ridley Scott', anio: 1979, genero: 'Ciencia Ficcion', puntuacion: 8 },
                { titulo: 'Blade Runner', director: 'Ridley Scott', anio: 1982, genero: 'Ciencia Ficcion', puntuacion: 8 },
                { titulo: 'The Martian', director: 'Ridley Scott', anio: 2015, genero: 'Ciencia Ficcion', puntuacion: 8 },
                { titulo: 'Whiplash', director: 'Damien Chazelle', anio: 2014, genero: 'Drama', puntuacion: 9 },
                { titulo: 'La La Land', director: 'Damien Chazelle', anio: 2016, genero: 'Musical', puntuacion: 8 },
                { titulo: 'The Revenant', director: 'Alejandro G. Inarritu', anio: 2015, genero: 'Aventura', puntuacion: 8 },
                { titulo: 'Birdman', director: 'Alejandro G. Inarritu', anio: 2014, genero: 'Comedia', puntuacion: 8 },
                { titulo: 'Her', director: 'Spike Jonze', anio: 2013, genero: 'Ciencia Ficcion', puntuacion: 8 },
                { titulo: 'Being John Malkovich', director: 'Spike Jonze', anio: 1999, genero: 'Comedia', puntuacion: 8 },
                { titulo: 'Prisoners', director: 'Denis Villeneuve', anio: 2013, genero: 'Suspenso', puntuacion: 9 },
                { titulo: 'Children of Men', director: 'Alfonso Cuaron', anio: 2006, genero: 'Ciencia Ficcion', puntuacion: 9 },
                { titulo: 'No Country for Old Men', director: 'Joel y Ethan Coen', anio: 2007, genero: 'Crimen', puntuacion: 9 },
                { titulo: 'Drive', director: 'Nicolas Winding Refn', anio: 2011, genero: 'Drama', puntuacion: 8 },
                { titulo: 'Memories of Murder', director: 'Bong Joon-ho', anio: 2003, genero: 'Suspenso', puntuacion: 9 }
            ]);
            console.log('Peliculas insertadas correctamente');
        } else {
            console.log('Ya hay ' + cantidad + ' peliculas en la BD. No se insertaron duplicados, todo bien');
        }
    } catch (error) {
        console.error('Error al iniciar la base de datos:', error);
    }
}

// ============================================
// RUTA 1: OBTENER TODAS LAS PELICULAS EN FORMATO JSON
// ============================================
app.get('/peliculas', async (req, res, next) => {
    try {
        const todasLasPeliculas = await Pelicula.findAll();
        res.json({
            exito: true,
            cantidad: todasLasPeliculas.length,
            datos: todasLasPeliculas
        });
    } catch (error) {
        next(error);
    }
});

// ============================================
// RUTA 1.5: OBTENER UNA PELICULA POR ID (NUEVO)
// ============================================
app.get('/peliculas/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const pelicula = await Pelicula.findByPk(id);
        
        if (!pelicula) {
            return res.status(404).json({
                exito: false,
                mensaje: `No existe la pelicula con ID ${id}, compa`
            });
        }
        
        res.json({
            exito: true,
            datos: pelicula
        });
    } catch (error) {
        next(error);
    }
});

// ============================================
// RUTA 2: CREAR UNA NUEVA PELICULA (POST)
// ============================================
app.post('/peliculas', verificarToken, async (req, res, next) => {
    try {
        const { titulo, director, anio, genero, puntuacion } = req.body;

        if (!titulo || !director || !anio || !genero) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Faltan campos: titulo, director, anio y genero se necesitan, que onda con eso pues'
            });
        }

        const nuevaPelicula = await Pelicula.create({
            titulo,
            director,
            anio,
            genero,
            puntuacion: puntuacion !== undefined ? puntuacion : 0
        });

        res.status(201).json({
            exito: true,
            mensaje: 'Pelicula agregada exitosamente, apá',
            datos: nuevaPelicula
        });
    } catch (error) {
        next(error);
    }
});

// ============================================
// RUTA 3: ACTUALIZAR UNA PELICULA POR SU ID (PUT)
// ============================================
app.put('/peliculas/:id', verificarToken, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { titulo, director, anio, genero, puntuacion } = req.body;

        const pelicula = await Pelicula.findByPk(id);

        if (!pelicula) {
            return res.status(404).json({
                exito: false,
                mensaje: `No existe la pelicula con ID ${id}, me saca mashin de onda oiga`
            });
        }

        await pelicula.update({
            titulo: titulo !== undefined ? titulo : pelicula.titulo,
            director: director !== undefined ? director : pelicula.director,
            anio: anio !== undefined ? anio : pelicula.anio,
            genero: genero !== undefined ? genero : pelicula.genero,
            puntuacion: puntuacion !== undefined ? puntuacion : pelicula.puntuacion
        });

        res.json({
            exito: true,
            mensaje: 'Pelicula actualizada correctamente, viejo',
            datos: pelicula
        });
    } catch (error) {
        next(error);
    }
});

// ============================================
// RUTA 4: ELIMINAR UNA PELICULA POR SU ID (DELETE)
// ============================================
app.delete('/peliculas/:id', verificarToken, async (req, res, next) => {
    try {
        const { id } = req.params;

        const pelicula = await Pelicula.findByPk(id);

        if (!pelicula) {
            return res.status(404).json({
                exito: false,
                mensaje: `No existe pelicula con ID ${id} ponte las pilas, viejo`
            });
        }

        await pelicula.destroy();

        res.json({
            exito: true,
            mensaje: `Pelicula con ID ${id} eliminadisima, toro`
        });
    } catch (error) {
        next(error);
    }
});

// ============================================
// RUTA 5: MOSTRAR TABLA HTML CON TODAS LAS PELICULAS
// ============================================
app.get('/ver-tabla', async (req, res, next) => {
    try {
        const peliculas = await Pelicula.findAll();
        
        let html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Catalogo de Peliculas</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background-image: url("https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNTc5fDB8MXxzZWFyY2h8Nnx8c3BhY2V8ZW58MHx8fHwxNzc5NTkyMjkyfDA&ixlib=rb-4.1.0&q=80&w=2560");
                        min-height: 100vh;
                        padding: 40px 20px;
                    }
                    
                    .container {
                        max-width: 1400px;
                        margin: 0 auto;
                    }
                    
                    .header {
                        background-image: url("https://images.unsplash.com/photo-1573339886303-e2ee2fcad317?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNTc5fDB8MXxzZWFyY2h8NDV8fG1vdmllJTIwdGhlYXRlcnxlbnwwfHx8fDE3Nzk1OTE3NDl8MA&ixlib=rb-4.1.0&q=80&w=2380");
                        background-size: cover;
                        color: white;
                        padding: 30px;
                        border-radius: 20px 20px 0 0;
                        text-align: center;
                    }
                    
                    .header h1 {
                        font-size: 2.5rem;
                        margin-bottom: 10px;
                    }
                    
                    .stats-bar {
                        background: #2e7d32;
                        color: white;
                        padding: 15px 30px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        flex-wrap: wrap;
                        gap: 15px;
                    }
                    
                    .stats-bar .total span {
                        font-weight: bold;
                        font-size: 1.5rem;
                        background: #1b5e1b;
                        padding: 5px 12px;
                        border-radius: 30px;
                        margin-left: 10px;
                    }
                    
                    .nav-links {
                        display: flex;
                        gap: 20px;
                    }
                    
                    .nav-links a {
                        color: white;
                        text-decoration: none;
                        background: #1b5e1b;
                        padding: 8px 20px;
                        border-radius: 25px;
                    }
                    
                    .table-container {
                        background: white;
                        overflow-x: auto;
                        border-radius: 0 0 20px 20px;
                    }
                    
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    
                    th {
                        background: #022309;
                        color: white;
                        padding: 15px 12px;
                        text-align: left;
                    }
                    
                    td {
                        padding: 12px;
                        border-bottom: 1px solid #e0e0e0;
                    }
                    
                    tr:hover {
                        background-color: #e8f5e9;
                    }
                    
                    .puntuacion-badge {
                        background: #4caf50;
                        color: white;
                        padding: 5px 10px;
                        border-radius: 20px;
                        display: inline-block;
                        font-weight: bold;
                        min-width: 50px;
                        text-align: center;
                    }
                    
                    .puntuacion-baja {
                        background: #f44336;
                    }
                    
                    .puntuacion-media {
                        background: #ff9800;
                    }
                    
                    .puntuacion-alta {
                        background: #4caf50;
                    }
                    
                    .footer {
                        text-align: center;
                        margin-top: 30px;
                        color: white;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Catalogo de Peliculas</h1>
                        <p>Coleccion de cine internacional pipirisnais</p>
                    </div>
                    
                    <div class="stats-bar">
                        <div class="total">
                            Total de peliculas: <span>${peliculas.length}</span>
                        </div>
                        <div class="nav-links">
                            <a href="/ver-tabla">Refrescar</a>
                            <a href="/">Inicio</a>
                            <a href="/peliculas">API JSON</a>
                        </div>
                    </div>
                    
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Titulo</th>
                                    <th>Director</th>
                                    <th>Año</th>
                                    <th>Genero</th>
                                    <th>Puntuacion</th>
                                </tr>
                            </thead>
                            <tbody>
        `;
        
        for (const p of peliculas) {
            let puntuacionClass = 'puntuacion-badge';
            if (p.puntuacion >= 9) {
                puntuacionClass = 'puntuacion-badge puntuacion-alta';
            } else if (p.puntuacion >= 7) {
                puntuacionClass = 'puntuacion-badge puntuacion-media';
            } else {
                puntuacionClass = 'puntuacion-badge puntuacion-baja';
            }
            
            html += `
                <tr>
                    <td>${p.id}</td>
                    <td><strong>${p.titulo}</strong></td>
                    <td>${p.director}</td>
                    <td>${p.anio}</td>
                    <td>${p.genero}</td>
                    <td><span class="${puntuacionClass}">${p.puntuacion}/10</span></td>
                </tr>
            `;
        }
        
        html += `
                            </tbody>
                        </table>
                    </div>
                    <div class="footer">
                        <p>Base de datos SQLite | ORM Sequelize | Express.js</p>
                    </div>
                </div>
            </body>
            </html>
        `;
        
        res.send(html);
    } catch (error) {
        next(error);
    }
});

// ============================================
// RUTA 6: PAGINA PRINCIPAL (INICIO)
// ============================================
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>API de Peliculas</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-image: url("https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNTc5fDB8MXxzZWFyY2h8Nnx8c3BhY2V8ZW58MHx8fHwxNzc5NTkyMjkyfDA&ixlib=rb-4.1.0&q=80&w=2560");
                    min-height: 100vh;
                    padding: 40px 20px;
                }
                
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                }
                
                .card {
                    background: rgba(255, 255, 255, 0.95);
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                }
                
                .header {
                    background-image: url("https://images.unsplash.com/photo-1573339886303-e2ee2fcad317?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNTc5fDB8MXxzZWFyY2h8NDV8fG1vdmllJTIwdGhlYXRlcnxlbnwwfHx8fDE3Nzk1OTE3NDl8MA&ixlib=rb-4.1.0&q=80&w=2380");
                    background-size: contain;
                    background-position-x: 0%;
                    backdrop-filter: blur(3px);
                    color: white;
                    padding: 40px 30px;
                    text-align: center;
                }
                
                .header h1 {
                    background-image: url("https://images.unsplash.com/photo-1536514498073-50e69d39c6cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNTc5fDB8MXxzZWFyY2h8NDF8fHNreXxlbnwwfHx8fDE3Nzk1OTI2MDJ8MA&ixlib=rb-4.1.0&q=80&w=2380");
                    color: transparent;
                    background-clip: text;
                    background-size: contain;
                    font-size: 3rem;
                    margin-bottom: 10px;
                }
                
                .content {
                    background-color: #071707;
                    padding: 40px 30px;
                }
                
                .routes {
                    display: flex;
                    gap: 30px;
                    justify-content: center;
                    flex-wrap: wrap;
                    margin-bottom: 40px;
                }
                
                .route-card {
                    background: white;
                    border-radius: 15px;
                    padding: 30px 25px;
                    text-align: center;
                    flex: 1;
                    min-width: 250px;
                    border: 1px solid #e0e0e0;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                
                .route-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                }
                
                .route-card h3 {
                    color: #000000;
                    margin-bottom: 10px;
                    font-size: 1.5rem;
                }
                
                .route-link {
                    display: inline-block;
                    background-color: #3e643e;
                    color: white;
                    text-decoration: none;
                    padding: 10px 25px;
                    border-radius: 25px;
                    transition: background-color 0.3s ease;
                }
                
                .route-link:hover {
                    background-color: #2a4a2a;
                }
                
                .info-box {
                    background: #e8f5e9;
                    border-radius: 15px;
                    padding: 25px;
                    text-align: center;
                }
                
                .info-stats {
                    display: flex;
                    justify-content: center;
                    gap: 40px;
                    flex-wrap: wrap;
                    margin-top: 15px;
                }
                
                .stat-number {
                    font-size: 2rem;
                    font-weight: bold;
                    color: #083a0b;
                }
                
                .footer {
                    background: #010301;
                    color: white;
                    text-align: center;
                    padding: 20px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="card">
                    <div class="header">
                        <h1>API de Peliculas</h1>
                        <p>Tu catalogo de peliculas favoritas</p>
                    </div>
                    
                    <div class="content">
                        <div class="routes">
                            <div class="route-card">
                                <h3>API REST</h3>
                                <p>Obtén todas las peliculas en formato JSON</p>
                                <a href="/peliculas" class="route-link">Ver JSON</a>
                            </div>
                            
                            <div class="route-card">
                                <h3>Vista Tabla</h3>
                                <p>Visualiza las peliculas en una tabla bonita</p>
                                <a href="/ver-tabla" class="route-link">Ver Tabla</a>
                            </div>
                        </div>
                        
                        <div class="info-box">
                            <h3>Informacion de la Base de Datos</h3>
                            <div class="info-stats">
                                <div class="stat">
                                    <div class="stat-number" id="totalPeliculas">--</div>
                                    <div class="stat-label">Total Peliculas</div>
                                </div>
                                <div class="stat">
                                    <div class="stat-number">PostgreSQL</div>
                                    <div class="stat-label">Base de Datos</div>
                                </div>
                                <div class="stat">
                                    <div class="stat-number">Sequelize</div>
                                    <div class="stat-label">ORM</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="footer">
                        <p>Desarrollado con Express.js, Sequelize y PostgreSQL | JWT Authentication</p>
                    </div>
                </div>
            </div>
            
            <script>
                fetch('/peliculas')
                    .then(response => response.json())
                    .then(data => {
                        document.getElementById('totalPeliculas').textContent = data.cantidad;
                    });
            </script>
        </body>
        </html>
    `);
});

// ============================================
// MIDDLEWARE PARA MANEJAR ERRORES
// ============================================
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        exito: false,
        mensaje: 'Algo salio mal en el server, que rollo con eso? la neta me saca mashin de onda',
        error: err.message
    });
});

// ============================================
// INICIAR EL SERVIDOR
// ============================================
async function iniciarServidor() {
    await iniciarBaseDeDatos();
    
    app.listen(PORT, () => {
        console.log('Servidor corriendo bien mashin en http://localhost:' + PORT);
        console.log('API JSON: http://localhost:' + PORT + '/peliculas');
        console.log('API por ID: http://localhost:' + PORT + '/peliculas/:id');
        console.log('Ver tabla: http://localhost:' + PORT + '/ver-tabla');
        console.log('');
        console.log('Metodos disponibles:');
        console.log('  GET    /peliculas        - Obtener todas la pelis');
        console.log('  GET    /peliculas/:id    - Obtener una peli por ID (NUEVO)');
        console.log('  POST   /peliculas        - Agregar una nueva, maifrend (requiere token)');
        console.log('  PUT    /peliculas/:id    - Actualizar una (requiere token)');
        console.log('  DELETE /peliculas/:id    - Eliminar una que esté gacha (requiere token)');
        console.log('');
        console.log('Para obtener un token: POST /login con username=admin, password=1234');
    });
}

iniciarServidor();