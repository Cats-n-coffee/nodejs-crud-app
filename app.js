const http = require('http');
//const routes = require('./routes/appRoutes');
const { connectToDb } = require('./db/dbConnection');
const appRoutes = require('./routes/newRoutes');

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || '127.0.0.1';

// Connects to db
connectToDb();

// Creates a server
const server = http.createServer((req, res) => {   
    //routes(req, res);
    appRoutes(req, res);
})

server.listen(PORT, HOST);