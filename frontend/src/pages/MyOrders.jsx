import { useEffect, useState } from "react";
import { orders } from "../services/orders";

const MyOrders = () => {
  const [orderList, setOrderList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    orders
      .getMyOrders()
      .then((data) => {
        setOrderList(data.orders);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

    return (
      <section className="orders">
        <div className="orders__header">
          <h1 className="orders__title">Mis pedidos</h1>
          <p className="orders__description">
            Consulta el estado y el detalle de tus compras.
          </p>
        </div>

        {isLoading && <p className="orders__message">Cargando pedidos...</p>}

        {!isLoading && error && (
          <p className="orders__message orders__message--error" role="alert">
            Error: {error}
          </p>
        )}

        {!isLoading && !error && orderList.length === 0 && (
          <p className="orders__message">Todavía no tienes pedidos.</p>
        )}

        {!isLoading && !error && orderList.length > 0 && (
          <div className="orders__list">
            {orderList.map((order) => (
              <article className="orders__card" key={order._id}>
                <div className="orders__card-header">
                  <h2 className="orders__order-number">Pedido #{order._id}</h2>

                  <span className="orders__status">{order.status}</span>
                </div>

                <dl className="orders__summary">
                  <div className="orders__summary-item">
                    <dt>Subtotal</dt>
                    <dd>${order.subtotal}</dd>
                  </div>

                  <div className="orders__summary-item">
                    <dt>Envío</dt>
                    <dd>${order.shipping}</dd>
                  </div>

                  <div className="orders__summary-item orders__summary-item--total">
                    <dt>Total</dt>
                    <dd>${order.total}</dd>
                  </div>
                </dl>

                <div className="orders__products">
                  <h3 className="orders__products-title">Productos</h3>

                  <div className="orders__product-list">
                    {order.items.map((item) => (
                      <div
                        className="orders__product"
                        key={`${order._id}-${item.sku}`}
                      >
                        <div className="orders__product-main">
                          <p className="orders__product-name">{item.name}</p>
                          <p className="orders__product-sku">SKU: {item.sku}</p>
                        </div>

                        <dl className="orders__product-details">
                          <div>
                            <dt>Precio</dt>
                            <dd>${item.price}</dd>
                          </div>

                          <div>
                            <dt>Cantidad</dt>
                            <dd>{item.quantity}</dd>
                          </div>

                          <div>
                            <dt>Subtotal</dt>
                            <dd>${item.subtotal}</dd>
                          </div>
                        </dl>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    );
};

export default MyOrders;
