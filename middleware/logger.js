// Middleware que registra todas las peticiones en la consola
const logger = (req, res, next) => {
    // Obtener la fecha y hora actual
    const fecha = new Date().toLocaleString();
    // Mostrar en consola: [fecha] MÉTODO - URL
    console.log(`[${fecha}] ${req.method} - ${req.url}`);
    // Continuar con la siguiente función (la ruta que corresponda)
    next();
};

module.exports = logger;