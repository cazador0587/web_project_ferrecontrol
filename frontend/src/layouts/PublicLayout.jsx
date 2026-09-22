import { Link } from "react-router-dom";

const PublicLayout = ({ children }) => {
  return (
    <div>
      <header>
        <h1>FerreControl</h1>

        <nav>
          <Link to="/">Inicio</Link>
          {" | "}
          <Link to="/catalogo">Catálogo</Link>
          {" | "}
          <Link to="/login">Iniciar sesión</Link>
          {" | "}
          <Link to="/registro">Registrarse</Link>
        </nav>
      </header>

      <main>{children}</main>

      <footer>
        <p>FerreControl</p>
      </footer>
    </div>
  );
};

export default PublicLayout;
