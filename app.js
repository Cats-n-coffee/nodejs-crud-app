const http = require('http');
const routes = require('./routes/appRoutes');
const { connectToDb } = require('./db/dbConnection');

const server = http.createServer((req, res) => {
    const reqUrl = new URL(req.url, 'http://localhost');

    //console.log('req path',reqUrl.pathname)
    connectToDb();
    routes(req, res);
    
    res.writeHead(200, { "Content-Type": "text/plain" })
    //res.write('home')
    //res.end()
})

server.listen(4000, '127.0.0.1');