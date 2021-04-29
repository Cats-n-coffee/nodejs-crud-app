const http = require('http');
const { connectToDb } = require('./db/dbConnection');
const appRoutes = require('./routes/newRoutes');

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || '127.0.0.1';

// Connects to db
connectToDb();

// Creates a server
const server = http.createServer((req, res) => { 
    req.on('error', (err) => {
        console.log('error at app.js', err);
        res.end(JSON.stringify({ error: 'Something went wrong' }))
    })  
    appRoutes(req, res);
})

server.listen(PORT, HOST);