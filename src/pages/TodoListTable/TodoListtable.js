import React, { Fragment, useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Button, TextField } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { DataGrid } from "@mui/x-data-grid";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Biogasapi from "../apis/Biogasapi";
import Loader from "../../components/loading/Loading";


const TodoListtable = () => {
    const [todos, setTodos] = useState([]);
    const [userName, setUserName] = useState("");
  
    const deleteTodo = async (id) => {
      try {
        const deleteTodo = await Biogasapi.delete(`/todo/${id}`)
        console.log(deleteTodo);
        setTodos(todos.filter((todo) => todo.todo_id !== id));
      } catch (err) {
        console.error(err.message);
      }
    };
  
    const getTodos = async () => {
      try {
         const response = await Biogasapi.get('/todo')
        console.log(response  )
        const jsonData = response.data;
        setTodos(jsonData);
      } catch (err) {
        console.error(err.message);
      }
    };
  
    const toggleTodo = async (id, completed) => {
      try {
        const response = await Biogasapi.put(`/todo/${id}`,{
          completed : !completed
        })
  
        const updatedTodo = await response.data;
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.todo_id === updatedTodo.todo_id ? updatedTodo : todo
          )
        );
      } catch (err) {
        console.error(err.message);
      }
    };
    const navigate = useNavigate()
    const navigateHandle = () => {
        navigate('../addtodo', { replace: true });
    }
    
    useEffect(() => {
      getTodos();
    }, []);
  
    return (
        <>
        <Helmet>
            <title> Biogas | ToDo </title>
          </Helmet>
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={navigateHandle}
            >
                Add Task
            </Button>
            <>
            
                <h1 className="mt-3">Tasks</h1>
                <table className="table table-hover mt-5 text-center">
                    <thead>
                        <tr>
                            <th>Checked</th>
                            <th>Description</th>
                            <th>User Name</th>
                            <th>Assigned Date</th>
                            <th>Due Date</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {todos.map((todo) => (
                            <tr key={todo.todo_id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={todo.completed}
                                        onChange={() => toggleTodo(todo.todo_id, todo.completed)}
                                        style={{ width: '20px', height: '20px' }}
                                    />
                                </td>
                                <td className={todo.completed ? "completed" : ""} style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                                    {`${todo.userName ? `${todo.userName}: ` : ""}${todo.description}`}
                                </td>
                                <td>{todo.user_name}</td>
                                <td>{new Date(todo.created_at).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                                <td>{new Date(todo.end_date).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                                <td>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => deleteTodo(todo.todo_id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </>
        </>
    )

}

export default TodoListtable;