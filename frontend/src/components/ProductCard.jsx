import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <article className="product-card">
      <h2 className="product-card__title">{product.name}</h2>

      <p className="product-card__description">{product.description}</p>

      <p className="product-card__sku">SKU: {product.sku}</p>

      <p className="product-card__price">Precio: ${product.price}</p>

      <p
        className={`product-card__stock ${
          product.stock === 0
            ? "product-card__stock--out"
            : product.stock <= 5
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
