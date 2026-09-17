import { useEffect, useState } from "react";
import { api } from "./services/api";

function App() {
  const [message, setMessage] = useState("Conectando con FerreControl...");
  const [error, setError] = useState("");

  useEffect(() => {
    api
        .get("/health")
        .then((data) => {
          setMessage(data.message);
        })
        .catch((err) => {
          setError(err.message);
        });
  }, []);

  return (
    <main>
      <h1>FerreControl</h1>

      {error ? <p>Error: {error}</p> : <p>{message}</p>}
    </main>
  );
}

export default App;
