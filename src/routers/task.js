const express= require('express')
const router= new express.Router()
const Task= require('../models/task')
require('../db/mongoose')
const auth= require('../middleware/auth')
const User= require('../models/users')

router.get('/tasks', auth, async(req,res) => {
    const match= {}
    const sort= {}

    if (req.query.sortBy) {
        const parts= req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] ==='desc' ? -1: 1
    }

    if (req.query.completed){
        match.completed= req.query.completed ==='true'
    }
    try {
        // const tasks= await Task.find({})
        const user= await User.findOne({ _id: req.user })
        await user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(user.tasks)
    }
    catch(e) {
        res.status(500).send(e)
    }
    // Task.find({}).then((tasks) => {
    //     res.send(tasks)
    // }).catch((e) => {
    //     res.status(500).send()
    // })
})
router.get('/tasks/:id', auth, async(req,res) => {
    const _id= req.params.id

    try {
        // const task= await Task.findById(_id)
        const task= await Task.findOne({ _id, owner: req.user._id })
        if(!task){
            res.status(404).send()
        }
        res.send(task)
    }
    catch(e) {
        res.status(500).send(e)
    }
    // Task.findById(_id).then((task) => {
    //     if(!task){
    //         res.status(404).send()
    //     }
    //     res.send(task)
    // }).catch((e) => {
    //     res.status(500).send()
    // })
})

router.post('/tasks', auth, async(req,res) => {
    // const task= new Task(req.body)
    const task= new Task({
        ...req.body,
        owner: req.user.id
    })
    try {
        await task.save()
        res.send(task)
    }
    catch(e) {
        res.send(e)
    }

    // task.save().then(() => {
    //     res.send(task)
    // }).catch((e) => {
    //     res.send(e)
    // })
})
router.patch('/tasks/:id', auth, async (req,res) => {
    const updates= Object.keys(req.body)
    const allowedUpdates= ['description','completed']
    const validUpdate= updates.every((update) => allowedUpdates.includes(update))
    if(!validUpdate){
        return res.status(404).send('Invalid Update')
    }
    try{
        // const task= await Task.findById(req.params.id)
        const task= await Task.findOne({ _id: req.params.id, owner: req.user._id })
        
        if(!task){
            return res.status(404).send()
        }

        updates.forEach((update) => task[update]= req.body[update])
        await task.save()

        // const task= await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        
        res.send(task)
    }
    catch(e){
        res.status(400).send()
    }
})
router.delete('/tasks/:id',auth,async (req,res) => {
    try{
        const task= await Task.findByIdAndDelete({ _id: req.params.id, owner: req.user._id })
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }
    catch(e){
        res.status(500).send()
    }
})

module.exports= router