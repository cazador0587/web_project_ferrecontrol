import { useEffect, useState } from "react";
import { cart } from "../services/cart";
import { orders } from "../services/orders";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartData, setCartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    cart
      .get()
      .then((data) => {
        setCartData(data.cart);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleIncreaseQuantity = async (item) => {
    try {
      const newQuantity = item.quantity + 1;

      const data = await cart.updateItem(item.product._id, newQuantity);

      setCartData(data.cart);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDecreaseQuantity = async (item) => {
    if (item.quantity <= 1) {
      return;
    }

    try {
      const newQuantity = item.quantity - 1;

      const data = await cart.updateItem(item.product._id, newQuantity);

      setCartData(data.cart);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveItem = async (item) => {
    try {
      const data = await cart.removeItem(item.product._id);

      setCartData(data.cart);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return <p>Cargando carrito...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!cartData || cartData.items.length === 0) {
    return <p>Tu carrito está vacío.</p>;
  }

  const total = cartData.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const handleCreateOrder = async () => {
    try {
      setIsCreatingOrder(true);
      setError("");

      await orders.create();

      navigate("/pedido-confirmado");
      /* const data = await orders.create();

      console.log("Pedido creado:", data.order);

      setCartData({
        ...cartData,
        items: [],
      });*/
    } catch (err) {
      setError(err.message);
    } finally {
      setIsCreatingOrder(false);
    }
  };

  return (
    <section>
      <h1>Mi carrito</h1>

      {cartData.items.map((item) => (
        <article key={item.product._id}>
          <h2>{item.product.name}</h2>

          <p>SKU: {item.product.sku}</p>
          <p>Precio: ${item.product.price}</p>
          <p>Cantidad: {item.quantity}</p>

          <button
            type="button"
            onClick={() => handleDecreaseQuantity(item)}
            disabled={item.quantity <= 1}
          >
            -
          </button>

          <button
            type="button"
            onClick={() => handleIncreaseQuantity(item)}
            disabled={item.quantity >= item.product.stock}
          >
            +
          </button>

          <button type="button" onClick={() => handleRemoveItem(item)}>
            Eliminar
          </button>

          <p>Subtotal: ${item.product.price * item.quantity}</p>
        </article>
      ))}

      <h2>Total: ${total}</h2>

      <button
        type="button"
        onClick={handleCreateOrder}
        disabled={isCreatingOrder}
      >
        {isCreatingOrder ? "Procesando pedido..." : "Realizar pedido"}
      </button>
    </section>
  );
};

export default Cart;
