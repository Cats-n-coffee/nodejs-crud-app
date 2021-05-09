const ObjectId = require('mongodb').ObjectID;
const { client } = require('./dbConnection');

async function insertNewInvoice(data) {
    const insertOneInvoice = await client
    .db(process.env.MONGODB_DB)
    .collection('invoices')

    return insertOneInvoice.insertOne(data)
    .then(invoice => invoice.ops[0])
    .catch(err => {
        console.log('db operations new invoice err', err)
        return { error: "db error", message: err.message }
    })
}

async function findInvoices(data) {
    const findInvoiceInDb = await client
    .db(process.env.MONGODB_DB)
    .collection('invoices')

    return findInvoiceInDb.find(data)
    // .toArray((err, items) => {
    //     if (err) throw new Error('Could not find invoices')
    //     else {
    //         return items;
    //     }
    // })
    .toArray()
    .then(data => data)
    .catch(err => console.log('found err', err))
}

module.exports = { insertNewInvoice, findInvoices }