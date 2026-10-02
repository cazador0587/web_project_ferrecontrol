import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { products } from "../services/products";
import { cart } from "../services/cart";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [cartMessage, setCartMessage] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    products
      .getById(id)
      .then((data) => {
        setProduct(data.product);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return <p>Cargando producto...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!product) {
    return <p>Producto no encontrado.</p>;
  }

  const handleAddToCart = async () => {
    setCartMessage("");
    setIsAdding(true);

    try {
      await cart.addItem(product._id, 1);
      navigate("/carrito");
    } catch (err) {
      setCartMessage(err.message);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="product-detail-page">
      <Link className="product-detail-page__back" to="/catalogo">
        ← Volver al catálogo
      </Link>
      <section className="product-detail">
        <div className="product-detail__media">
          {product.image && !imageError ? (
            <img
              className="product-detail__image"
              src={product.image}
              alt={product.name}
              onError={() => setImageError(true)}
            />
          ) : (
            <div
              className="product-detail__image-placeholder"
              aria-hidden="true"
            >
              Sin imagen
            </div>
          )}
        </div>

        <div className="product-detail__content">
          <div className="product-detail__info">
            <h1 className="product-detail__title">{product.name}</h1>
            <p className="product-detail__sku">SKU: {product.sku}</p>

            <div className="product-detail__meta">
              {product.brand && product.brand !== "Genérica" && (
                <p className="product-detail__brand">
                  Marca: <span>{product.brand}</span>
                </p>
              )}
            </div>

            <p className="product-detail__description">{product.description}</p>
          </div>

          {product.specifications?.length > 0 && (
            <div className="product-detail__specifications">
              <h2 className="product-detail__specifications-title">
                Especificaciones
              </h2>

              <dl className="product-detail__specifications-list">
                {product.model && (
                  <div className="product-detail__specification">
                    <dt>Modelo</dt>
                    <dd>{product.model}</dd>
                  </div>
                )}
                {product.specifications.map((specification) => (
                  <div
                    className="product-detail__specification"
                    key={specification._id}
                  >
                    <dt>{specification.label}</dt>
                    <dd>{specification.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="product-detail__purchase">
            <p className="product-detail__price">
              ${Number(product.price).toFixed(2)}
            </p>
            <p
              className={`product-detail__stock ${
                product.stock === 0
                  ? "product-detail__stock--out"
                  : product.stock <= product.minStock
                    ? "product-detail__stock--low"
                    : ""
              }`}
            >
              {product.stock === 0
                ? "Agotado"
                : product.stock <= product.minStock
                  ? `Pocas unidades · ${product.stock} disponibles`
                  : `En existencia · ${product.stock} disponibles`}
            </p>

            <button
              className="product-detail__button"
              type="button"
              onClick={handleAddToCart}
              disabled={isAdding || product.stock === 0}
            >
              {isAdding ? "Agregando..." : "Agregar al carrito"}
            </button>
          </div>

          {cartMessage && (
            <p className="product-detail__message">{cartMessage}</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
