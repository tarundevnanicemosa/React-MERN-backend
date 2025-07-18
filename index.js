const path = require('path');
const express = require('express');
const { dbConnection } = require('./database/config');
require('dotenv').config();
const cors = require('cors');

//crear el servidor de express
const app = express();

//BBDD
dbConnection();

//CORS
app.use(cors());

//directorio publico
app.use( express.static('public') );

//Lectura y parseo del body
app.use ( express.json() );

//rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
//todo lo que exporte el require, se va a habilitar en /api/auth
// app.get('/', (req, res) => {

//     res.json({
//         ok:true
//     })
// })
app.use('*', (req, res) => {
    res.sendFile( path.json(__dirname, 'public/index.html'));
})

//escuchar peticiones
app.listen( process.env.PORT, () => {
    console.log(`servidor corriendo en puerto ${4000}`);    
})