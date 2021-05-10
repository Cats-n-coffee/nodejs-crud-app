const authControllers = require('../controllers/authControllers');
const invoiceControllers = require('../controllers/invoiceControllers');

async function appRoutes(req, res) {
    const reqUrl = new URL(req.url, 'http://localhost');

    // reads the request stream and creates a string with the buffer
    let reqString = '';

    await req.on('data', chunk => {
        reqString += chunk;
    });

    if (req.method === 'OPTIONS') { // ------------------- OPTIONS requests
        authControllers.optionsController(res);
    }
    else if (req.method === 'GET') {
        if (reqUrl.pathname === '/api/selectinvoice') {
            invoiceControllers.getSelectInvoice(req, res, reqUrl)
        }
        else {
            authControllers.errorRoute(res);
        }
    }
    else if (req.method === 'POST') { // ----------------- POST requests  
        if (reqUrl.pathname === '/api/signup') {  
            authControllers.postSignup(req, res, reqString);
        }
        else if (reqUrl.pathname === '/api/login') {
            authControllers.postLogin(req, res, reqString);
        }
        else if (reqUrl.pathname === '/api/newinvoice') {
            invoiceControllers.postNewInvoice(req, res, reqString);
        }
        else { // fires when method is correct but pathname is not
            authControllers.errorRoute(res);
        }
    }
    else if (req.method === 'PUT') { // ------------------ PUT requests 
        if (reqUrl.pathname === '/api/update') {
            authControllers.putUpdate(req, res, reqString);
        }
        else {
            authControllers.errorRoute(res);
        }
    }
    else if (req.method === 'DELETE') { // --------------- DELETE requests
        if (reqUrl.pathname === '/api/delete') {
            authControllers.deleteDelete(req, res, reqString);
        }
        else if (reqUrl.pathname === '/api/deleteinvoice') {
            invoiceControllers.deleteInvoice(req, res, reqString);
        }
        else {
            authControllers.errorRoute(res);
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