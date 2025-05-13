const server = require('./src/app.js');
const { conn } = require('./src/db.js');

// Usa el puerto asignado por Render o un puerto por defecto
const PORT = process.env.PORT || 3004;

conn.sync({ force: false }).then(() => {
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});

//cambie