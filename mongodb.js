// const mongodb = require('mongodb')
// const MongoClient= mongodb.MongoClient
const { MongoClient, ObjectId} = require('mongodb')

const id= new ObjectId()
console.log(id)
// console.log(id.getTimestamp())
// console.log(id.id.length)
// console.log(id.toHexString().length)

const connectionURL= 'mongodb://localhost:27017'
const databaseName= 'task-manager'

MongoClient.connect(connectionURL,{ useUnifiedTopology: true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to Database')
    }
    const db= client.db(databaseName)

    db.collection('users').deleteMany({
        age: 65
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })
})
// db.collection('user').insertOne({
    //     name: 'Andrew',
    //     age: 27
    // },(error,result) => {
    //     if (error){
    //         return console.log('Unable to insert user')
    //     }
    //     console.log(result.ops)
    // })
    // db.collection('users').insertMany([
    //     {
    //         name: 'Jon',
    //         age: 18
    //     },
    //     {
    //         name: 'Wick',
    //         age: 64
    //     }
    // ], (error ,result) => {
    //     if(error){
    //         return console.log('Unable to add user')
    //     }
    //     console.log(result.ops)
    // })
    // db.collection('tasks').insertMany([
    //     {
    //         description: 'Clean The House',
    //         completed: true
    //     },
    //     {
    //         description: 'Cook something',
    //         completed: true
    //     },
    //     {
    //         description: 'Take a Bath',
    //         completed: false
    //     }
    // ], (error ,result) => {
    //     if(error){
    //         return console.log('Unable to add user')
    //     }
    //     console.log(result.ops)
    // })
    // db.collection('users').findOne({ _id: new ObjectId("5f469cf68e92ab42f8fc0cbf")}, (error,user) => {
    //     if(error){
    //         return console.log("Unable")
    //     }
    //     console.log(user)
    // })
    // db.collection('users').find({ age: 18 }).toArray((error,users) => {
    //     console.log(users)
    // })
    // db.collection('users').find({ age: 18 }).count((error,c) => {
    //     console.log(c)
    // })
    // db.collection('users').updateOne({
    //     _id: new ObjectId("5f469cf68e92ab42f8fc0cbf")
    // },{
    //     $set: {
    //         name: 'Will'
    //     },
    //     $inc:{
    //         age: 1
    //     }
    // }).then( (result) => {
    //     console.log(result)
    // }).catch( (error) => {
    //     console.log(error)
    // })
    // db.collection('tasks').updateMany({
    //     completed: false
    // },{
    //     $set: {
    //         completed: true
    //     }
    // }).then( (result) => {
    //     console.log(result)
    // }).catch( (error) => {
    //     console.log(error)
    // })