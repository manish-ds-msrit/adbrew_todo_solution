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

import { useEffect, useState } from "react";

function App() {
  const [description, setDescription] = useState(""); // input field text
  const [todos, setTodos] = useState([]);             // list from backend
  const [loading, setLoading] = useState(false);      // loading spinner
  const [error, setError] = useState(null);           // error message

const API_URL = "https://psychic-succotash-q7ppj447pv653xq94-8000.app.github.dev/todos/";

  // Fetch all todos from backend
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
      setError(err.message || "Failed to load todos");
    } finally {
      setLoading(false);
    }
  };

  // Load todos on first render
  useEffect(() => {
    fetchTodos();
  }, []);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload
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

      setDescription("");   // clear input
      await fetchTodos();   // refresh list
    } catch (err) {
      setError(err.message || "Failed to create todo");
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "0 auto" }}>
      <h2>TODO App</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter todo"
          style={{ width: "70%", marginRight: 8 }}
        />
        <button type="submit">Add</button>
      </form>

      {error && (
        <div style={{ color: "red", marginBottom: 8 }}>
          {error}
        </div>
      )}

      {loading && <div>Loading...</div>}

      <ul>
        {todos.map((t) => (
          <li key={t._id}>{t.description}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
