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
  
if (isLoading) {
  return <p>Cargando resumen administrativo...</p>;
}

if (error) {
  return <p>Error al cargar el resumen: {error}</p>;
}

  return (
    <section>
      <h1>Panel administrativo</h1>

      <p className="home__description">
        Administra los productos, inventario, pedidos y usuarios de
        FerreControl.
      </p>

      <section>
        <h2>Resumen</h2>

        <p>Productos registrados: {productCount}</p>
        <p>Productos con stock bajo: {lowStockCount}</p>
        <p>Pedidos pendientes: {pendingOrderCount}</p>
        <p>Usuarios registrados: {userCount}</p>
      </section>
    </section>
  );
};

export default AdminDashboard;
