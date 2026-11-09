
import { useEffect, useState } from "react";
import "./App.css";

const initialTasks = [
  {
    id: 1,
    title: "Document Testing",
    description: "Check and verify all submitted documents.",
    status: "Pending",
  },
  {
    id: 2,
    title: "Document Verification",
    description: "Verify the documents and update their status.",
    status: "Ongoing",
  },
  {
    id: 3,
    title: "Document Preparation",
    description: "Prepare the final documents for submission.",
    status: "Completed",
  },
];

const columns = ["Pending", "Ongoing", "Completed"];

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("my-tasks")) || initialTasks;
    } catch {
      return initialTasks;
    }
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    localStorage.setItem("my-tasks", JSON.stringify(tasks));
  }, [tasks]);

  function addTask(e) {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a task name.");
      return;
    }

    const newTask = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      status: "Pending",
    };

    setTasks((previous) => [...previous, newTask]);
    setTitle("");
    setDescription("");
  }

  function updateStatus(id, status) {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id ? { ...task, status } : task
      )
    );
  }

  function deleteTask(id) {
    setTasks((previous) =>
      previous.filter((task) => task.id !== id)
    );
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
                  <article className="task-card" key={task.id}>
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
                        updateStatus(task.id, e.target.value)
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
                      onClick={() => deleteTask(task.id)}
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
    </main>
  );
}

export default App;
