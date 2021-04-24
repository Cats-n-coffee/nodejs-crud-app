//const http = require('http');
const dbOperations = require('../db/dbOperations');

function routes(req, res) {
    const reqUrl = new URL(req.url, 'http://localhost');
    console.log('in routes function', reqUrl)
    console.log('method', req.method)

    let serverRes = '';

    req.on('data', chunk => {
        console.log('req on chunk', chunk);
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
            console.log('not found route')
            res.statusCode = 404;
            res.write(JSON.stringify({ status: 400, message: "not found" }))
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
                    console.log(jsonObj);
                    dbOperations.insertUser(jsonObj)
                    //const rev = () => { return response.then(data => console.log('data',data)) }
                    res.writeHead(200, { 
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    })
                    //console.log(rev)
                    res.end(serverRes)
                    //res.end(response)
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
                    res.statusCode = 200;
                    dbOperations.findUser({ name: jsonObj.name });
                    res.writeHead(200, { "Content-type": "application/json" })
                    res.end(serverRes)
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
                    res.statusCode = 200;
                    console.log(jsonObj)
                    dbOperations.deleteUser({ name: jsonObj.name });
                    res.writeHead(200, { 
                        "Content-type": "application/json",
                        "Access-Control-Allow-Origin": "*" 
                    })
                    res.end(serverRes)
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