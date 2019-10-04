const path = require('path');
const {
    appAuthorization, 
    authenticationUser, 
    getUserInfo, 
    searchRestaurants 
} = require('../api/endpoints');

const hub = (app) => {
    
    // Home, simplemente enlaces
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.html'))
    });

    // rest help, una guía para el uso del api rest
    app.get('/rest_help', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/rest_help.html'))
    });

    // App Authorization
    app.get('/api/app_authorization', (req, res) => {

        const args = {
            clientId: req.query.clientId,
            clientSecret: req.query.clientSecret
        }
        
        // Funcion que checkea los parámetros y en caso de que estén OK envía petición al Api
        sendToApi(res, args, ['clientId', 'clientSecret'], appAuthorization(args));

    });

    // User Authentication
    app.get('/api/authentication_user', (req, res) => {
        
        const args = {
            userName: req.query.userName,
            password: req.query.password
        }

        const token = req.headers.authorization;

        // Funcion que checkea los parámetros y en caso de que estén OK envía petición al Api
        sendToApi(res, args, ['userName', 'password'], authenticationUser(args, token));

    });  
    
    // Get User Info
    app.get('/api/get_user_info', (req, res) => {
        
        const token = req.headers.authorization;

        // Funcion que checkea los parámetros y en caso de que estén OK envía petición al Api
        sendToApi(res, {}, [], getUserInfo(token));

    });

    // Búsqueda de restaurantes según cords
    app.get('/api/search_restaurants', (req, res) => {
        
        const args = {
            point : req.query.point,
            country : req.query.country, 
            max : req.query.max, 
            offset: req.query.offset, 
            sort : req.query.sort, 
            count : req.query.count, 
            fields : req.query.fields
        }

        const token = req.headers.authorization;

        // Funcion que checkea los parámetros y en caso de que estén OK envía petición al Api
        sendToApi(res, args, ['point', 'country'], searchRestaurants(args, token));

    });  
    
}

const checkRequiredParams = (args, requires) => {

    for(const i in args){
        if(requires.includes(i) && i != undefined){
            if(!args[i]){
                return false;
            }
        }
    }

    return true;

}

const requiredIsEmpty = (message) => {
    return {
        error : true,
        message : message
    }
}

const sendToApi = (res, args, requires, callback) => {

    // checkeo que los parámetros obligatorios están siendo enviádos
    if(checkRequiredParams(args, requires)){

        // Envío datos al api
        callback.then(data => {
            
            // ok, 200
            res.status(200).json(data);

        }).catch(err => {

            // error, 400
            res.status(400).json(err);

        })

    }else{
        
        // error, 400
        res.status(400).json(requiredIsEmpty('Faltan parámetros requeridos.'));

    }

}

module.exports = {
    hub,
    requiredIsEmpty
}