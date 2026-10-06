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

        <div className="order-confirmation__actions">
          <Link className="order-confirmation__link" to="/mis-pedidos">
            Ver mis pedidos
          </Link>

          <Link
            className="order-confirmation__link order-confirmation__link--secondary"
            to="/catalogo"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OrderConfirmation;
