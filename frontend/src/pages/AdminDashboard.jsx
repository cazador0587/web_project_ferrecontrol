import { useEffect, useState } from "react";
import { products } from "../services/products";
import { orders } from "../services/orders";
import { auth } from "../services/auth";

const AdminDashboard = () => {
  const [productCount, setProductCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [pendingOrderCount, setPendingOrderCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      const data = await products.getAll();
      setProductCount(data.products.length);

      const lowStockProducts = data.products.filter(
        (product) => product.stock <= product.minStock,
      );

      setLowStockCount(lowStockProducts.length);
    };

    const loadOrders = async () => {
      const data = await orders.getAll();

      const pendingOrders = data.orders.filter(
        (order) => order.status === "pending",
      );

      setPendingOrderCount(pendingOrders.length);
    };

    const loadUsers = async () => {
      const data = await auth.getUserCount();
      setUserCount(data.count);
    };

    const loadDashboard = async () => {
      setIsLoading(true);
      setError("");

      try {
        await Promise.all([loadProducts(), loadOrders(), loadUsers()]);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);
  
  return (
    <section className="admin-dashboard">
      <div className="admin-dashboard__header">
        <h1 className="admin-dashboard__title">Panel administrativo</h1>

        <p className="admin-dashboard__description">
          Administra los productos, inventario, pedidos y usuarios de
          FerreControl.
        </p>
      </div>

      {isLoading && (
        <p className="admin-dashboard__message">
          Cargando resumen administrativo...
        </p>
      )}

      {!isLoading && error && (
        <p
          className="admin-dashboard__message admin-dashboard__message--error"
          role="alert"
        >
          Error al cargar el resumen: {error}
        </p>
      )}

      {!isLoading && !error && (
        <div className="admin-dashboard__content">
          <h2 className="admin-dashboard__subtitle">Resumen</h2>

          <div className="admin-dashboard__stats">
            <article className="admin-dashboard__stat">
              <p className="admin-dashboard__stat-label">
                Productos registrados
              </p>
              <p className="admin-dashboard__stat-value">{productCount}</p>
            </article>

            <article className="admin-dashboard__stat">
              <p className="admin-dashboard__stat-label">
                Productos con stock bajo
              </p>
              <p className="admin-dashboard__stat-value">{lowStockCount}</p>
            </article>

            <article className="admin-dashboard__stat">
              <p className="admin-dashboard__stat-label">Pedidos pendientes</p>
              <p className="admin-dashboard__stat-value">{pendingOrderCount}</p>
            </article>

            <article className="admin-dashboard__stat">
              <p className="admin-dashboard__stat-label">
                Usuarios registrados
              </p>
              <p className="admin-dashboard__stat-value">{userCount}</p>
            </article>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminDashboard;
