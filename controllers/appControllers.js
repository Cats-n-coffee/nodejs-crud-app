const { client } = require('../db/dbConnection');

//console.log(dbCollection())
async function insertUser() {
    const newUser = await client
    .db(process.env.MONGPDB_DB)
    .collection('users')
    .insertOne({user : "me"})
    .catch(err => {console.log('insertUser err', err)});
    console.log('user inserted')
}

module.exports = { insertUser };