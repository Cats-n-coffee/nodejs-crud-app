const { MongoClient } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function connectToDb() {
    try {
        await client.connect();
        // const db = client.db(process.env.MONGODB_DB)
        // const users = db.collection('users')
        console.log('connected')
    }
    catch (err) {
        console.log('db error', err);
    }
}

module.exports = { connectToDb, client };