const express = require('express');
const app = express();
const cors = require('cors');
const {hub} = require('./urls');

// activo cors para habilitar el paso de cualquier dominio
app.use(cors());


app.use(express.static('public'));

// creo middelware que se encargará de controlar los tokens
app.use('/', (req, res, next) => {
    next();
})

// paso todas las peticiones por el hub de urls
hub(app);

app.listen(4000, () => {
    console.log('The app run in http://localhost:4000');    
})