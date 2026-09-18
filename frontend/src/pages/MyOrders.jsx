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

  if (isLoading) {
    return <p>Cargando pedidos...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (orderList.length === 0) {
    return <p>Todavía no tienes pedidos.</p>;
  }

  return (
    <section>
      <h1>Mis pedidos</h1>

      {orderList.map((order) => (
        <article key={order._id}>
          <h2>Pedido #{order._id}</h2>

          <p>Estado: {order.status}</p>
          <p>Subtotal: ${order.subtotal}</p>
          <p>Envío: ${order.shipping}</p>
          <p>Total: ${order.total}</p>

          <h3>Productos</h3>

          {order.items.map((item) => (
            <div key={`${order._id}-${item.product}`}>
              <p>{item.name}</p>
              <p>SKU: {item.sku}</p>
              <p>Precio: ${item.price}</p>
              <p>Cantidad: {item.quantity}</p>
              <p>Subtotal: ${item.subtotal}</p>
            </div>
          ))}
        </article>
      ))}
    </section>
  );
};

export default MyOrders;
