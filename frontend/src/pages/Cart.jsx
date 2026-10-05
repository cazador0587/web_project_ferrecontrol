import { useEffect, useState } from "react";
import { cart } from "../services/cart";
import { orders } from "../services/orders";
import { Link, useNavigate } from "react-router-dom";

const formatPrice = (price) =>
  Number(price).toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
  });

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
    return (
      <section className="cart">
        <div className="cart__status" role="status">
          <p className="cart__status-text">Cargando carrito...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="cart">
        <div className="cart__status cart__status--error" role="alert">
          <h1 className="cart__status-title">No pudimos cargar tu carrito</h1>

          <p className="cart__status-text">{error}</p>
        </div>
      </section>
    );
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

  const totalItems = cartData.items.reduce(
    (sum, item) => sum + item.quantity,
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
      <header className="cart__header">
        <div className="cart__heading">
          <p className="cart__eyebrow">Tu compra</p>
          <h1 className="cart__title">Mi carrito</h1>
          <p className="cart__description">
            {totalItems} {totalItems === 1 ? "producto" : "productos"} en tu
            carrito
          </p>
        </div>

        <Link className="cart__continue-link" to="/catalogo">
          ← Seguir comprando
        </Link>
      </header>
      {actionError && (
        <p className="cart__error" role="alert">
          {actionError}
        </p>
      )}
      <div className="cart__layout">
        <div className="cart__items">
          {cartData.items.map((item) => {
            const isUpdating = updatingItemIds.has(item.product._id);

            return (
              <article className="cart__item" key={item.product._id}>
                <div className="cart__item-media">
                  {item.product.image ? (
                    <img
                      className="cart__item-image"
                      src={item.product.image}
                      alt={item.product.name}
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="cart__item-image-placeholder"
                      aria-hidden="true"
                    >
                      Sin imagen
                    </div>
                  )}
                </div>

                <div className="cart__item-content">
                  <div className="cart__item-header">
                    <div className="cart__item-info">
                      <h2 className="cart__item-title">{item.product.name}</h2>

                      <p className="cart__item-sku">SKU: {item.product.sku}</p>
                    </div>

                    <p className="cart__item-price">
                      {formatPrice(item.product.price)}
                    </p>
                  </div>

                  <div className="cart__item-actions">
                    <div className="cart__quantity">
                      <span className="cart__quantity-label">Cantidad</span>

                      <div className="cart__quantity-controls">
                        <button
                          className={`cart__quantity-button ${
                            item.quantity === 1
                              ? "cart__quantity-button--remove"
                              : ""
                          }`}
                          type="button"
                          onClick={() =>
                            item.quantity === 1
                              ? handleRemoveItem(item)
                              : handleDecreaseQuantity(item)
                          }
                          disabled={isUpdating}
                          aria-label={
                            item.quantity === 1
                              ? `Eliminar ${item.product.name} del carrito`
                              : `Disminuir cantidad de ${item.product.name}`
                          }
                        >
                          {item.quantity === 1 ? (
                            <span
                              className="cart__quantity-trash"
                              aria-hidden="true"
                            >
                              🗑
                            </span>
                          ) : (
                            "−"
                          )}
                        </button>

                        <span
                          className="cart__quantity-value"
                          aria-live="polite"
                        >
                          {item.quantity}
                        </span>

                        <button
                          className="cart__quantity-button"
                          type="button"
                          onClick={() => handleIncreaseQuantity(item)}
                          disabled={
                            item.quantity >= item.product.stock || isUpdating
                          }
                          aria-label={`Aumentar cantidad de ${item.product.name}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="cart__item-footer">
                    <span className="cart__item-subtotal-label">Subtotal</span>

                    <strong className="cart__item-subtotal">
                      {formatPrice(item.product.price * item.quantity)}
                    </strong>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <aside className="cart__summary">
          <h2 className="cart__summary-title">Resumen del pedido</h2>

          <div className="cart__summary-row">
            <span>
              Subtotal ({totalItems}{" "}
              {totalItems === 1 ? "producto" : "productos"})
            </span>

            <span>{formatPrice(total)}</span>
          </div>

          <div className="cart__summary-total">
            <span>Total</span>
            <strong>{formatPrice(total)}</strong>
          </div>

          <button
            className="cart__checkout-button"
            type="button"
            onClick={handleCreateOrder}
            disabled={isCreatingOrder}
          >
            {isCreatingOrder ? "Procesando pedido..." : "Realizar pedido"}
          </button>
        </aside>
      </div>
    </section>
  );
};

export default Cart;
