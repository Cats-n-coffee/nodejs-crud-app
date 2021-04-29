const { client } = require('./dbConnection');
const password = require('../helpers/passwordEncrypt');

async function insertUser(data) {
    const newUser = await client
    .db(process.env.MONGODB_DB)
    .collection('users');

    return newUser.findOne({ name: data.name })
    .then(async record => {
        if (!record) {
            const userInserted = await newUser.insertOne(data)
            return userInserted;
        }
        else if (record) {
            console.log('record already exists', record)
            return record;
        }
    })
    .then(user => {
        console.log('insertOne ops', user.ops)
        return user.ops ? { name: user.ops[0].name, age: user.ops[0].age, _id: user.ops[0]._id }
        : { error: "db error", message: "User already exists" };

    }) 
    .catch(err => {
        console.log('db insertUser error', err)
        return { error: err };
    });
}

async function findUser(data) {
    const findOneUser = await client
    .db(process.env.MONGODB_DB)
    .collection('users')

    return findOneUser.findOne({ name: data.name })
    .then(async user => {
        console.log('db ops',user)
        if (user === null) return { error: 'db error', message: 'User not found' };
        else if (user) {
            return await password.verify(data.password, user.password)
            .then(pass => {
                return pass ? user : 'Cannot find user';
            })
        }  
    })
    
    .catch(err => {
        console.log('db findOne err', err);
        return { error: err };
    })
}

async function deleteUser(data) {
    const deleteOneUser = await client
    .db(process.env.MONGODB_DB)
    .collection('users')
    console.log('user to delete', data)

    return deleteOneUser.deleteOne(data)
    .catch(err => {
        console.log('db deleteUser err', err);
        return { error: err };
    })
}

async function updateUser(data, addon) {
    const updatingWith = {
        $set: {
            addon
        }
    }

    const updateOneUser = await client
    .db(process.env.MONGODB_DB)
    .collection('users')

    return updateOneUser.updateOne(data, updatingWith)
    .then(data => {
        return { modifiedCount: data.modifiedCount}
    })
    .catch(err => { 
        console.log('deleteUser err', err)
        return { error: err };
    })
}

module.exports = { insertUser, findUser, deleteUser, updateUser };