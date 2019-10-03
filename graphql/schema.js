const { buildSchema } = require('graphql');

const schema = buildSchema(`

    type Query{
        app_authorization(clientId : String!, clientSecret : String!) : Token
        authentication_user(userName : String!, password : String!) : Token
    },

    type Token{
        message : String
        code : String
        access_token : String
    }

`);

module.exports = {
    schema
}