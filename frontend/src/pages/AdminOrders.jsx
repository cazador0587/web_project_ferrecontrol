import { useEffect, useState } from "react";
import { orders } from "../services/orders";

const AdminOrders = () => {
  const [orderList, setOrderList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [updatingOrderIds, setUpdatingOrderIds] = useState(new Set());

  const handleStatusChange = async (id, status) => {
    try {
      setActionError("");

      setUpdatingOrderIds((currentIds) => {
        const nextIds = new Set(currentIds);
        nextIds.add(id);
        return nextIds;
      });

      const data = await orders.updateStatus(id, status);

      setOrderList((currentOrders) =>
        currentOrders.map((order) => (order._id === id ? data.order : order)),
      );
    } catch (err) {
      setActionError(err.message);
    } finally {
      setUpdatingOrderIds((currentIds) => {
        const nextIds = new Set(currentIds);
        nextIds.delete(id);
        return nextIds;
      });
    }
  };

  useEffect(() => {
    orders
      .getAll()
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
    <section className="admin-orders">
      <div className="admin-orders__header">
        <h1 className="admin-orders__title">Administrar pedidos</h1>

        <p className="admin-orders__description">
          Consulta los pedidos registrados y actualiza su estado.
        </p>
      </div>

      {isLoading && (
        <p className="admin-orders__message">Cargando pedidos...</p>
      )}

      {!isLoading && error && (
        <p
          className="admin-orders__message admin-orders__message--error"
          role="alert"
        >
          Error: {error}
        </p>
      )}

      {!isLoading && !error && (
        <>
          <div className="admin-orders__summary">
            <p className="admin-orders__summary-label">Pedidos registrados</p>

            <p className="admin-orders__summary-value">{orderList.length}</p>
          </div>

          {actionError && (
            <p
              className="admin-orders__message admin-orders__message--error"
              role="alert"
            >
              {actionError}
            </p>
          )}

          {orderList.length === 0 ? (
            <p className="admin-orders__message">No hay pedidos registrados.</p>
          ) : (
            <div className="admin-orders__list">
              {orderList.map((order) => {
                const isUpdating = updatingOrderIds.has(order._id);

                return (
                  <article className="admin-orders__card" key={order._id}>
                    <div className="admin-orders__card-header">
                      <div>
                        <h2 className="admin-orders__order-number">
                          Pedido #{order._id}
                        </h2>

                        <p className="admin-orders__status-label">
                          Estado actual
                        </p>
                      </div>

                      <span
                        className={`admin-orders__status admin-orders__status--${order.status}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <dl className="admin-orders__details">
                      <div className="admin-orders__detail">
                        <dt>Subtotal</dt>
                        <dd>${order.subtotal}</dd>
                      </div>

                      <div className="admin-orders__detail">
                        <dt>Envío</dt>
                        <dd>${order.shipping}</dd>
                      </div>

                      <div className="admin-orders__detail admin-orders__detail--total">
                        <dt>Total</dt>
                        <dd>${order.total}</dd>
                      </div>
                    </dl>

                    <div className="admin-orders__actions">
                      {order.status === "pending" && (
                        <button
                          className="admin-orders__action-button"
                          type="button"
                          onClick={() =>
                            handleStatusChange(order._id, "confirmed")
                          }
                          disabled={isUpdating}
                        >
                          {isUpdating ? "Actualizando..." : "Confirmar pedido"}
                        </button>
                      )}

                      {order.status === "confirmed" && (
                        <button
                          className="admin-orders__action-button"
                          type="button"
                          onClick={() =>
                            handleStatusChange(order._id, "preparing")
                          }
                          disabled={isUpdating}
                        >
                          {isUpdating ? "Actualizando..." : "Preparar pedido"}
                        </button>
                      )}

                      {order.status === "preparing" && (
                        <button
                          className="admin-orders__action-button"
                          type="button"
                          onClick={() =>
                            handleStatusChange(order._id, "shipped")
                          }
                          disabled={isUpdating}
                        >
                          {isUpdating ? "Actualizando..." : "Enviar pedido"}
                        </button>
                      )}

                      {order.status === "shipped" && (
                        <button
                          className="admin-orders__action-button"
                          type="button"
                          onClick={() =>
                            handleStatusChange(order._id, "delivered")
                          }
                          disabled={isUpdating}
                        >
                          {isUpdating
                            ? "Actualizando..."
                            : "Marcar como entregado"}
                        </button>
                      )}

                      {["pending", "confirmed", "preparing"].includes(
                        order.status,
                      ) && (
                        <button
                          className="admin-orders__cancel-button"
                          type="button"
                          onClick={() =>
                            handleStatusChange(order._id, "cancelled")
                          }
                          disabled={isUpdating}
                        >
                          {isUpdating ? "Actualizando..." : "Cancelar pedido"}
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default AdminOrders;
