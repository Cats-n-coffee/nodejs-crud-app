const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URL = process.env.MONGODB_URL;

const client = new MongoClient(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function connectToDb() {
    try {
        await client.connect();
        // const db = client.db(process.env.MONGODB_DB);
        // const users = db.collection('users');

        //const newUser = users.insertOne({ name: "bro" })
        console.log('connected')
        //return users;
    }
    catch (err) {
        console.log('db error', err);
    }
    // finally {
    //     await client.close();
    // }
}

module.exports = { connectToDb, client };