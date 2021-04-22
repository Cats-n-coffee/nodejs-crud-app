const http = require('http');
const routes = require('./routes/appRoutes');
const { connectToDb } = require('./db/dbConnection');


// Connects to db
connectToDb();

const server = http.createServer((req, res) => {
    //const reqUrl = new URL(req.url, 'http://localhost');
    
    routes(req, res);

})

server.listen(4000, '127.0.0.1');