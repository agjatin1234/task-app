const mongoose= require('mongoose')
const validator= require('validator')

mongoose.connect('mongodb://localhost:27017/task-manager-api',{
    useNewUrlParser:true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
// const User= mongoose.model('User',{
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     age: {
//         type: Number,
//         default: 0,
//         validate(value){
//             if(value<0){
//                 throw new Error('Age must be positive number')
//             }
//         }
//     },
//     email: {
//         type: String,
//         required: true,
//         trim: true,
//         lowercase: true,
//         validate(value){
//             if (!validator.isEmail(value)){
//                 throw new Error('You type in the wrong Enail')
//             }
//         }
//     },
//     password: {
//         type: String,
//         required: true,
//         trim: true,
//         validate(value){
//             if (value.length<6){
//                 throw new Error('Must be atleast of length 6')
//             }
//             if (value==='password'){
//                 throw new Error('This can not be your password ')
//             }
//         }
//     }
// })
// const me= new User({
//     name:'Lucas',
//     age: 17,
//     email: 'lucas@google.com',
//     password: 'lucas123'
// })
// me.save().then(() => {
//     console.log(me)
// }).catch((error) => {
//     console.log(error)
// })
// const Task= mongoose.model('Task',{
//     description: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     completed: {
//         type: Boolean,
//         default: false
//     }
// })
// const me= new Task({
//     description: 'Cook'
// })
// me.save().then(() => {
//     console.log(me)
// }).catch((error) => {
//     console.log(error)
// })