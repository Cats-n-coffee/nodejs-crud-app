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
    .toArray()
    .then(result => result)
    .catch(err => console.log('found err', err))
}

async function deleteOneInvoice(data) {
    const deleteWithId = await client
    .db(process.env.MONGODB_DB)
    .collection('invoices')

    return deleteWithId.deleteOne(data)
    .then(res => console.log({ deletedCount: res.deletedCount }))
    .catch(err => err)
}

async function updateOneInvoice(id, data) {
    const updateOneEntry = await client
    .db(process.env.MONGODB_DB)
    .collection('invoices')

    return updateOneEntry.updateOne(id, data)
    .then(res => res.modifiedCount)
    .catch(err => err)
}

module.exports = { insertNewInvoice, findInvoices, deleteOneInvoice, updateOneInvoice }