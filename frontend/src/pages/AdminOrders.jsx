import { useEffect, useState } from "react";
import { orders } from "../services/orders";

const AdminOrders = () => {
  const [orderList, setOrderList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const handleStatusChange = async (id, status) => {
    try {
      setError("");
      setUpdatingOrderId(id);

      const data = await orders.updateStatus(id, status);

      setOrderList((currentOrders) =>
        currentOrders.map((order) => (order._id === id ? data.order : order)),
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingOrderId(null);
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

  if (isLoading) {
    return <p>Cargando pedidos...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <section>
      <h1>Administrar pedidos</h1>
      <p>Pedidos registrados: {orderList.length}</p>

      {orderList.map((order) => (
        <article key={order._id}>
          <h2>Pedido {order._id}</h2>

          <p>Estado: {order.status}</p>
          <p>Subtotal: ${order.subtotal}</p>
          <p>Envío: ${order.shipping}</p>
          <p>Total: ${order.total}</p>

          {order.status === "pending" && (
            <button
              type="button"
              onClick={() => handleStatusChange(order._id, "confirmed")}
              disabled={updatingOrderId === order._id}
            >
              {updatingOrderId === order._id
                ? "Actualizando..."
                : "Confirmar pedido"}
            </button>
          )}

          {order.status === "confirmed" && (
            <button
              type="button"
              onClick={() => handleStatusChange(order._id, "preparing")}
              disabled={updatingOrderId === order._id}
            >
              {updatingOrderId === order._id
                ? "Actualizando..."
                : "Preparar pedido"}
            </button>
          )}

          {order.status === "preparing" && (
            <button
              type="button"
              onClick={() => handleStatusChange(order._id, "shipped")}
              disabled={updatingOrderId === order._id}
            >
              {updatingOrderId === order._id
                ? "Actualizando..."
                : "Enviar pedido"}
            </button>
          )}

          {order.status === "shipped" && (
            <button
              type="button"
              onClick={() => handleStatusChange(order._id, "delivered")}
              disabled={updatingOrderId === order._id}
            >
              {updatingOrderId === order._id
                ? "Actualizando..."
                : "Marcar como entregado"}
            </button>
          )}

          {["pending", "confirmed", "preparing"].includes(order.status) && (
            <button
              type="button"
              onClick={() => handleStatusChange(order._id, "cancelled")}
              disabled={updatingOrderId === order._id}
            >
              {updatingOrderId === order._id
                ? "Actualizando..."
                : "Cancelar pedido"}
            </button>
          )}
        </article>
      ))}
    </section>
  );
};

export default AdminOrders;
