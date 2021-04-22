//const http = require('http');
const controllers = require('../controllers/appControllers');

function routes(req, res) {
    const reqUrl = new URL(req.url, 'http://localhost');
    console.log(reqUrl)

    if (req.method === 'GET') {
        console.log('get request')
        if (reqUrl.pathname === '/cat') {
            try {
                res.statusCode = 200;
                console.log('cats was reached')
                res.end('cats')
            }
            catch (err) {
                console.log('catch /cat err', err)
            }
        }
        else {
            console.log('not found route')
            res.statusCode = 404;
            res.end(JSON.stringify({ status: 400, message: "not found" }))
        }
    }
    if (req.method === 'POST') {
        console.log('post request')
        if (reqUrl.pathname === '/cat') {
            try {
                console.log('POST /cat was reached')
                // const reqBody = req.body;
                // console.log('reqBody',req)
                //res.statusCode = 200;

                controllers.insertUser()

                let serverRes = '';

                req.on('data', chunk => {
                    console.log('req on chunk', chunk);
                    serverRes += chunk;
                })

                req.on('end', () => {
                    let jsonObj = JSON.parse(serverRes);
                    console.log(jsonObj);
                    res.writeHead(200, { "Content-type": "application/json" })
                    res.end(serverRes)
                })
            }
            catch (err) {
                console.log('catch /cat POST err', err)
            }
        }
    }

}

module.exports = routes;