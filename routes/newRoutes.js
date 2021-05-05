const controllers = require('../controllers/appControllers');

async function appRoutes(req, res) {
    const reqUrl = new URL(req.url, 'http://localhost');

    // reads the request stream and creates a string with the buffer
    let serverRes = '';

    await req.on('data', chunk => {
        serverRes += chunk;
    });

    if (req.method === 'OPTIONS') { // ------------------- OPTIONS requests
        controllers.optionsController(res);
    }
    else if (req.method === 'GET') {
        if (reqUrl.pathname === '/getting') {
            controllers.getting(res)
        }
        else {
            controllers.errorRoute(res);
        }
    }
    else if (req.method === 'POST') { // ----------------- POST requests  
        if (reqUrl.pathname === '/signup') {  
            controllers.postSignup(req, res, serverRes);
        }
        else if (reqUrl.pathname === '/login') {
            controllers.postLogin(req, res, serverRes);
        }
        else { // fires when method is correct but pathname is not
            controllers.errorRoute(res);
        }
    }
    else if (req.method === 'PUT') { // ------------------ PUT requests 
        if (reqUrl.pathname === '/update') {
            controllers.putUpdate(req, res, serverRes);
        }
        else {
            controllers.errorRoute(res);
        }
    }
    else if (req.method === 'DELETE') { // --------------- DELETE requests
        if (reqUrl.pathname === '/delete') {
            controllers.deleteDelete(req, res, serverRes);
        }
        else {
            controllers.errorRoute(res);
        }
    }
    else {
        console.log('method isn\'t handled');
        res.writeHead(405, {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        })
        res.end(JSON.stringify({ error: 405, message: 'Method not allowed' }))
    }
}

module.exports = appRoutes;