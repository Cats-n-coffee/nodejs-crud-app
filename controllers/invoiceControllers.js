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

function updateInvoice(res, reqString) {
    const parsedObj = JSON.parse(reqString);
    const newObj = {
        $set: {
            item: parsedObj.item, 
            price: parsedObj.price, 
            invoice_date: parsedObj.invoice_date 
        }   
    }

    dbInvoiceOps.updateOneInvoice({ invoice_id: parsedObj.invoice_id }, newObj)
    .then(data => { 
        res.writeHead(200, responseHeaders)
        res.end(JSON.stringify({ data: data }))
    })
    .catch(err => {
        console.log('err at update invoice controller', err)
        res.writeHead(500, responseHeaders)
        res.end(JSON.stringify({ ok: false, errMsg: err }))
    })
}

module.exports = { postNewInvoice, getSelectInvoice, deleteInvoice, updateInvoice }