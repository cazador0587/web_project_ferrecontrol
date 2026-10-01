import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { products } from "../services/products";

const HOME_CATEGORIES = [
  {
    name: "Herramientas",
    image: "/images/products/mar-001.webp",
  },
  {
    name: "Materiales de construcción",
    image: "/images/products/mat-001.webp",
  },
  {
    name: "Electricidad",
    image: "/images/products/ele-001.webp",
  },
  {
    name: "Plomería",
    image: "/images/products/plo-001.webp",
  },
  {
    name: "Tornillería",
    image: "/images/products/tor-001.webp",
  },
  {
    name: "Pinturas",
    image: "/images/products/pin-001.webp",
  },
  {
    name: "Accesorios",
    image: "/images/products/acc-001.webp",
  },
  {
    name: "Seguridad",
    image: "/images/products/seg-001.webp",
  },
];

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isFeaturedLoading, setIsFeaturedLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState("");
  const FEATURED_PRODUCT_SKUS = ["MAR-001", "ELE-001", "SEG-001", "PIN-001"];

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

          <h1 className="home__title">Todo para construir, reparar y crear</h1>

          <p className="home__description">
            Encuentra herramientas, materiales y accesorios para llevar tus
            proyectos de principio a fin.
          </p>

          <Link className="home__link" to="/catalogo">
            Explorar catálogo
          </Link>
        </div>

        {/* <div className="home__visual" aria-hidden="true">
          <div className="home__visual-accent">
          </div>

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
        </div> */}
        <div className="home__visual" aria-hidden="true">
          <img
            className="home__hero-image"
            src="/images/home/hero-ferrecontrol.png"
            alt=""
          />

          {/* <div className="home__hero-accent">
            <span className="home__hero-accent-line"></span>

            <span className="home__hero-accent-text">
              Herramientas · Materiales · Soluciones
            </span>
          </div>*/}
        </div>
      </section>

      <section
        className="home-categories"
        aria-labelledby="home-categories-title"
      >
        <div className="home-categories__header">
          <div>
            <p className="home-categories__eyebrow">Explora nuestro catálogo</p>

            <h2 className="home-categories__title" id="home-categories-title">
              Encuentra lo que necesitas
            </h2>
          </div>

          <Link className="home-categories__catalog-link" to="/catalogo">
            Ver todas las categorías →
          </Link>
        </div>

        <div className="home-categories__grid">
          {HOME_CATEGORIES.map((category) => (
            <Link
              className="home-categories__item"
              key={category.name}
              to={`/catalogo?categoria=${encodeURIComponent(category.name)}`}
            >
              <div className="home-categories__image-wrapper">
                <img
                  className="home-categories__image"
                  src={category.image}
                  alt=""
                />
              </div>

              <span className="home-categories__name">{category.name}</span>

              <span className="home-categories__arrow" aria-hidden="true">
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
    </div>
  );
};

export default Home;
