import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
      // setCartMessage("Producto agregado al carrito.");
    } catch (err) {
      setCartMessage(err.message);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <section>
      <h1>{product.name}</h1>

      <p>{product.description}</p>

      <p>SKU: {product.sku}</p>

      <p>Precio: ${product.price}</p>

      <p>Stock disponible: {product.stock}</p>

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isAdding || product.stock === 0}
      >
        {isAdding ? "Agregando..." : "Agregar al carrito"}
      </button>

      {cartMessage && <p>{cartMessage}</p>}
    </section>
  );
};

export default ProductDetail;
