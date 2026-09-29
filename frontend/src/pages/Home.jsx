import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section className="home">
      <div className="home__content">
        <p className="home__eyebrow">Tu ferretería en línea</p>

        <h1 className="home__title">
          Todo para tus proyectos en un solo lugar
        </h1>

        <p className="home__description">
          Encuentra herramientas, materiales y accesorios para construcción,
          reparación y mantenimiento.
        </p>

        <Link className="home__link" to="/catalogo">
          Explorar catálogo
        </Link>
      </div>

      <div className="home__visual" aria-hidden="true">
        <div className="home__visual-accent"></div>

        <div className="home__products">
          <div className="home__product home__product--main">
            <img
              className="home__product-image"
              src="/images/products/mar-002.webp"
              alt=""
            />
          </div>

          <div className="home__product home__product--top">
            <img
              className="home__product-image"
              src="/images/products/seg-002.webp"
              alt=""
            />
          </div>

          <div className="home__product home__product--bottom">
            <img
              className="home__product-image"
              src="/images/products/acc-001.webp"
              alt=""
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
