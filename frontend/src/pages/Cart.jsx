import { useEffect, useState } from "react";
import { cart } from "../services/cart";
import { orders } from "../services/orders";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartData, setCartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [updatingItemIds, setUpdatingItemIds] = useState(new Set());
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
    const itemId = item.product._id;

    try {
      setActionError("");

      setUpdatingItemIds((currentIds) => {
        const nextIds = new Set(currentIds);
        nextIds.add(itemId);
        return nextIds;
      });

      const newQuantity = item.quantity + 1;
      const data = await cart.updateItem(itemId, newQuantity);

      setCartData(data.cart);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setUpdatingItemIds((currentIds) => {
        const nextIds = new Set(currentIds);
        nextIds.delete(itemId);
        return nextIds;
      });
    }
  };

  const handleDecreaseQuantity = async (item) => {
    if (item.quantity <= 1) {
      return;
    }

    const itemId = item.product._id;

    try {
      setActionError("");

      setUpdatingItemIds((currentIds) => {
        const nextIds = new Set(currentIds);
        nextIds.add(itemId);
        return nextIds;
      });

      const newQuantity = item.quantity - 1;
      const data = await cart.updateItem(itemId, newQuantity);

      setCartData(data.cart);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setUpdatingItemIds((currentIds) => {
        const nextIds = new Set(currentIds);
        nextIds.delete(itemId);
        return nextIds;
      });
    }
  };

  const handleRemoveItem = async (item) => {
    const itemId = item.product._id;

    try {
      setActionError("");

      setUpdatingItemIds((currentIds) => {
        const nextIds = new Set(currentIds);
        nextIds.add(itemId);
        return nextIds;
      });

      const data = await cart.removeItem(itemId);

      setCartData(data.cart);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setUpdatingItemIds((currentIds) => {
        const nextIds = new Set(currentIds);
        nextIds.delete(itemId);
        return nextIds;
      });
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
      setActionError("");
      setIsCreatingOrder(true);

      await orders.create();

      navigate("/pedido-confirmado");
      
    } catch (err) {
      setActionError(err.message);
    } finally {
      setIsCreatingOrder(false);
    }
  };

  return (
    <section className="cart">
      <h1 className="cart__title">Mi carrito</h1>

      {actionError && (
        <p className="cart__error" role="alert">
          {actionError}
        </p>
      )}

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
              disabled={
                item.quantity <= 1 || updatingItemIds.has(item.product._id)
              }
            >
              -
            </button>

            <button
              className="cart__quantity-button"
              type="button"
              onClick={() => handleIncreaseQuantity(item)}
              disabled={
                item.quantity >= item.product.stock ||
                updatingItemIds.has(item.product._id)
              }
            >
              +
            </button>
          </div>

          <button
            className="cart__remove-button"
            type="button"
            onClick={() => handleRemoveItem(item)}
            disabled={updatingItemIds.has(item.product._id)}
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
