import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section className="home">
      <h1 className="home__title">Bienvenido a FerreControl</h1>

      <p className="home__description">
        Encuentra herramientas, materiales y productos para tus proyectos.
      </p>

      <Link className="home__link" to="/catalogo">
        Ver catálogo
      </Link>
    </section>
  );
};

export default Home;
