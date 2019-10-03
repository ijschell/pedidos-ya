const express = require('express');
const app = express();
const express_graphql = require('express-graphql');

// Esquemas
const { schema } = require('./graphql/schema');

// Funciones que procesan solicitud
const { 
    appAuthorization,
    authenticationUser,
    getUserInfo,
    searchRestaurants
} = require('./graphql/process');

// Establezco todos los endpoints visibles
const root = {
    app_authorization : appAuthorization,
    authentication_user : authenticationUser,
    get_user_info : getUserInfo,
    search_restaurants : searchRestaurants
}

app.use('/graphql', express_graphql((req) => ({
    schema: schema,
    context : req,
    rootValue: root,
    graphiql: true
})));

app.listen(3000, () => {
    console.log('The app run in http://localhost:3000');    
})