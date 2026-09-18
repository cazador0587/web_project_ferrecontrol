import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const AdminLayout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <header>
        <h1>FerreControl</h1>
        <p>Panel administrativo</p>

        <p>
          {user?.name} {user?.lastname}
        </p>

        <button type="button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </header>

      <main>{children}</main>

      <footer>
        <p>FerreControl</p>
      </footer>
    </div>
  );
};

export default AdminLayout;
