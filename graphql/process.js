const config = require('../config');
const fetch = require('node-fetch');

const appAuthorization = (args) => {

    /*
        Endpoint para validar el uso de la app.
        args: {
            clientID: String,
            clientSecret: String
        }
        return: access_token
        error: access_token = null
    */

    const clientId = args.clientId;
    const clientSecret = args.clientSecret;

    const toSend = `?clientId=${clientId}&clientSecret=${clientSecret}`;

    return fetch(config.URL_BASE + config.URL_GET_TOKEN + toSend).then(data => {
        return data.json()
    }).then(data => {

        if(data.access_token){
            return {
                message : 'Success',
                code : 'VALID',
                access_token : data.access_token
            }
        }else{
            return {
                message : data.messages[0],
                code : data.code,
                access_token : ''
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

const authenticationUser = (args, context) => {

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
   const token = context.headers.authorization;

   const toSend = `?userName=${userName}&password=${password}`;

   return fetch(config.URL_BASE + config.URL_GET_TOKEN + toSend, {
       headers : {
           'Authorization' : token
       }
   }).then(data => {
       return data.json();
   }).then(data => {
       
        if(data.access_token){
            return {
                message : 'Success',
                code : 'VALID',
                access_token : data.access_token
            }
        }else{
            return {
                message : data.messages[0],
                code : data.code,
                access_token : ''
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

module.exports = {
    appAuthorization,
    authenticationUser
}