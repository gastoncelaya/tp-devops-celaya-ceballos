require('newrelic');
const app = require('./app'); // se trae al objeto app desde el archivo app
const PORT = process.env.PORT || 3000; // se define el puerto donde el servidor va a escuchar las peticiones. process.env.port verifica que si hay un puerto definido en las variables de entorno

app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));