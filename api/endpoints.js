// GET
// get_user_info : UserInfo
// app_authorization(clientId : String!, clientSecret : String!) : Token
// authentication_user(userName : String!, password : String!) : Token
// search_restaurants(point : String!, country : Int!, max : Int, offset: Int, sort : String, count : Int, fields : String) : Restaurants

// RETURNS
// type Token{
//     message : String
//     code : String
//     access_token : String
// },

// type UserInfo{
//     error : Boolean
//     message : String
//     id : Int
//     lastName : String
//     name : String
//     country : Country
// },

// type Country{
//     id : Int
// }

// type Restaurants{
//     error : Boolean
//     message : String
//     restaurants : [Restaurant]
// }

const config = require('../config');
const fetch = require('node-fetch');

const appAuthorization = (args) => {
    

    /*
        Endpoint para validar el uso de la app.
        args: {
            clientId: String,
            clientSecret: String
        }
        return: access_token
        error: access_token = null
    */

    const clientId = args.clientId;
    const clientSecret = args.clientSecret;

    const toSend = `?clientId=${clientId}&clientSecret=${clientSecret}`;

    return new Promise((resolve, rejected) => {
        fetch(config.URL_BASE + config.URL_GET_TOKEN + toSend).then(data => {
            return data.json()
        }).then(data => {
            
            if(data.access_token){
                resolve( {
                    error : false,
                    message : 'Success',
                    code : 'VALID',
                    access_token : data.access_token
                })
            }else{
                rejected({
                    error : true,
                    message : data.messages[0],
                    code : data.code,
                    access_token : ''
                })
            }
    
        }).catch(err => {
            rejected({
                error : true,
                message : err.message,
                code : 'Error in fetch',
                access_token : ''
            })
        })
    })

}

const authenticationUser = (args, token) => {

    /*
        Este endpoint sirve para validar las credenciales del usuario registrado.
        args: {
            userName: String,
            password: String,
            header : {
                Authorization : Bearer <token>
            }
        }
        return: access_token
        error: access_token = null
    */

   const userName = args.userName;
   const password = args.password;

   const toSend = `?userName=${userName}&password=${password}`;

   if(!token){
        return {
            error : true,
            message : 'The token is invalid!',
            code : 'INVALID_TOKEN',
            access_token : ''
        }
   }else{

        return fetch(config.URL_BASE + config.URL_GET_TOKEN + toSend, {
            headers : {
                'Authorization' : token
            }
        }).then(data => {
            return data.json();
        }).then(data => {
            
            if(data.access_token){
                return {
                    error : false,
                    message : 'Success',
                    code : 'VALID',
                    access_token : data.access_token
                }
            }else{
                return {
                    error : true,
                    message : data.messages[0],
                    code : data.code,
                    access_token : ''
                }
            }
    
        }).catch(err => {
            return {
                error : true,
                message : err.message,
                code : 'Error in fetch',
                access_token : ''
            }
        })
   }

}

const getUserInfo = (token) => {

    /*
        Este endpoint se encarga de devolver la información de un usuario logueado.
        args: {
            header : {
                Authorization : Bearer <token_user>
            }
        }
        return: {
            id,
            lastName,
            name,
            country{
                id
            }
        }
        error: code = "INVALID_TOKEN"
    */

    if(!token){
        return {
            error : true,
            message : 'The token is invalid!',
            id : 0,
            lastName : '',
            name : '',
            country : {
                id : 0
            }
        }
    }else{

        return fetch(config.URL_BASE + config.URL_GET_USER_INFO, {
            headers : {
                'Authorization' : token
            }
        }).then(data => {
            return data.json();
        }).then(data => {

            if(data.code){
                return {
                    error : true,
                    message : data.code,
                    id : 0,
                    lastName : '',
                    name : '',
                    country : {
                        id : 0
                    }
                }
            }else{
                return {
                    ...data,
                    error : false,
                    message : '',
                }
            }

        }).catch(err => {
            return {
                message : err.message,
                code : 'Error in fetch',
                access_token : ''
            }
        })

    }

}

const searchRestaurants = (args, token) => {

    /*
        Utilizo este endpoint para obtener los restaurantes más cercanos en base a coordenadas de mapa.
        args: {
            point : String!, 
            country : Int!, 
            max : Int, 
            offset: Int, 
            sort : String, 
            count : Int, 
            fields : String
            header : {
                Authorization : Bearer <token_user>
            }
        }
        return: {
            error : Boolean
            message : String
            id : Int
            name : String
            categories : {
                id: Int,
                sortingIndex: Int,
                visible: Boolean,
                percentage: Int,
                name: String,
                manuallySorted: Boolean,
                state: Int,
                image: String,
                quantity: Int
            }
            rating : String
            logo : String
            deliveryTimeMaxMinutes : String
            link : String
        }
        error: code = "INVALID_TOKEN"
    */    

    const country = args.country;
    let max = '';
    if(args.max){
        max = args.max;
    }
    let offset = '';
    if(args.offset){
        offset = args.offset;
    }
    let sort = '';
    if(args.sort){
        sort = args.sort;
    }
    let count = '';
    if(args.count){
        count = args.count;
    }
    let fields = '';
    if(args.fields){
        fields = args.fields;
    }

    const point = args.point;

    const toSend = `?country=${country}&point=${point}&max=${max}&offset=${offset}&sort=${sort}&count=${count}&fields=${fields}`;

    if(!token){
        return {
            error : true,
            message : 'The token is invalid!',
            restaurants : [],
        }
    }else{
        return fetch(config.URL_BASE + config.URL_SEARCH_RESTAURANTS + toSend, {
            headers : {
                'Authorization' : token
            }
        }).then(data => {
            return data.json();
        }).then(data => {

            if(data.code){
                return {
                    error : true,
                    message : data.code,
                    restaurants : [],
                }
            }else{
                return {
                    error : false,
                    message : '',
                    restaurants : data['data']
                }
            }

        }).catch(err => {
            return {
                message : err.message,
                code : 'Error in fetch',
                access_token : ''
            }
        })
    }

}


module.exports = {
    appAuthorization,
    authenticationUser,
    getUserInfo,
    searchRestaurants,
}