const { client } = require('./dbConnection');

async function insertUser(data) {
    const newUser = await client
    .db(process.env.MONGODB_DB)
    .collection('users');

    return newUser.findOne({ name: data.name })
    .then(async record => {
        if (!record) {
            const userInserted = await newUser.insertOne({ name: data.name, age: data.age })
            console.log('userInsert',userInserted);
            return userInserted;
        }
        else if (record) {
            console.log('record already exists', record)
            return record;
        }
    }) 
    .catch(err => console.log('insertUser err', err));
    console.log('user inserted')
    return newUser;
}

async function findUser(data) {
    const findOneUser = await client
    .db(process.env.MONGODB_DB)
    .collection('users')
    .findOne(data)
    .then(user => user)
    .catch(err => console.log('findOne err', err))
    console.log('user found', findOneUser)
    return findOneUser;
}

async function deleteUser(data) {
    const deleteOneUser = await client
    .db(process.env.MONGODB_DB)
    .collection('users')
    .deleteOne(data)
    .catch(err => console.log('deleteUser err', err))
    console.log('deleted one user')
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
    .updateOne(data, updatingWith)
    .catch(err => console.log('deleteUser err', err))
    console.log('updated one user')
}

module.exports = { insertUser, findUser, deleteUser, updateUser };