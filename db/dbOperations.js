const ObjectId = require('mongodb').ObjectID;
const { client } = require('./dbConnection');
const password = require('../helpers/passwordEncrypt');

async function insertUser(data) {
    const newUser = await client
    .db(process.env.MONGODB_DB)
    .collection('users');

    return newUser.findOne({ email: data.email })
    .then(async record => {
        if (!record) {
            const userInserted = await newUser.insertOne(data);
            return { _id: userInserted.ops[0]._id, username: userInserted.ops[0].username, email: userInserted.ops[0].email };
        }
        else if (record) {
            console.log('record already exists', record)
            throw new Error('record already exists')
        }
    })
    .catch(err => {
        console.log('db insertUser error', err)
        return { error: "db error", message: err.message };
    });
}

async function findUser(data) {
    const findOneUser = await client
    .db(process.env.MONGODB_DB)
    .collection('users')

    return findOneUser.findOne({ email: data.email })
    .then(async user => {
        console.log('db ops',user)
        if (user === null) {
            throw new Error('User not found');
        }
        else if (user) {
            return await password.verify(data.password, user.password)
            .then(pass => {
                if (pass) {
                    return { _id: user._id, email: user.email};
                }
                else {
                    throw new Error('Cannot find user')
                }
            })
        }  
    })
    .catch(err => {
        console.log('db findOne err', err);
        return { error: "db error", message: err.message };
    })
}

async function deleteUser(data) {
    const deleteOneUser = await client
    .db(process.env.MONGODB_DB)
    .collection('users')

    return deleteOneUser.deleteOne(data)
    .then(data => {
        return { deletedCount: data.deletedCount }
    })
    .catch(err => {
        console.log('db deleteUser err', err);
        return { error: "db error", message: err.message };
    })
}

async function updateUser(data) {
    const { _id, message } = data;
    const formattedId = { _id: new ObjectId(_id) };
    console.log('formattted', formattedId)

    const updatingWith = {
        $set: {
            message
        }
    }
    console.log('updating', updatingWith)

    const updateOneUser = await client
    .db(process.env.MONGODB_DB)
    .collection('users')
    console.log('db update', _id, 'message', message)

    return updateOneUser.updateOne(formattedId, updatingWith)
    .then(data => {
        return { modifiedCount: data.modifiedCount}
    })
    .catch(err => { 
        console.log('updateUser err', err)
        return { error: "db error", message: err.message };
    })
}

module.exports = { insertUser, findUser, deleteUser, updateUser };