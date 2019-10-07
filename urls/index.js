const { CREDENTIALS_GET_TOKEN } = require('../config');
const path = require('path');
const moment = require('moment');
const { 
    saveData, 
    selectData, 
    resturnTiempoX,
    updateTiempoX,
    saveUsers,
    selectUsers,
    saveHistory,
    selectHistory
} = require('../cache/cache');
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

        // Por razones de seguridad el usuario y la contraseña para authenticar el app no son enviádos desde el front
        const args = {
            clientId: CREDENTIALS_GET_TOKEN.clientId,
            clientSecret: CREDENTIALS_GET_TOKEN.clientSecret
        }
        
        // Funcion que checkea los parámetros y en caso de que estén OK envía petición al Api
        sendToApi(res, args, ['clientId', 'clientSecret'], appAuthorization(args));

    });

    // User Authentication
    app.post('/api/authentication_user', (req, res) => {
        
        const args = {
            userName: req.body.userName,
            password: req.body.password
        }

        const token = req.headers.authorization;

        // Funcion que checkea los parámetros y en caso de que estén OK envía petición al Api
        sendToApi(res, args, ['userName', 'password'], authenticationUser(args, token));

    });  
    
    // Get User Info
    app.get('/api/get_user_info', (req, res) => {
        
        const token = req.headers.authorization;

        // Funcion que checkea los parámetros y en caso de que estén OK envía petición al Api
        sendToApi(res, {}, [], getUserInfo(token), 'get_user_info');

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
            fields : req.query.fields,
            user : req.query.user
        }

        // reviso si ya tengo un registro para el mismo point
        selectData({
            country : parseInt(args.country),
            point : args.point
        }).then(data => {

            const token = req.headers.authorization;

            // si tengo resultados los envío
            if(data){

                // busco el tiempo configurado en la base de datos
                checkCacheTime(data.timestamp).then(time => {

                    // siempre y cuando esté dentro del rango de caché
                    if(time){
    
                        console.log('send cache response');
                        res.status(200).json(data.response);
        
                    }else{
        
                        console.log('send from api response');
                        searchRestaurantsAndSaveInDB(res, args, token);
            
                    }
    
                })

            }else{

                console.log('send from api response');
                searchRestaurantsAndSaveInDB(res, args, token);

            }

            // guardo la búsqueda en el historial
            saveHistory({
                user: JSON.parse(args.user),
                country : args.country,
                point : args.point,
                timestamp : moment().format("DD-MM-YYYY HH:mm:ss")
            })

        })

    });  

    // Modifico Tiempo X
    app.post('/api/tiempox', (req, res) => {

        if(req.body.tiempox){

            // nuevo tiempo en minutos
            const newTime = req.body.tiempox;
                    
            updateTiempoX(parseInt(newTime)).then(resolve => {

                res.status(200).json({
                    error : false,
                    message : "Tiempo actualizado!"
                });

            }).catch(err => {

                res.status(400).json({
                    error : true,
                    message : err.message
                });

            })

        }else{

            res.status(400).json({
                error : true,
                message : "Faltan parámetros obligatorios."
            });

        }

    })

    // Obtengo todos los datos para el panel de administración
    app.get('/api/get_info_admin', (req, res) => {

        // Lo ideal sería comprobar un token para el panel de administración
        Promise.all([
            selectHistory({}).then(history => {
                // console.log(history);
                return history;
            }),
            selectUsers(null).then(users => {
                // console.log(users);
                return users;
            }),
            resturnTiempoX().then(res => {
                return res
            })
        ]).then(values => {

            // convierto fechas
            const usuarios = values[1].map(i => {
                return {
                    ...i,
                    timestamp : moment(i.timestamp).format("DD-MM-YYYY HH:mm:hh")
                }
            })
            
            const result = {
                error : false,
                message : {
                    history : values[0],
                    users : usuarios,
                    tiempox : values[2]
                }
            }

            res.status(200).json(result);

        }).catch(err => {

            res.status(400).json({
                error : true,
                message : err.message
            })

        })

    })
    
}

const searchRestaurantsAndSaveInDB = (res, args, token) => {

    // checkeo datos necesarios
    if(args.point && args.country){
        searchRestaurants(args, token).then(response =>{

            // guardo en base de datos antes de devolver al front
            saveData({
                country : parseInt(args.country),
                point : args.point,
                response,
                timestamp : moment().format()
            })

            res.status(200).json(response);

        })
    }

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

const sendToApi = (res, args, requires, callback, model) => {

    // checkeo que los parámetros obligatorios están siendo enviádos
    if(checkRequiredParams(args, requires)){

        // Envío datos al api
        callback.then(data => {
            
            // si fue authenticado el usuario, debo guardarlo en el registro
            if(model === 'get_user_info'){
                if(data.id !== 0){

                    // compruebo si este registro ya existe
                    selectUsers({
                        id : data.id,
                        name : data.name,
                        timestamp : moment().format()
                    }).then(user => {
                        
                        if(!user){
                            // De no existir, guardo el registro
                            saveUsers({
                                id : data.id,
                                name : data.name,
                                timestamp : moment().format()
                            })
                        }

                    })

                }
            }

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

const checkCacheTime = (timestamp) => {
    
    return resturnTiempoX().then(res => {

        if(moment(timestamp).add(res.tiempox,'m').toDate() > new Date()){
            return true;
        }
        return false;

    })

}

module.exports = {
    hub,
    requiredIsEmpty
}