

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5500;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/todo_list');
const taskSchema = new mongoose.Schema({
    title: String,
    completed: Boolean,
});
const Work = mongoose.model('Work',taskSchema); // Collection created

//GET: Fetch all Tasks from database
app.get('/api/tasks',async(req,res) => {
    try{
        const tasks = await Work.find();
        res.json(tasks);
    }catch(error){
        console.error(error);
        res.status(500).json({error: 'Server error'});
    }
})

//POST: Add a new Task to the database
app.post('/api/tasks',async(req,res) => {
    const newTask = new Work(req.body);

    try{
        const savedTask = await newTask.save();
        res.json(savedTask);
    }catch(error){
        console.error(error);
        res.status(500).json({error: 'Server error'});
    }
})

// PUT: Update a Task
app.put('/api/tasks/:id',async(req,res) => {
    try{
        const updatedTask = await Work.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        );
        res.json(updatedTask);
    }catch(error){
        console.error(error);
        res.status(500).json({error: 'Server error'});
    }
})

// DELETE: Remove a Task
app.delete('/api/tasks/:id',async(req,res) => {
    try{
        const deletedTask = await Work.findByIdAndDelete(req.params.id);
        res.json(deletedTask);
    }catch(error){
        console.error(error);
        res.status(500).json({error: 'Server error'});
    }
});

app.listen(PORT,()=>{console.log("Server is running on port", PORT)});