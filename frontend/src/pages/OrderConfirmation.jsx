import { Link } from "react-router-dom";

const OrderConfirmation = () => {
  return (
    <section className="order-confirmation">
      <div className="order-confirmation__card">
        <div className="order-confirmation__icon" aria-hidden="true">
          ✓
        </div>

        <h1 className="order-confirmation__title">
          ¡Pedido realizado correctamente!
        </h1>

        <p className="order-confirmation__description">
          Tu pedido fue registrado y se encuentra pendiente de confirmación.
        </p>

        <Link className="order-confirmation__link" to="/catalogo">
          Seguir comprando
        </Link>
      </div>
    </section>
  );
};

export default OrderConfirmation;
