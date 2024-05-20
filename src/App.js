import "./App.css";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import Card from "./Components/Card";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState("");

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    const storedCompletedTasks = JSON.parse(
      localStorage.getItem("completedTasks")
    );

    if (storedTasks && storedCompletedTasks) {
      setTasks(storedTasks);
      setCompletedTasks(storedCompletedTasks);
      setLoading(false);
    } else {
      fetch("https://jsonplaceholder.typicode.com/todos")
        .then((response) => response.json())
        .then((data) => {
          const initialTasks = data.slice(0, 10).map((task) => ({
            ...task,
            completed: false,
          }));
          setTasks(initialTasks);
          setLoading(false);
          localStorage.setItem("tasks", JSON.stringify(initialTasks));
          localStorage.setItem("completedTasks", JSON.stringify([]));
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false);
        });
    }
  }, []);

  const handleAddTask = () => {
    if (value === "") {
      alert("Please Enter Something!!");
    } else {
      if (value.trim()) {
        const newTask = {
          id: tasks.length + 1,
          title: value,
          completed: false,
        };
        setTasks([...tasks, newTask]);
        setValue("");
        toast.success("Added Successfully!", {
          autoClose: 2000,
        });
        localStorage.setItem("tasks", JSON.stringify([...tasks, newTask]));
      }
    }
  };

  const handleRemoveTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    const updatedCompletedTasks = completedTasks.filter(
      (task) => task.id !== id
    );
    setTasks(updatedTasks);
    setCompletedTasks(updatedCompletedTasks);
    toast.error("Deleted Successfully!", {
      autoClose: 2000,
    });
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    localStorage.setItem(
      "completedTasks",
      JSON.stringify(updatedCompletedTasks)
    );
  };

  const handleToggleComplete = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    const taskToMove = updatedTasks.find((task) => task.id === id);
    if (taskToMove.completed) {
      setCompletedTasks([...completedTasks, taskToMove]);
    } else {
      setCompletedTasks(completedTasks.filter((task) => task.id !== id));
    }
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
  };

  return (
    <div className="container">
      <div className="innercontainer">
        <h1 className="heading">TODO LIST</h1>
        <img
          src="https://cdn-icons-png.flaticon.com/512/6194/6194029.png"
          alt=""
          className="img"
        />
      </div>

      <div className="inputsection">
        <input
          type="text"
          className="input"
          placeholder="Add your task 🖊️"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button className="btn" onClick={handleAddTask}>
          +
        </button>
      </div>
      <div className="buttons">
        <button className="condition">All {tasks.length}</button>
        <button className="condition">
          Pending {tasks.length - completedTasks.length}
        </button>
        <button className="condition">Completed {completedTasks.length}</button>
        <button className="condition" onClick={() => setTasks([])}>
          Clear All
        </button>
      </div>

      {loading ? (
        <p className="loading">Loading tasks...</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <Card
              key={task.id}
              id={task.id}
              title={task.title}
              completed={task.completed}
              onRemove={handleRemoveTask}
              onToggleComplete={handleToggleComplete}
            />
          ))}
        </ul>
      )}
      <ToastContainer />
    </div>
  );
}

export default App;
