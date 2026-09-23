import { useEffect, useState } from "react";
import { cart } from "../services/cart";
import { orders } from "../services/orders";
import { Link, useNavigate } from "react-router-dom";

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
    return (
      <section className="cart">
        <h1 className="cart__title">Mi carrito</h1>

        <div className="cart__empty">
          <p className="cart__empty-text">Tu carrito está vacío.</p>

          <Link className="cart__empty-link" to="/catalogo">
            Explorar catálogo
          </Link>
        </div>
      </section>
    );
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
    <section className="cart">
      <h1 className="cart__title">Mi carrito</h1>

      {cartData.items.map((item) => (
        <article className="cart__item" key={item.product._id}>
          <h2 className="cart__item-title">{item.product.name}</h2>

          <p className="cart__item-sku">SKU: {item.product.sku}</p>
          <p className="cart__item-price">${item.product.price}</p>
          <p className="cart__item-quantity">Cantidad: {item.quantity}</p>

          <div className="cart__quantity-controls">
            <button
              className="cart__quantity-button"
              type="button"
              onClick={() => handleDecreaseQuantity(item)}
              disabled={item.quantity <= 1}
            >
              -
            </button>

            <button
              className="cart__quantity-button"
              type="button"
              onClick={() => handleIncreaseQuantity(item)}
              disabled={item.quantity >= item.product.stock}
            >
              +
            </button>
          </div>

          <button
            className="cart__remove-button"
            type="button"
            onClick={() => handleRemoveItem(item)}
          >
            Eliminar
          </button>

          <p className="cart__item-subtotal">
            Subtotal: ${item.product.price * item.quantity}
          </p>
        </article>
      ))}

      <h2 className="cart__total">Total: ${total}</h2>

      <button
        className="cart__checkout-button"
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
