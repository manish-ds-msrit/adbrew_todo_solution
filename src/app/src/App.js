// import './App.css';
// import logo from './logo.svg';


// export function App() {
//   return (
//     <div className="App">
//       <div>
//         <h1>List of TODOs</h1>
//         <li>Learn Docker</li>
//         <li>Learn React</li>
//       </div>
//       <div>
//         <h1>Create a ToDo</h1>
//         <form>
//           <div>
//             <label for="todo">ToDo: </label>
//             <input type="text" />
//           </div>
//           <div style={{"marginTop": "5px"}}>
//             <button>Add ToDo!</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default App;







// //1
// import { useEffect, useState } from "react";

// function App() {
//   const [description, setDescription] = useState(""); // input field text
//   const [todos, setTodos] = useState([]);             // list from backend
//   const [loading, setLoading] = useState(false);      // loading spinner
//   const [error, setError] = useState(null);           // error message

// const API_URL = "https://psychic-succotash-q7ppj447pv653xq94-8000.app.github.dev/todos/";

//   // Fetch all todos from backend
//   const fetchTodos = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const res = await fetch(API_URL);
//       if (!res.ok) {
//         throw new Error("Failed to fetch todos");
//       }
//       const data = await res.json();
//       setTodos(data);
//     } catch (err) {
//       setError(err.message || "Failed to load todos");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Load todos on first render
//   useEffect(() => {
//     fetchTodos();
//   }, []);

//   // Handle form submit
//   const handleSubmit = async (e) => {
//     e.preventDefault(); // prevent page reload
//     if (!description.trim()) {
//       setError("Description cannot be empty");
//       return;
//     }

//     try {
//       setError(null);
//       const res = await fetch(API_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ description: description.trim() }),
//       });
//       if (!res.ok) {
//         throw new Error("Failed to create todo");
//       }

//       setDescription("");   // clear input
//       await fetchTodos();   // refresh list
//     } catch (err) {
//       setError(err.message || "Failed to create todo");
//     }
//   };

//   return (
//     <div style={{ padding: 20, maxWidth: 500, margin: "0 auto" }}>
//       <h2>TODO App</h2>

//       <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
//         <input
//           type="text"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           placeholder="Enter todo"
//           style={{ width: "70%", marginRight: 8 }}
//         />
//         <button type="submit">Add</button>
//       </form>

//       {error && (
//         <div style={{ color: "red", marginBottom: 8 }}>
//           {error}
//         </div>
//       )}

//       {loading && <div>Loading...</div>}

//       <ul>
//         {todos.map((t) => (
//           <li key={t._id}>{t.description}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;






//2
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ⬇️ IMPORTANT: keep your own URL with /todos/ here
  const API_URL = "https://psychic-succotash-q7ppj447pv653xq94-8000.app.github.dev/todos/";

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(API_URL);
      if (!res.ok) {
        throw new Error("Failed to fetch todos");
      }
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      setError(err.message || "Something went wrong while loading todos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description.trim()) {
      setError("Description cannot be empty");
      return;
    }

    try {
      setError(null);
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: description.trim() }),
      });

      if (!res.ok) {
        throw new Error("Failed to create todo");
      }

      setDescription("");
      await fetchTodos();
    } catch (err) {
      setError(err.message || "Something went wrong while creating todo");
    }
  };

  return (
    <div className="app-root">
      <div className="app-container">
        <header className="app-header">
          <h1 className="app-title">Todo Manager</h1>
          <p className="app-subtitle">
            Add tasks, store them in the backend, and see them instantly.
          </p>
        </header>

        <main className="card">
          <form className="todo-form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What do you need to do?"
              className="todo-input"
            />
            <button type="submit" className="todo-button">
              Add
            </button>
          </form>

          {error && <div className="alert alert-error">{error}</div>}
          {loading && <div className="info-text">Loading todos…</div>}

          <section className="todo-list-section">
            <h2 className="section-title">Your Todos</h2>
            {todos.length === 0 && !loading && (
              <p className="info-text">No todos yet. Start by adding one!</p>
            )}

            <ul className="todo-list">
              {todos.map((t) => (
                <li key={t._id} className="todo-item">
                  <span className="todo-dot" />
                  <span className="todo-text">{t.description}</span>
                </li>
              ))}
            </ul>
          </section>
        </main>

        <footer className="app-footer">
          <span>Backend: Django + MongoDB</span>
          <span>Frontend: React Hooks</span>
        </footer>
      </div>
    </div>
  );
}

export default App;
