import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import Footer from "../components/Footer";

const ClientLayout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="client-layout">
      <header className="client-layout__header">
        <div className="client-layout__header-content">
          <p className="client-layout__user">
            {user?.name} {user?.lastname}
          </p>
          <nav className="client-layout__nav">
            <NavLink
              className={({ isActive }) =>
                `client-layout__link${isActive ? " client-layout__link--active" : ""}`
              }
              to="/catalogo"
            >
              Catálogo
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                `client-layout__link${isActive ? " client-layout__link--active" : ""}`
              }
              to="/carrito"
            >
              Carrito
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                `client-layout__link${isActive ? " client-layout__link--active" : ""}`
              }
              to="/mis-pedidos"
            >
              Mis pedidos
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                `client-layout__link${isActive ? " client-layout__link--active" : ""}`
              }
              to="/perfil"
            >
              Mi perfil
            </NavLink>
          </nav>

          <button
            className="client-layout__logout"
            type="button"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="client-layout__main">{children}</main>

      <Footer />
    </div>
  );
};

export default ClientLayout;
