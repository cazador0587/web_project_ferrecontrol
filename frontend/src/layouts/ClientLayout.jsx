import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const ClientLayout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <header>
        <p>
          {user?.name} {user?.lastname}
        </p>

        <nav>
          <Link to="/catalogo">Catálogo</Link>
          {" | "}
          <Link to="/carrito">Carrito</Link>
          {" | "}
          <Link to="/mis-pedidos">Mis pedidos</Link>
          {" | "}
          <Link to="/perfil">Mi perfil</Link>
        </nav>

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

export default ClientLayout;
