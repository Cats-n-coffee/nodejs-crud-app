const ObjectId = require('mongodb').ObjectID;
const dbInvoiceOps = require('../db/dbInvoiceOps');
const { convertParams } = require('../helpers/paramsConverter');

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
    const params = reqUrl.searchParams;
    const paramsObj = convertParams(params)
    console.log('parmsObj', paramsObj)

    dbInvoiceOps.findInvoices(paramsObj)
    .then(data => {
        res.writeHead(200, responseHeaders)
        res.end(JSON.stringify(data))
    })
    .catch(err => {
        console.log('find invoice controller err', err)
        res.writeHead(500, responseHeaders)
        res.end(JSON.stringify({ ok: false, errMsg: err }))
    }) 
}

function deleteInvoice(req, res, reqString) {
    console.log('delete req str', JSON.parse(reqString))
    const invoice = JSON.parse(reqString);
    
    dbInvoiceOps.deleteOneInvoice(invoice)
    .then(data => {
        res.writeHead(200, responseHeaders)
        res.end(JSON.stringify({ data: data, msg: 'delete route hit' }))
    })
    .catch(err => {
        console.log('delete controller err', err)
        res.writeHead(500, responseHeaders)
        res.end(JSON.stringify({ ok: false, errMsg: err }))
    })
}

module.exports = { postNewInvoice, getSelectInvoice, deleteInvoice }