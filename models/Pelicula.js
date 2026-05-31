// Importar los tipos de datos de Sequelize
const { DataTypes } = require('sequelize');

// Importar la conexión a la base de datos
const sequelize = require('../database');

// Definir el modelo de Pelicula (esto representa la tabla "peliculas")
const Pelicula = sequelize.define('Pelicula', {
    // Cada propiedad es una columna de la tabla
    titulo: {
        type: DataTypes.STRING, // Texto
        allowNull: false        // No puede estar vacío
    },
    director: {
        type: DataTypes.STRING,
        allowNull: false
    },
    anio: {
        type: DataTypes.INTEGER, // Número entero
        allowNull: false
    },
    genero: {
        type: DataTypes.STRING,
        allowNull: false
    },
    puntuacion: {
        type: DataTypes.INTEGER,
        defaultValue: 0           // Si no se especifica, vale 0
    }
}, {
    tableName: 'peliculas'        // Nombre exacto de la tabla en la BD
});

// Exportar el modelo para usarlo en otros archivos
module.exports = Pelicula;