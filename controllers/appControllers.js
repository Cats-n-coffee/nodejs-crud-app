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

function postSignup(req, res, serverRes) {
    try {
        console.log('POST /cat was reached')

        req.on('end', async () => {
            let jsonObj = JSON.parse(serverRes);
            console.log('response is', jsonObj)
            let hashedPassword = await password.hash(jsonObj.password);
            
            await dbOperations.insertUser({ name: jsonObj.name, password: hashedPassword, age: jsonObj.age })
            .then(data => {
                res.writeHead(200, responseHeaders)
                res.end(JSON.stringify(data))
            })
            .catch(err => {
                console.log('signup promise err', err);
                res.writeHead(500, responseHeaders)
                res.end(JSON.stringify({ error: err.name, message: 'Cannot perform db operation' }))
            })            
        })
    }
    catch (err) {
        console.log('catch /signup POST err', err)
        res.end(JSON.stringify({ error: 'controller error', message: 'Cannot sign up user' }))
    }
}

function postLogin(req, res, serverRes) {
    
    try {
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
                console.log('POST login err', err);
                res.writeHead(500, responseHeaders)
                res.end(JSON.stringify({ error: err.name, message: 'Cannot perform db operation' }))
            })
        })
        
    }
    catch (err) {
        console.log('catch /login POST err', err);
        res.end(JSON.stringify({ error: 'controller error', message: 'Cannot login user' }))
    }
}

function putUpdate(req, res, serverRes) {
    try {
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
                res.end(JSON.stringify({ error: err.name, message: 'Cannot perform db operation' }))
            })
        })
    }
    catch (err) {
        console.log('catch /update PUT err', err);
        res.end(JSON.stringify({ error: 'controller error', message: 'Cannot update entry' }))
    }
}

function deleteDelete(req, res, serverRes) {
    try {
        req.on('end', () => {
            let jsonObj = JSON.parse(serverRes);
            let formattedId = new ObjectId(jsonObj.id);

            dbOperations.deleteUser({ _id: formattedId});
            res.writeHead(200, responseHeaders)
            res.end(JSON.stringify({ delete: jsonObj.id}))
        })
    }
    catch (err) {
        console.log('catch /delete DELETE err', err);
        res.end(JSON.stringify({ error: 'controller error', message: 'Cannot delete user' }))
    }
}

module.exports = { optionsController, postSignup, postLogin, putUpdate, deleteDelete };