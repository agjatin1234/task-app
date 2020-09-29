const express= require('express')
const router= new express.Router()
const User= require('../models/users')
require('../db/mongoose')
const auth= require('../middleware/auth')

router.post('/users',async(req,res) => {
    const user= new User(req.body)
    try {
        await user.save()
        const token= await user.generateAuthToken()

        res.send({user, token})
    }
    catch(e) {
        res.send(e)
    }
    // user.save().then(() => {
    //     res.send(user)
    // }).catch((e) => {
    //     res.send(e)
    // })
})
router.post('/users/login', async (req,res) => {
    try{
        const user= await User.findByCredentials(req.body.email,req.body.password)
        const token= await user.generateAuthToken()
        res.send({ user, token })
    }
    catch(e){
        res.status(404).send()
    }
}) 

const multer= require('multer')
const upload= multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req,file,cb) {
        if (!file.originalname.endsWith('.jpg') && !file.originalname.endsWith('.png') && !file.originalname.endsWith('.jpeg')){
        return cb(new Error('File must be a image'))
        }
        cb(undefined,true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'),async (req,res) => {
    const buffer= await sharp(req.file.buffer).resize({
        width: 250,
        height: 250
    }).png().toBuffer()
    
    req.user.avatar= buffer
    await req.user.save()
    res.send('Images Uploaded')
}, (error,req,res,next) => {
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', auth ,async (req,res) => {
    req.user.avatar= undefined
    await req.user.save()
    res.send('Images Deleted')
}, (error,req,res,next) => {
    res.status(400).send({error: error.message})
})

router.get('/users/:id/avatar',async (req,res) => {
    try{
        const user= await User.findById(req.params.id)
        if (!user || !user.avatar){
            throw new Error('No user with avatar found')
        }
        res.set('Content-Type','image/jpg')
        res.send(user.avatar)
    } catch(e) {
        res.status(404).send('Error!')
    }
})

router.post('/users/logout', auth, async (req,res) => {
    try{
        req.user.tokens= req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    }
    catch (e) {
        res.status(500).send('Problem')
    }
})
router.post('/users/logoutAll', auth, async (req,res) => {
    try{
        req.user.tokens= []
        await req.user.save()
        res.send()
    }
    catch (e) {
        res.status(500).send('Problem')
    }
})

router.get('/users/me', auth, async(req,res) => {
    res.send(req.user)
    // try{
    //     const users= await User.find({})
    //     res.send(users)
    // }
    // catch(e) {
    //     res.status(500).send()
    // }
    // User.find({}).then((users) => {
    //     res.send(users)
    // }).catch((e) => {
    //     res.status(500).send()
    // })
})
// router.get('/users/:id',async(req,res) => {
//     const _id= req.params.id
//     try{
//         const user= await User.findById(_id)
//         if(!user){
//             res.status(404).send()
//         }
//         res.send(user)
//     }
//     catch(e) {
//         res.status(500).send(e)
//     }

//     // User.findById(_id).then((user) => {
//     //     if(!user){
//     //         res.status(404).send()
//     //     }
//     //     res.send(user)
//     // }).catch((e) => {
//     //     res.status(500).send()
//     // })
// })
router.patch('/users/me', auth, async (req,res) => {
    const updates= Object.keys(req.body)
    const allowedUpdates= ['name','age','email','password']
    const validUpdate= updates.every((update) => allowedUpdates.includes(update))
    
    if(!validUpdate){
        return res.status(404).send('Invalid Update')
    }
    try{
        // const user= await User.findById(req.params.id)
        
        updates.forEach((update) => req.user[update]= req.body[update])
        await req.user.save()

        // const user= await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        
        // if(!user){
        //     return res.status(404).send()
        // }
        res.send(req.user)
    }
    catch(e){
        res.status(400).send('Error')
    }
})
router.delete('/users/me', auth, async (req,res) => {
    try{
        // const user= await User.findByIdAndDelete(req.user._id)
        // if(!user){
        //     return res.status(404).send()
        // }
        await req.user.remove()
        res.send(req.user)
    }
    catch(e){
        res.status(500).send()
    }
})

module.exports= router