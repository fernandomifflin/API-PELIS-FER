// El codigo de la database se va implementar tanto el uso para render como para el local

const { Sequelize } = require('sequelize');

// Esta es la variable que va a tener la conexión
let sequelize;

// aqui revisa si estamos en el Render (si tiene DATABASE_URL) o en local
const databaseUrl = process.env.DATABASE_URL;

if (databaseUrl) {
    // Estamos en Render - usamos PostgreSQL
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
    // Estamos en local - usamos SQLite
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: './peliculas.sqlite',
        logging: false
    });
    console.log('Conectando a SQLite local');
}

module.exports = sequelize;