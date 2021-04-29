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
    // .then(user => {
    //     console.log('insertOne ops', user.ops)
    //     return user.ops ? { _id: user.ops[0]._id, name: user.ops[0].name, age: user.ops[0].age }
    //     : { error: "db error", message: "User already exists" };

    // }) 
    .catch(err => {
        console.log('db insertUser error', err)
        return { error: "db error", message: err.message };
    });
}

async function findUser(data) {
    const findOneUser = await client
    .db(process.env.MONGODB_DB)
    .collection('users')

    return findOneUser.findOne({ name: data.name })
    .then(async user => {
        console.log('db ops',user)
        if (user === null) {
            throw new Error('User not found');
        }
        else if (user) {
            return await password.verify(data.password, user.password)
            .then(pass => {
                if (pass) {
                    return { _id: user._id, name: user.name, age: user.age};
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
        return { error: "db error", message: err.message };
    })
}

module.exports = { insertUser, findUser, deleteUser, updateUser };