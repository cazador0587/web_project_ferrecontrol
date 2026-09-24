import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { products } from "../services/products";

const AdminProducts = () => {
  const [productList, setProductList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [deletingIds, setDeletingIds] = useState(new Set());

  useEffect(() => {
    products
      .getAll()
      .then((data) => {
        setProductList(data.products);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <p>Cargando productos...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const handleDelete = async (id) => {
    try {
      setActionError("");

      setDeletingIds((currentIds) => {
        const nextIds = new Set(currentIds);
        nextIds.add(id);
        return nextIds;
      });

      await products.remove(id);

      setProductList((currentProducts) =>
        currentProducts.filter((product) => product._id !== id),
      );
    } catch (err) {
      setActionError(err.message);
    } finally {
      setDeletingIds((currentIds) => {
        const nextIds = new Set(currentIds);
        nextIds.delete(id);
        return nextIds;
      });
    }
  };

  const lowStockProducts = productList.filter(
    (product) => product.stock <= product.minStock,
  );

  return (
    <section>
      <h1>Administrar productos</h1>
      <p>Productos con stock bajo: {lowStockProducts.length}</p>

      {actionError && <p role="alert">{actionError}</p>}

      {productList.length === 0 ? (
        <p>No hay productos registrados.</p>
      ) : (
        productList.map((product) => (
          <article key={product._id}>
            <h2>{product.name}</h2>

            <p>SKU: {product.sku}</p>
            <p>Precio: ${product.price}</p>
            <p>Stock: {product.stock}</p>
            <p>Stock mínimo: {product.minStock}</p>
            {product.stock <= product.minStock && (
              <p>⚠ Stock bajo — requiere reposición</p>
            )}

            <Link to={`/admin/productos/${product._id}/editar`}>Editar</Link>

            <button
              type="button"
              onClick={() => handleDelete(product._id)}
              disabled={deletingIds.has(product._id)}
            >
              {deletingIds.has(product._id) ? "Desactivando..." : "Desactivar"}
            </button>
          </article>
        ))
      )}
    </section>
  );
};

export default AdminProducts;
