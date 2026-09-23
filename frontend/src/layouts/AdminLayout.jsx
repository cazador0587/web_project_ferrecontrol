import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import Footer from "../components/Footer";

const AdminLayout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="admin-layout">
      <header className="admin-layout__header">
        <div className="admin-layout__header-content">
          <h1 className="admin-layout__title">FerreControl</h1>
          <p className="admin-layout__subtitle">Panel administrativo</p>
          <p className="admin-layout__user">
            {user?.name} {user?.lastname}
          </p>

          <nav className="admin-layout__nav">
            <NavLink
              className={({ isActive }) =>
                `admin-layout__link${isActive ? " admin-layout__link--active" : ""}`
              }
              to="/admin"
              end
            >
              Dashboard
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `admin-layout__link${isActive ? " admin-layout__link--active" : ""}`
              }
              to="/admin/productos"
              end
            >
              Productos
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `admin-layout__link${isActive ? " admin-layout__link--active" : ""}`
              }
              to="/admin/productos/nuevo"
              end
            >
              Crear Producto
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `admin-layout__link${isActive ? " admin-layout__link--active" : ""}`
              }
              to="/admin/pedidos"
              end
            >
              Pedidos
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `admin-layout__link${isActive ? " admin-layout__link--active" : ""}`
              }
              to="/admin/usuarios"
              end
            >
              Usuarios
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `admin-layout__link${isActive ? " admin-layout__link--active" : ""}`
              }
              to="/admin/categorias"
              end
            >
              Categorías
            </NavLink>
          </nav>

          <button
            className="admin-layout__logout"
            type="button"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="admin-layout__main">{children}</main>

      <Footer />
    </div>
  );
};

export default AdminLayout;
