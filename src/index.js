const express= require('express')
require('./db/mongoose.js')
const User= require('./models/users.js')
const Task= require('./models/task.js')
const userRouter= require('./routers/user')
const taskRouter= require('./routers/task')

const app= express()
const port= process.env.PORT || 3000

// app.use((req,res,next) => {
//     if(req.method==='GET'){
//         res.send('GET request are disabled')
//     }
//     else{
//         next()
//     }
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port,() => {
    console.log('Server is running at port '+ port)
})

// const bcrypt= require('bcryptjs')

// const myFunction= async () => {
//     const password= 'Red12345!'
//     const hashedPassword= await bcrypt.hash(password, 8)

//     console.log(password,hashedPassword)
//     const isMatch= await bcrypt.compare(password,hashedPassword)
//     console.log(isMatch)
// }

// const jwt= require('jsonwebtoken')

// const myFunction= async() => {
//     const token = jwt.sign({ _id:'abc123' },'thisismynewcourse',{ expiresIn: '7 days'})
//     console.log(token)    
//     const isver= jwt.verify(token,'thisismynewcourse')
//     console.log(isver)
// }
// myFunction()

// const main= async () => {
//     const task = await Task.findById('5f63a50ce49f8a4fd0f74bec')
//     await task.populate('owner').execPopulate()
//     console.log(task.owner)

//     const user= await User.findById('5f63a41ce49f8a4fd0f74be9')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)

// }

// main()

// const multer= require('multer')
// const upload= multer({
//     dest: 'images'
// })

// const errorMiddleware= (req,res,next) => {
//     throw new Error('From the Middleware')
// }
// app.post('/upload', upload.single('upload') , (req,res) => {
//     res.send()
// },(error,req,res,next) => {
//     res.status(400).send({error: error.message})
// })

