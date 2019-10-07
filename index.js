const express = require('express');
const app = express();
const cors = require('cors');
const {hub, requiredIsEmpty} = require('./urls');

// activo cors para habilitar el paso de cualquier dominio
app.use(cors());

// declaro carpeta pública
app.use(express.static('public'));

//parseo los parámetros enviádos por post
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// creo middelware que se encargará de controlar los tokens
app.use('/api/*', (req, res, next) => {

    console.log(`New request: ${req.baseUrl}`);
    
    // checkeo qué urls no necesitan comprobar el token
    switch (req.baseUrl) {
        case '/api/app_authorization':
            next();
        break;
        case '/api/tiempox':
            next();
        break;
        case '/api/get_info_admin':
            next();
        break;
    
        default:
            if(req.headers.authorization){
                next();
            }else{
                res.status(400).json(requiredIsEmpty('Falta token!'));
            }
        break;
    }
})

// paso todas las peticiones por el hub de urls
hub(app);

app.listen(4000, () => {
    console.log('The app run in http://localhost:4000');    
})