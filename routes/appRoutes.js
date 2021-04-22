//const http = require('http');
const controllers = require('../controllers/appControllers');

function routes(req, res) {
    const reqUrl = new URL(req.url, 'http://localhost');
    console.log(reqUrl)

    if (req.method === 'GET') {
        console.log('get request')
        if (reqUrl.pathname === '/') {
            try {
                console.log('home route')
                //res.statusCode = 200;
                //res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ route: 'home' }))
            }
            catch (err) {
                console.log('catch /home err')
            }
        }
        else if (reqUrl.pathname === '/cat') {
            try {
                res.statusCode = 200;
                console.log('cats was reached')
                controllers.findUser();
                res.write('cats')
            }
            catch (err) {
                console.log('catch /cat err', err)
            }
        }
        else {
            console.log('not found route')
            res.statusCode = 404;
            res.write(JSON.stringify({ status: 400, message: "not found" }))
        }

        res.end();
    }
    else if (req.method === 'POST') {
        console.log('post request')
        if (reqUrl.pathname === '/cat') {
            try {
                console.log('POST /cat was reached')
                // const reqBody = req.body;
                // console.log('reqBody',req)
                //res.statusCode = 200;

                let serverRes = '';

                req.on('data', chunk => {
                    console.log('req on chunk', chunk);
                    serverRes += chunk;
                })

                req.on('end', () => {
                    let jsonObj = JSON.parse(serverRes);
                    console.log(jsonObj);
                    controllers.insertUser(jsonObj)
                    res.writeHead(200, { "Content-type": "application/json" })
                    res.end(serverRes)
                })
            }
            catch (err) {
                console.log('catch /cat POST err', err)
            }
        }
    }
    else if (req.method === 'DELETE') {
        if (reqUrl.pathname === '/cat') {
            console.log('delete /cat')
            controllers.deleteUser();
            res.statusCode = 200;
            res.write('deleted')
        }
        res.end()
    }
    else if (req.method === 'PUT') {
        if (reqUrl.pathname === '/cat') {
            console.log('update /cat')
            controllers.updateUser();
            res.statusCode = 200;
            res.write('update')
        }
        res.end()
    }

}

module.exports = routes;