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
import AdminOrders from "../pages/AdminOrders";
import AdminCategories from "../pages/AdminCategories";
import AdminUsers from "../pages/AdminUsers";
import Profile from "../pages/Profile";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="/catalogo" element={<Products />} />
          <Route path="/productos/:id" element={<ProductDetail />} />
          <Route path="*" element={<h1>Página no encontrada</h1>} />
        </Route>

        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<ClientLayout />}>
            <Route path="/perfil" element={<Profile />} />
            <Route path="/carrito" element={<Cart />} />
            <Route path="/pedido-confirmado" element={<OrderConfirmation />} />
            <Route path="/mis-pedidos" element={<MyOrders />} />
          </Route>
        </Route>

        <Route path="/registro" element={<Register />} />

        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/productos" element={<AdminProducts />} />
            <Route
              path="/admin/productos/nuevo"
              element={<AdminProductCreate />}
            />
            <Route
              path="/admin/productos/:id/editar"
              element={<AdminProductEdit />}
            />
            <Route path="/admin/pedidos" element={<AdminOrders />} />
            <Route path="/admin/categorias" element={<AdminCategories />} />
            <Route path="/admin/usuarios" element={<AdminUsers />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;