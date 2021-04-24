//const http = require('http');
const ObjectId = require('mongodb').ObjectID;
const dbOperations = require('../db/dbOperations');

function routes(req, res) {
    const reqUrl = new URL(req.url, 'http://localhost');
    console.log('method', req.method)

    let serverRes = '';

    req.on('data', chunk => {
        serverRes += chunk;
    });

    //---------------------------------------- OPTIONS requests, handles preflights
    if (req.method === "OPTIONS") {
        res.writeHead(204, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
            "Access-Control-Max-Age": 600
        });
        res.end();
        return;
      }

    // --------------------------------------- GET requests
    else if (req.method === 'GET') {
        if (reqUrl.pathname === '/') {
            try {
                console.log('home route')
                res.writeHead(200, { 
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                });
                res.write(JSON.stringify({ route: 'home' }))
            }
            catch (err) {
                console.log('catch /home err')
            }
        }
        else {
            res.write(JSON.stringify({ status: 404, message: "not found" }))
        }

        res.end();
    }
    // --------------------------------------- POST requests
    else if (req.method === 'POST') {
        if (reqUrl.pathname === '/signup') {
            try {
                console.log('POST /cat was reached')

                req.on('end', () => {
                    let jsonObj = JSON.parse(serverRes);
             
                    dbOperations.insertUser(jsonObj)
                    .then(data => {
                        res.writeHead(200, { 
                            "Content-Type": "application/json",
                            "Access-Control-Allow-Origin": "*",
                        })
                        res.end(JSON.stringify(data))
                    })
                    .catch(err => console.log('signup promise err', err))            
                })
            }
            catch (err) {
                console.log('catch /signup POST err', err)
            }
        }
        else if (reqUrl.pathname === '/login') {
            try {
                req.on('end', () => {
                    let jsonObj = JSON.parse(serverRes);

                    dbOperations.findUser({ name: jsonObj.name })
                    .then(data => {
                        res.writeHead(200, { 
                            "Content-type": "application/json",
                            "Access-Control-Allow-Origin": "*", 
                        })
                        res.end(JSON.stringify(data))
                    })
                    .catch(err => console.log(err))
                })
                
            }
            catch (err) {
                console.log('catch /login POST err', err)
            }
        }
    }
    // --------------------------------------- DELETE requests
    else if (req.method === 'DELETE') {
        if (reqUrl.pathname === '/delete') {
            try {
                req.on('end', () => {
                    let jsonObj = JSON.parse(serverRes);
                    let formattedId = new ObjectId(jsonObj.id);
        
                    dbOperations.deleteUser({ _id: formattedId});
                    res.writeHead(200, { 
                        "Content-type": "application/json",
                        "Access-Control-Allow-Origin": "*" 
                    })
                    res.end(JSON.stringify({ delete: jsonObj.id}))
                })
            }
            catch (err) {
                console.log('catch /delete DELETE err', err)
            }
        }
    }
    // --------------------------------------- PUT requests
    else if (req.method === 'PUT') {
        if (reqUrl.pathname === '/update') {
            try {
                req.on('end', () => {
                    let jsonObj = JSON.parse(serverRes);
                    res.statusCode = 200;
                    console.log('put req',jsonObj)
                    dbOperations.updateUser({ name: jsonObj.name }, { message: jsonObj.message });
                    res.writeHead(200, { 
                        "Content-type": "application/json",
                        "Access-Control-Allow-Origin": "*" 
                    })
                    res.end(serverRes)
                })
            }
            catch (err) {
                console.log('catch /update PUT err', err)
            }
        }
    }

}

module.exports = routes;