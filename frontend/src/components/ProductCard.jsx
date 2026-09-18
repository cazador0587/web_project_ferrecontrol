import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <article>
      <h2>{product.name}</h2>

      <p>{product.description}</p>

      <p>SKU: {product.sku}</p>

      <p>Precio: ${product.price}</p>

      <p>Stock: {product.stock}</p>

      <Link to={`/productos/${product._id}`}>Ver producto</Link>
    </article>
  );
};

export default ProductCard;
