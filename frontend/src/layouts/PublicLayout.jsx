import { NavLink, Outlet } from "react-router-dom";
import Footer from "../components/Footer";

const PublicLayout = () => {
  return (
    <div className="public-layout">
      <header className="public-layout__header">
        <div className="public-layout__header-content">
          <h1 className="public-layout__title">FerreControl</h1>

          <nav className="public-layout__nav">
            <NavLink
              className={({ isActive }) =>
                `public-layout__link${isActive ? " public-layout__link--active" : ""}`
              }
              to="/"
              end
            >
              Inicio
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                `public-layout__link${isActive ? " public-layout__link--active" : ""}`
              }
              to="/catalogo"
            >
              Catálogo
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                `public-layout__link${isActive ? " public-layout__link--active" : ""}`
              }
              to="/login"
            >
              Iniciar sesión
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                `public-layout__link${isActive ? " public-layout__link--active" : ""}`
              }
              to="/registro"
            >
              Registrarse
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="public-layout__main">
        <Outlet />
      </main>

      <Footer text="FerreControl © Fernando Salvador" />
    </div>
  );
};

export default PublicLayout;
