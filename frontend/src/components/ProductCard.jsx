import { useState } from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product, variant = "default" }) => {
  const [imageError, setImageError] = useState(false);
  const isFeatured = variant === "featured";

  const hasImage = Boolean(product.image) && !imageError;

  return (
    <article
      className={`product-card${isFeatured ? " product-card--featured" : ""}`}
    >
      <div className="product-card__media">
        {hasImage ? (
          <img
            className="product-card__image"
            src={product.image}
            alt={product.name}
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="product-card__image-placeholder" aria-hidden="true">
            Sin imagen
          </div>
        )}
      </div>

      <div className="product-card__content">
        <div className="product-card__info">
          <h2 className="product-card__title">{product.name}</h2>

          {!isFeatured && (
            <p className="product-card__sku">SKU: {product.sku}</p>
          )}
        </div>

        <div className="product-card__purchase">
          <p className="product-card__price">
            ${Number(product.price).toFixed(2)}
          </p>

          <p
            className={`product-card__stock ${
              product.stock === 0
                ? "product-card__stock--out"
                : product.stock <= product.minStock
                  ? "product-card__stock--low"
                  : ""
            }`}
          >
            {product.stock === 0
              ? "Agotado"
              : product.stock <= product.minStock
                ? "Pocas unidades"
                : "En existencia"}
          </p>
        </div>
      </div>

      <Link className="product-card__link" to={`/productos/${product._id}`}>
        Ver producto
      </Link>
    </article>
  );
};

export default ProductCard;
