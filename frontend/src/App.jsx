
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000/api/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(API_URL);
      setTodos(response.data);
    } catch (error) {
      alert("Unable to load todos. Check your backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, { title });
        setEditingId(null);
      } else {
        await axios.post(API_URL, { title });
      }

      setTitle("");
      fetchTodos();
    } catch (error) {
      alert("Unable to save todo.");
    }
  };

  const handleEdit = (todo) => {
    setTitle(todo.title);
    setEditingId(todo._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this todo?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTodos();
    } catch (error) {
      alert("Unable to delete todo.");
    }
  };

  return (
    <div className="app">
      <div className="todo-container">
        <h1>My Todo App</h1>
        <p className="subtitle">Organize your day, one task at a time.</p>

        <form onSubmit={handleSubmit} className="todo-form">
          <input
            type="text"
            placeholder="Enter your task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button type="submit">
            {editingId ? "Update" : "Add Todo"}
          </button>
        </form>

        <h2>My Tasks ({todos.length})</h2>

        {loading ? (
          <p>Loading tasks...</p>
        ) : todos.length === 0 ? (
          <p className="empty">No tasks yet. Add your first task!</p>
        ) : (
          <ul className="todo-list">
            {todos.map((todo) => (
              <li key={todo._id}>
                <span>{todo.title}</span>
                <div>
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(todo)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(todo._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
