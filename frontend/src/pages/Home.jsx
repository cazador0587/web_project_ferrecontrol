import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { products } from "../services/products";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isFeaturedLoading, setIsFeaturedLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState("");
  const FEATURED_PRODUCT_SKUS = ["MAR-001", "ELE-001", "SEG-001"];

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const productData = await products.getAll();
        const productList = productData.products ?? [];

        const selectedProducts = FEATURED_PRODUCT_SKUS
          .map((sku) =>
            productList.find((product) => product.sku === sku),
        ).filter(Boolean);

        setFeaturedProducts(selectedProducts);
      } catch (error) {
        console.error("Error al cargar productos destacados:", error);
        
        setFeaturedError("No fue posible cargar los productos destacados.");
      } finally {
        setIsFeaturedLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  return (
    <div className="home-page">
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

      <section
        className="home-categories"
        aria-labelledby="home-categories-title"
      >
        <div className="home-categories__header">
          <p className="home-categories__eyebrow">Explora por categoría</p>

          <h2 className="home-categories__title" id="home-categories-title">
            Encuentra lo que necesitas
          </h2>

          <p className="home-categories__description">
            Explora nuestras categorías y encuentra productos para cada etapa de
            tu proyecto.
          </p>
        </div>

        <div className="home-categories__featured">
          <Link
            className="home-categories__card home-categories__card--featured"
            to="/catalogo?categoria=Herramientas"
          >
            <div className="home-categories__card-content">
              <div>
                <span className="home-categories__card-label">
                  Herramientas
                </span>

                <p className="home-categories__card-description">
                  Todo para reparar, construir y mantener.
                </p>
              </div>

              <span className="home-categories__card-link">
                Explorar categoría →
              </span>
            </div>

            <img
              className="home-categories__card-image"
              src="/images/products/mar-001.webp"
              alt=""
            />
          </Link>

          <Link
            className="home-categories__card home-categories__card--featured"
            to="/catalogo?categoria=Materiales%20de%20construcci%C3%B3n"
          >
            <div className="home-categories__card-content">
              <div>
                <span className="home-categories__card-label">
                  Materiales de construcción
                </span>

                <p className="home-categories__card-description">
                  Productos esenciales para cada etapa de obra.
                </p>
              </div>

              <span className="home-categories__card-link">
                Explorar categoría →
              </span>
            </div>

            <img
              className="home-categories__card-image"
              src="/images/products/mat-001.webp"
              alt=""
            />
          </Link>
        </div>

        <div className="home-categories__grid">
          {[
            "Tornillería",
            "Electricidad",
            "Plomería",
            "Pinturas",
            "Accesorios",
            "Seguridad",
          ].map((category) => (
            <Link
              className="home-categories__quick-link"
              key={category}
              to={`/catalogo?categoria=${encodeURIComponent(category)}`}
            >
              <span>{category}</span>
              <span className="home-categories__quick-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="home-featured" aria-labelledby="home-featured-title">
        <div className="home-featured__header">
          <div>
            <p className="home-featured__eyebrow">Selección FerreControl</p>

            <h2 className="home-featured__title" id="home-featured-title">
              Productos destacados
            </h2>

            <p className="home-featured__description">
              Descubre productos para construcción, reparación y mantenimiento.
            </p>
          </div>

          <Link className="home-featured__catalog-link" to="/catalogo">
            Ver todo el catálogo →
          </Link>
        </div>

        {isFeaturedLoading && (
          <p className="home-featured__status">
            Cargando productos destacados...
          </p>
        )}

        {!isFeaturedLoading && featuredError && (
          <p className="home-featured__status">{featuredError}</p>
        )}

        {!isFeaturedLoading &&
          !featuredError &&
          featuredProducts.length > 0 && (
            <div className="home-featured__grid">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  variant="featured"
                />
              ))}
            </div>
          )}
      </section>
      <section className="home-benefits" aria-labelledby="home-benefits-title">
        <div className="home-benefits__header">
          <p className="home-benefits__eyebrow">Compra con confianza</p>

          <h2 className="home-benefits__title" id="home-benefits-title">
            ¿Por qué FerreControl?
          </h2>

          <p className="home-benefits__description">
            Una experiencia sencilla para encontrar los productos que necesitas
            y tomar mejores decisiones para tus proyectos.
          </p>
        </div>

        <div className="home-benefits__grid">
          <article className="home-benefits__item">
            <span className="home-benefits__number" aria-hidden="true">
              01
            </span>

            <h3 className="home-benefits__item-title">Catálogo organizado</h3>

            <p className="home-benefits__item-description">
              Encuentra herramientas, materiales y accesorios organizados por
              categoría.
            </p>
          </article>

          <article className="home-benefits__item">
            <span className="home-benefits__number" aria-hidden="true">
              02
            </span>

            <h3 className="home-benefits__item-title">Información clara</h3>

            <p className="home-benefits__item-description">
              Consulta precios, disponibilidad y detalles antes de elegir un
              producto.
            </p>
          </article>

          <article className="home-benefits__item">
            <span className="home-benefits__number" aria-hidden="true">
              03
            </span>

            <h3 className="home-benefits__item-title">Compra sencilla</h3>

            <p className="home-benefits__item-description">
              Explora productos y agrégalos a tu carrito desde una experiencia
              simple y directa.
            </p>
          </article>
        </div>
      </section>
      <section className="home-cta" aria-labelledby="home-cta-title">
        <div className="home-cta__content">
          <p className="home-cta__eyebrow">Empieza tu próximo proyecto</p>

          <h2 className="home-cta__title" id="home-cta-title">
            Encuentra lo que necesitas para hacerlo realidad
          </h2>

          <p className="home-cta__description">
            Explora nuestro catálogo y descubre herramientas, materiales y
            accesorios para cada etapa de tu proyecto.
          </p>

          <div className="home-cta__actions">
            <Link className="home-cta__primary" to="/catalogo">
              Explorar catálogo
            </Link>

            <Link className="home-cta__secondary" to="/registro">
              Crear una cuenta →
            </Link>
          </div>
        </div>

        <div className="home-cta__visual" aria-hidden="true">
          <span className="home-cta__circle"></span>

          <img
            className="home-cta__image"
            src="/images/products/mar-002.webp"
            alt=""
          />
        </div>
      </section>
    </div>
  );
};

export default Home;
