import axios from "axios";
import React, { useEffect, useState } from "react";
import './todo.css';  // Import the CSS file

function Todo() {
    const [todoList, setTodoList] = useState([]);
    const [editableId, setEditableId] = useState(null);
    const [editedTask, setEditedTask] = useState("");
    const [editedStatus, setEditedStatus] = useState("");
    const [newTask, setNewTask] = useState("");
    const [newStatus, setNewStatus] = useState("");
    const [newDeadline, setNewDeadline] = useState("");
    const [editedDeadline, setEditedDeadline] = useState("");

    // Fetch tasks from database 
    useEffect(() => {
        axios.get('http://localhost:3001/getTodoList')
            .then(result => {
                setTodoList(result.data)
            })
            .catch(err => console.log("Error fetching data:", err));
    }, []);

    // Function to toggle the editable state for a specific row 
    const toggleEditable = (id) => {
        const rowData = todoList.find((data) => data._id === id);
        if (rowData) {
            setEditableId(id);
            setEditedTask(rowData.task);
            setEditedStatus(rowData.status);
            setEditedDeadline(rowData.deadline || "");
        } else {
            setEditableId(null);
            setEditedTask("");
            setEditedStatus("");
            setEditedDeadline("");
        }
    };

    // Function to add task to the database 
    const addTask = (e) => {
        e.preventDefault();
        if (!newTask || !newStatus || !newDeadline) {
            alert("All fields must be filled out.");
            return;
        }

        axios.post('http://localhost:3001/addTodoList', { task: newTask, status: newStatus, deadline: newDeadline })
            .then(res => {
                console.log(res);
                window.location.reload();
            })
            .catch(err => console.log("Error adding data:", err));
    }

    // Function to save edited data to the database 
    const saveEditedTask = (id) => {
        const editedData = {
            task: editedTask,
            status: editedStatus,
            deadline: editedDeadline,
        };

        // If the fields are empty 
        if (!editedTask || !editedStatus || !editedDeadline) {
            alert("All fields must be filled out.");
            return;
        }

        // Updating edited data to the database through updateById API 
        axios.post('http://localhost:3001/updateTodoList/' + id, editedData)
            .then(result => {
                console.log(result);
                setEditableId(null);
                setEditedTask("");
                setEditedStatus("");
                setEditedDeadline(""); // Clear the edited deadline 
                window.location.reload();
            })
            .catch(err => console.log("Error updating data:", err));
    }

    // Delete task from database 
    const deleteTask = (id) => {
        axios.delete('http://localhost:3001/deleteTodoList/' + id)
            .then(result => {
                console.log(result);
                window.location.reload();
            })
            .catch(err => console.log("Error deleting data:", err));
    }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-7">
                    <h2 className="text-center">Todo List</h2>
                    <div className="table-responsive">
                        <table className="table1 table-bordered">
                            <thead className="table-primary">
                                <tr>
                                    <th>Task</th>
                                    <th>Status</th>
                                    <th>Deadline</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            {Array.isArray(todoList) ? (
                                <tbody>
                                    {todoList.map((data) => (
                                        <tr key={data._id}>
                                            <td>
                                                {editableId === data._id ? (
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={editedTask}
                                                        onChange={(e) => setEditedTask(e.target.value)}
                                                    />
                                                ) : (
                                                    data.task
                                                )}
                                            </td>
                                            <td>
                                                {editableId === data._id ? (
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={editedStatus}
                                                        onChange={(e) => setEditedStatus(e.target.value)}
                                                    />
                                                ) : (
                                                    data.status
                                                )}
                                            </td>
                                            <td>
                                                {editableId === data._id ? (
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        value={editedDeadline ? new Date(editedDeadline).toISOString().substring(0, 10) : ""}
                                                        onChange={(e) => setEditedDeadline(e.target.value)}
                                                    />
                                                ) : (
                                                    new Date(data.deadline).toLocaleDateString()
                                                )}
                                            </td>
                                            <td>
                                                {editableId === data._id ? (
                                                    <button className="btn btn-success" onClick={() => saveEditedTask(data._id)}>
                                                        Save
                                                    </button>
                                                ) : (
                                                    <button className="btn btn-primary" onClick={() => toggleEditable(data._id)}>
                                                        Edit
                                                    </button>
                                                )}
                                                <button className="btn btn-danger" onClick={() => deleteTask(data._id)}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            ) : (
                                <tbody>
                                    <tr>
                                        <td colSpan="4" className="text-center">No tasks found</td>
                                    </tr>
                                </tbody>
                            )}
                        </table>
                    </div>
                </div>
                <div className="col-md-5">
                    <div className="add-task-form">
                        <h2 className="text-center">Add New Task</h2>
                        <form onSubmit={addTask}>
                            <label htmlFor="task">Task:</label>
                            <input
                                type="text"
                                id="task"
                                className="form-control"
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                            />
                            <label htmlFor="status">Status:</label>
                            <input
                                type="text"
                                id="status"
                                className="form-control"
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                            />
                            <label htmlFor="deadline">Deadline:</label>
                            <input
                                type="date"
                                id="deadline"
                                className="form-control"
                                value={newDeadline}
                                onChange={(e) => setNewDeadline(e.target.value)}
                            />
                            <button type="submit" className="btn btn-success mt-3">Add Task</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Todo;
