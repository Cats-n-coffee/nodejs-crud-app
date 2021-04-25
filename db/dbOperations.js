const { client } = require('./dbConnection');

async function insertUser(data) {
    const newUser = await client
    .db(process.env.MONGODB_DB)
    .collection('users');

    return newUser.findOne({ name: data.name })
    .then(async record => {
        if (!record) {
            const userInserted = await newUser.insertOne({ name: data.name, age: data.age })
            return userInserted;
        }
        else if (record) {
            console.log('record already exists', record)
            return record;
        }
    })
    .then(user => {
        console.log('insertOne ops', user.ops)
        return user.ops ? user.ops[0] : { error: "db error", message: "User already exists" };

    }) 
    .catch(err => console.log('insertUser err', err));
}

async function findUser(data) {
    const findOneUser = await client
    .db(process.env.MONGODB_DB)
    .collection('users')

    return findOneUser.findOne(data)
    .then(user => {
        console.log('db ops',user)
        return user === null ? { error: 'db error', message: 'User not found' } : user;
    })
    .catch(err => console.log('findOne err', err))
}

async function deleteUser(data) {
    const deleteOneUser = await client
    .db(process.env.MONGODB_DB)
    .collection('users')
    console.log('user to delete', data)

    return deleteOneUser.deleteOne(data)
    .catch(err => console.log('deleteUser err', err))
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
        return { err: err.message };
    })
}

module.exports = { insertUser, findUser, deleteUser, updateUser };