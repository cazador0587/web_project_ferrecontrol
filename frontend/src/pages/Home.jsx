import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section>
      <h1>Bienvenido a FerreControl</h1>

      <p>Encuentra herramientas, materiales y productos para tus proyectos.</p>

      <Link to="/catalogo">Ver catálogo</Link>
    </section>
  );
};

export default Home;
