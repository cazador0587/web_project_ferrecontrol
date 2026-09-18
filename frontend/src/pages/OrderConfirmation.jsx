import { Link } from "react-router-dom";

const OrderConfirmation = () => {
  return (
    <section>
      <h1>¡Pedido realizado correctamente!</h1>

      <p>Tu pedido fue registrado y se encuentra pendiente de confirmación.</p>

      <Link to="/catalogo">Seguir comprando</Link>
    </section>
  );
};

export default OrderConfirmation;
