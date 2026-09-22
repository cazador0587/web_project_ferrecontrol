import { useEffect, useState } from "react";
import { products } from "../services/products";
import { orders } from "../services/orders";
import { auth } from "../services/auth";

const AdminDashboard = () => {
  const [productCount, setProductCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [pendingOrderCount, setPendingOrderCount] = useState(0);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await products.getAll();
        setProductCount(data.products.length);

        const lowStockProducts = data.products.filter(
          (product) => product.stock <= product.minStock,
        );

        setLowStockCount(lowStockProducts.length);

      } catch (error) {
        console.error("Error al cargar los productos:", error);
      }
    };

    const loadOrders = async () => {
      try {
        const data = await orders.getAll();

        const pendingOrders = data.orders.filter(
          (order) => order.status === "pending",
        );

        setPendingOrderCount(pendingOrders.length);
      } catch (error) {
        console.error("Error al cargar los pedidos:", error);
      }
    };

    const loadUsers = async () => {
      try {
        const data = await auth.getUserCount();
        setUserCount(data.count);
      } catch (error) {
        console.error("Error al cargar la cantidad de usuarios:", error);
      }
    };

    loadProducts();
    loadOrders();
    loadUsers();
  }, []);

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
