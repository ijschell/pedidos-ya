const express = require('express');
const app = express();
const express_graphql = require('express-graphql');

// Esquemas
const { schema } = require('./graphql/schema');

// Funciones que procesan solicitud
const { 
    appAuthorization,
    authenticationUser 
} = require('./graphql/process');

// Establezco todos los endpoints visibles
const root = {
    app_authorization : appAuthorization,
    authentication_user : authenticationUser
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