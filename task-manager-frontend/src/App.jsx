
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://exercise4-iieg.onrender.com/tasks";

const columns = ["Pending", "Ongoing", "Completed"];

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  // FETCH TASKS
  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        alert("Unable to load tasks from server");
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, []);

  // ADD TASK
  async function addTask(e) {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a task name.");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
        }),
      });

      const savedTask = await response.json();

      if (!response.ok) {
        alert(savedTask.message || "Failed to add task");
        return;
      }

      setTasks((previous) => [...previous, savedTask]);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Server connection failed");
    }
  }

  // UPDATE STATUS
  async function updateStatus(id, status) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const updatedTask = await response.json();

      if (!response.ok) {
        alert(updatedTask.message || "Failed to update status");
        return;
      }

      setTasks((previous) =>
        previous.map((task) =>
          task._id === id ? updatedTask : task
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Unable to update task");
    }
  }

  // DELETE TASK
  async function deleteTask(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Failed to delete task");
        return;
      }

      setTasks((previous) =>
        previous.filter((task) => task._id !== id)
      );
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Unable to delete task");
    }
  }

  return (
    <main className="dashboard">
      <header className="page-header">
        <h1>Task Management Dashboard</h1>
        <p>Organise your daily tasks in one place.</p>
      </header>

      <form className="task-form" onSubmit={addTask}>
        <input
          type="text"
          placeholder="Enter a new task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Task name"
        />

        <button className="add-button" type="submit">
          + Add Task
        </button>

        <textarea
          placeholder="Enter task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          aria-label="Task description"
        />
      </form>

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <section className="task-board">
          {columns.map((column) => {
            const columnTasks = tasks.filter(
              (task) => task.status === column
            );

            return (
              <div
                className={`task-column ${column.toLowerCase()}`}
                key={column}
              >
                <div className="column-heading">
                  <h2>{column}</h2>
                  <span className="task-count">
                    {columnTasks.length}
                  </span>
                </div>

                {columnTasks.length === 0 ? (
                  <p className="empty-message">No tasks yet</p>
                ) : (
                  columnTasks.map((task) => (
                    <article className="task-card" key={task._id}>
                      <h3>{task.title}</h3>

                      {task.description && (
                        <p className="task-description">
                          {task.description}
                        </p>
                      )}

                      <label className="status-label">
                        Update Status
                      </label>

                      <select
                        value={task.status}
                        onChange={(e) =>
                          updateStatus(task._id, e.target.value)
                        }
                        aria-label={`Update status of ${task.title}`}
                      >
                        {columns.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>

                      <button
                        className="delete-button"
                        onClick={() => deleteTask(task._id)}
                        type="button"
                      >
                        Delete
                      </button>
                    </article>
                  ))
                )}
              </div>
            );
          })}
        </section>
      )}
    </main>
  );
}

export default App;
