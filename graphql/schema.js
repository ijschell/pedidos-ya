const { buildSchema } = require('graphql');

const schema = buildSchema(`

    type Query{
        app_authorization(clientId : String!, clientSecret : String!) : Token
        authentication_user(userName : String!, password : String!) : Token
        get_user_info : UserInfo
        search_restaurants(lat : String!, lng : String!, country : Int!, max : Int, offset: Int, sort : String, count : Int, fields : String) : Restaurants
    },

    type Token{
        message : String
        code : String
        access_token : String
    },

    type UserInfo{
        error : Boolean
        message : String
        id : Int
        lastName : String
        name : String
        country : Country
    },

    type Country{
        id : Int
    }

    type Restaurants{
        error : Boolean
        message : String
        restaurants : [Restaurant]
    }

    type Restaurant{
        id : Int
        name : String
        categories : [Category]
        rating : String
        logo : String
        deliveryTimeMaxMinutes : String
        link : String
    }

    type Category{
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

`);

module.exports = {
    schema
}