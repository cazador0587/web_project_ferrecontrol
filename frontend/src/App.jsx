import { useContext } from "react";
import Login from "./pages/Login";
import { AuthContext } from "./contexts/AuthContext";

function App() {
  const { user, isLoading, logout } = useContext(AuthContext);

  if (isLoading) {
    return <p>Cargando sesión...</p>;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <main>
      <h1>Bienvenido a FerreControl</h1>

      <p>
        Usuario: {user.name} {user.lastname}
      </p>

      <p>Correo: {user.email}</p>

      <p>Rol: {user.role}</p>

      <button type="button" onClick={logout}>
        Cerrar sesión
      </button>
    </main>
  );
}

export default App;
