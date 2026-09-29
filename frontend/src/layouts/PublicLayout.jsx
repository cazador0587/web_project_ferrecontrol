import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import Footer from "../components/Footer";

const PublicLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="public-layout">
      <header className="public-layout__header">
        <div className="public-layout__header-content">
          <h1 className="public-layout__title">FerreControl</h1>

          <button
            className={`public-layout__menu-button${
              isMenuOpen ? " public-layout__menu-button--open" : ""
            }`}
            type="button"
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isMenuOpen}
            aria-controls="public-navigation"
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            <span className="public-layout__menu-line"></span>
            <span className="public-layout__menu-line"></span>
            <span className="public-layout__menu-line"></span>
          </button>

          <nav
            id="public-navigation"
            className={`public-layout__nav${
              isMenuOpen ? " public-layout__nav--open" : ""
            }`}
          >
            <NavLink
              className={({ isActive }) =>
                `public-layout__link${
                  isActive ? " public-layout__link--active" : ""
                }`
              }
              to="/"
              end
              onClick={closeMenu}
            >
              Inicio
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                `public-layout__link${
                  isActive ? " public-layout__link--active" : ""
                }`
              }
              to="/catalogo"
              onClick={closeMenu}
            >
              Catálogo
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                `public-layout__link${
                  isActive ? " public-layout__link--active" : ""
                }`
              }
              to="/login"
              onClick={closeMenu}
            >
              Iniciar sesión
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                `public-layout__link${
                  isActive ? " public-layout__link--active" : ""
                }`
              }
              to="/registro"
              onClick={closeMenu}
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
