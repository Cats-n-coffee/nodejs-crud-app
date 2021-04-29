const ObjectId = require('mongodb').ObjectID;
const dbOperations = require('../db/dbOperations');
const password = require('../helpers/passwordEncrypt');

const responseHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
}

function optionsController(res) {
    res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
        "Access-Control-Max-Age": 600
    });
    res.end();
    return;
}

function errorRoute(res) {
    res.writeHead(404, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    })
    res.end(JSON.stringify({ error: 404, message: 'URL does not exist' }))
}

function postSignup(req, res, serverRes) {
   
    console.log('POST /cat was reached')

    req.on('end', async () => {
        let jsonObj = JSON.parse(serverRes);
        console.log('response is', jsonObj)
        const hashedPassword = await password.hash(jsonObj.password);
        
        await dbOperations.insertUser({ username: jsonObj.username, email: jsonObj.email, password: hashedPassword})
        .then(data => {
            res.writeHead(201, responseHeaders)
            res.end(JSON.stringify(data))
        })
        .catch(err => {
            console.log('signup promise err', err);
            res.writeHead(500, responseHeaders)
            res.end(JSON.stringify({ error: 500, message: 'Cannot signup user operation' }))
        })            
    })
    
}

function postLogin(req, res, serverRes) {
    req.on('end', () => {
        let jsonObj = JSON.parse(serverRes);
        console.log(jsonObj)

        dbOperations.findUser({ name: jsonObj.name, password: jsonObj.password })
        .then(data => {
            console.log('/login', data)
            res.writeHead(200, responseHeaders)
            res.end(JSON.stringify(data))
        })
        .catch(err => {
            console.log('login promise err', err);
            res.writeHead(500, responseHeaders)
            res.end(JSON.stringify({ error: 500, message: 'Cannot login user operation' }))
        })
    })
}

function putUpdate(req, res, serverRes) {
    req.on('end', () => {
        let jsonObj = JSON.parse(serverRes);
    
        dbOperations.updateUser({ name: jsonObj.name }, { message: jsonObj.message })
        .then(data => {
            console.log('put /update',data.modifiedCount)
            res.writeHead(200, responseHeaders)
            res.end(JSON.stringify(data))
        })
        .catch(err => {
            console.log('cannot update entry', err)
            res.writeHead(500, responseHeaders)
            res.end(JSON.stringify({ error: 500, message: 'Cannot update operation' }))
        })
    })
}

function deleteDelete(req, res, serverRes) {
    req.on('end', () => {
        let jsonObj = JSON.parse(serverRes);
        const formattedId = new ObjectId(jsonObj.id);
    
        dbOperations.deleteUser({ _id: formattedId})
        .then(data => {
            if (data === undefined) {
                throw new Error('Cannot delete user')
            }
            res.writeHead(200, responseHeaders)
            res.end(JSON.stringify(data))
        })
        .catch(err => {
            console.log('delete promise err', err)
            res.writeHead(500, responseHeaders)
            res.end(JSON.stringify({ error: 500, message: err.message || 'Cannot delete from db' }))
        })
    })
}

module.exports = { optionsController, errorRoute, postSignup, postLogin, putUpdate, deleteDelete };