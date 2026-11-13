
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
      <div className="background-decoration decoration-one"></div>
      <div className="background-decoration decoration-two"></div>

      <main className="todo-container">
        <header className="app-header">
          <div className="app-icon">🌸</div>
          <p className="welcome-text">A LITTLE SPACE FOR BIG PLANS</p>
          <h1>My Todo App</h1>
          <p className="subtitle">
            Make today lovely, one task at a time.
          </p>
        </header>

        <section className="todo-card">
          <div className="section-heading">
            <div>
              <p className="small-heading">YOUR DAILY PLANNER</p>
              <h2>Let's get things done ✨</h2>
            </div>
            <span className="task-count">{todos.length} Tasks</span>
          </div>

          <form onSubmit={handleSubmit} className="todo-form">
            <input
              type="text"
              placeholder="What would you like to do today?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button type="submit">
              {editingId ? "Update Task" : "+ Add Task"}
            </button>
          </form>

          {editingId && (
            <p className="editing-message">
              ✏️ You are editing a task.
            </p>
          )}

          <div className="tasks-section">
            <h3>My Tasks <span>♡</span></h3>

            {loading ? (
              <p className="empty">Loading your lovely tasks...</p>
            ) : todos.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <p className="empty-title">Nothing planned yet!</p>
                <p className="empty">
                  Add your first task and make today productive.
                </p>
              </div>
            ) : (
              <ul className="todo-list">
                {todos.map((todo) => (
                  <li key={todo._id}>
                    <div className="task-info">
                      <span className="task-dot">♡</span>
                      <span className="task-title">{todo.title}</span>
                    </div>

                    <div className="task-actions">
                      <button
                        type="button"
                        className="edit-btn"
                        onClick={() => handleEdit(todo)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
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
        </section>

        <footer className="app-footer">
          Made with love and a little productivity ♡
        </footer>
      </main>
    </div>
  );
}

export default App;
