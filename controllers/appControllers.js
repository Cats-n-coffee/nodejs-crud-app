const { client } = require('../db/dbConnection');

async function insertUser(data) {
    const newUser = await client
    .db(process.env.MONGODB_DB)
    .collection('users')
    .insertOne({ name: data.name, age: data.age })
    .catch(err => console.log('insertUser err', err));
    console.log('user inserted')
}

async function findUser(data) {
    const findOneUser = await client
    .db(process.env.MONGODB_DB)
    .collection('users')
    .findOne({ name: "bro" })
    .catch(err => console.log('findOne err', err))
    console.log('user found', findOneUser)
}

async function deleteUser(data) {
    const deleteOneUser = await client
    .db(process.env.MONGODB_DB)
    .collection('users')
    .deleteOne({ name: "bro" })
    .catch(err => console.log('deleteUser err', err))
    console.log('deleted one user')
}

async function updateUser(data, addon) {
    const updatingWith = {
        $set: {
            color: "brown tabby orange belly"
        }
    }

    const updateOneUser = await client
    .db(process.env.MONGODB_DB)
    .collection('users')
    .updateOne({ name: "chichi" }, updatingWith)
    .catch(err => console.log('deleteUser err', err))
    console.log('updated one user')
}

module.exports = { insertUser, findUser, deleteUser, updateUser };