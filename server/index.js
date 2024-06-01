const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to your MongoDB database
mongoose.connect("mongodb://localhost:27017/TodoList", {
    dbName: 'TodoList',
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connection is successful");
}).catch((e) => {
    console.error("No connection", e);
});

// Define the todo schema and model
const todoSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    deadline: {
        type: Date,
    },
});

const TodoModel = mongoose.model("todo", todoSchema);

// Get saved tasks from the database
app.get("/getTodoList", (req, res) => {
    TodoModel.find({})
        .then((todoList) => res.json(todoList))
        .catch((err) => {
            console.error("Error fetching data:", err);
            res.status(500).json({ error: err.message });
        });
});

// Add new task to the database
app.post("/addTodoList", (req, res) => {
    TodoModel.create({
        task: req.body.task,
        status: req.body.status,
        deadline: req.body.deadline,
    })
        .then((todo) => res.json(todo))
        .catch((err) => {
            console.error("Error adding data:", err);
            res.status(500).json({ error: err.message });
        });
});

// Update task fields (including deadline)
app.post("/updateTodoList/:id", (req, res) => {
    const id = req.params.id;
    const updateData = {
        task: req.body.task,
        status: req.body.status,
        deadline: req.body.deadline,
    };
    TodoModel.findByIdAndUpdate(id, updateData, { new: true })
        .then((todo) => res.json(todo))
        .catch((err) => {
            console.error("Error updating data:", err);
            res.status(500).json({ error: err.message });
        });
});

// Delete task from the database
app.delete("/deleteTodoList/:id", (req, res) => {
    const id = req.params.id;
    TodoModel.findByIdAndDelete(id)
        .then((todo) => res.json({ message: "Task deleted successfully", todo }))
        .catch((err) => {
            console.error("Error deleting data:", err);
            res.status(500).json({ error: err.message });
        });
});

app.listen(3001, () => {
    console.log('Server running on port 3001');
});
