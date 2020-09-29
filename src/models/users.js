const mongoose= require('mongoose')
const validator= require('validator')
const bcrypt= require('bcryptjs')
const jwt= require('jsonwebtoken')
const Task= require('../models/task')

const userSchema= new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 0,
        validate(value){
            if(value<0){
                throw new Error('Age must be positive number')
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error('You type in the wrong Enail')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value){
            if (value.length<6){
                throw new Error('Must be atleast of length 6')
            }
            if (value==='password'){
                throw new Error('This can not be your password ')
            }
        }
    },
    tokens: [{
        token:{
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.virtual('tasks',{
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.pre('save',async function (next) {
    const user= this

    if(user.isModified('password')){
        user.password= await bcrypt.hash(user.password,8)
    }

    next()
})

userSchema.statics.findByCredentials= async(email,password) => {
    const user= await User.findOne({email})
    
    if(!user){
        throw new Error('Unable to Login!')
    }
    const isMatch= await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error('Cant Login!')
    }
    return user
} 

userSchema.methods.generateAuthToken= async function(){
    const user= this 
    const token= jwt.sign({ _id: user._id.toString() },'thisismynewcourse')
    
    user.tokens= user.tokens.concat({ token })
    await user.save()
    return token   
}
userSchema.methods.toJSON= function() {
    const user= this
    const userObj= user.toObject()

    delete userObj.password
    delete userObj.tokens
    delete userObj.avatar

    return userObj
}
userSchema.pre('remove', async function(next) {
    const user= this
    await Task.deleteMany({ owner: user._id })
    next()
})

const User= mongoose.model('User', userSchema)

module.exports= User