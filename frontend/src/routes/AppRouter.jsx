import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import PublicLayout from "../layouts/PublicLayout";
import ClientLayout from "../layouts/ClientLayout";
import AdminLayout from "../layouts/AdminLayout";
import Home from "../pages/Home";
import Products from "../pages/Products";
import ProductDetail from "../pages/ProductDetail";
import Register from "../pages/Register";
import Cart from "../pages/Cart";
import OrderConfirmation from "../pages/OrderConfirmation";
import MyOrders from "../pages/MyOrders";
import AdminDashboard from "../pages/AdminDashboard";
import AdminProducts from "../pages/AdminProducts";
import AdminProductCreate from "../pages/AdminProductCreate";
import AdminProductEdit from "../pages/AdminProductEdit";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />

        <Route
          path="/catalogo"
          element={
            <PublicLayout>
              <Products />
            </PublicLayout>
          }
        />

        <Route
          path="/productos/:id"
          element={
            <PublicLayout>
              <ProductDetail />
            </PublicLayout>
          }
        />

        <Route path="/login" element={<Login />} />

        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <ClientLayout>
                <h1>Perfil de usuario</h1>
              </ClientLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/carrito"
          element={
            <ProtectedRoute>
              <ClientLayout>
                <Cart />
              </ClientLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/pedido-confirmado"
          element={
            <ProtectedRoute>
              <ClientLayout>
                <OrderConfirmation />
              </ClientLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/mis-pedidos"
          element={
            <ProtectedRoute>
              <ClientLayout>
                <MyOrders />
              </ClientLayout>
            </ProtectedRoute>
          }
        />

        <Route path="/registro" element={<Register />} />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/productos"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminProducts />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/productos/nuevo"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminProductCreate />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/productos/:id/editar"
          element={
            <AdminRoute>
              <AdminLayout>
                <AdminProductEdit />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="*"
          element={
            <PublicLayout>
              <h1>Página no encontrada</h1>
            </PublicLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;