const {ApolloServer} = require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');
const dbConnection = require('./config/db');
const jwt = require('jsonwebtoken');

require('dotenv').config({path: '.env'});

dbConnection();


const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => {
        //console.log(req.headers['authorization']);
        const token = req.headers['authorization'] || '';
        if(token){
            try {
                const usuario = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_KEY);
                //console.log(usuario);
                return {
                    usuario
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
});

server.listen({port: process.env.PORT || 4000}).then(({url}) => {
    console.log(`Servidor listo en la URL ${url}`);
})