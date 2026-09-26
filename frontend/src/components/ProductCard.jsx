import { useState } from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const [imageError, setImageError] = useState(false);

  const hasImage = Boolean(product.image) && !imageError;

  return (
    <article className="product-card">
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

      <h2 className="product-card__title">{product.name}</h2>

      <p className="product-card__description">{product.description}</p>

      <p className="product-card__sku">SKU: {product.sku}</p>

      <p className="product-card__price">
        Precio: ${Number(product.price).toFixed(2)}
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
        Stock: {product.stock}
      </p>

      <Link className="product-card__link" to={`/productos/${product._id}`}>
        Ver producto
      </Link>
    </article>
  );
};

export default ProductCard;
