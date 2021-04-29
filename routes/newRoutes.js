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
    // else if (req.method === 'GET') {
        
    // }
    else if (req.method === 'POST') { // ----------------- POST requests  
        if (reqUrl.pathname === '/signup') {  
            controllers.postSignup(req, res, serverRes);
        }
        else if (reqUrl.pathname === '/login') {
            controllers.postLogin(req, res, serverRes);
        }
        else {
            console.log('POST else statment hit')
        }
    }
    else if (req.method === 'PUT') { // ------------------ PUT requests 
        if (reqUrl.pathname === '/update') {
            controllers.putUpdate(req, res, serverRes);
        }
        else {
            console.log('PUT else statment hit')
        }
    }
    else if (req.method === 'DELETE') { // --------------- DELETE requests
        if (reqUrl.pathname === '/delete') {
            controllers.deleteDelete(req, res, serverRes);
        }
        else {
            console.log('DELETE else statment hit')
        }
    }
    else {
        console.log('method isn\'t handled');
    }
}

module.exports = appRoutes;