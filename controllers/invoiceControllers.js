const ObjectId = require('mongodb').ObjectID;
const dbInvoiceOps = require('../db/dbInvoiceOps');

const responseHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
}

function postNewInvoice(req, res, reqString) {
    req.on('end', () => {
        let jsonObj = JSON.parse(reqString);
        let timestamp = Date.now()
        jsonObj = {invoice_id: timestamp, ...jsonObj}
        console.log(jsonObj)

        dbInvoiceOps.insertNewInvoice(jsonObj)
        .then(data => {
            console.log('data in controller', data)
            res.writeHead(200, responseHeaders)
            res.end(JSON.stringify(data))
        })
        .catch(err => {
            console.log('invoice controller err', err)
            res.writeHead(500, responseHeaders)
            res.end(JSON.stringify({ ok: false, errMsg: err }))
        })
        
    })
}

function getSelectInvoice(req, res, reqUrl) {
    console.log(reqUrl.searchParams.toString().split('=')[1])
    const userId = reqUrl.searchParams.toString().split('=')[1];

    console.log(typeof userId)
    res.writeHead(200, responseHeaders)
    res.end(JSON.stringify({message: 'get invoice'}))
}

module.exports = { postNewInvoice, getSelectInvoice }