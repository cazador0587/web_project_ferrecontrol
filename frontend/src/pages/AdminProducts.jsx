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
    <section className="admin-products">
      <div className="admin-products__header">
        <div>
          <h1 className="admin-products__title">Administrar productos</h1>
          <p className="admin-products__description">
            Consulta el inventario y administra los productos de FerreControl.
          </p>
        </div>

        <Link
          className="admin-products__create-link"
          to="/admin/productos/nuevo"
        >
          Nuevo producto
        </Link>
      </div>

      {isLoading && (
        <p className="admin-products__message">Cargando productos...</p>
      )}

      {!isLoading && error && (
        <p
          className="admin-products__message admin-products__message--error"
          role="alert"
        >
          Error: {error}
        </p>
      )}

      {!isLoading && !error && (
        <>
          <div className="admin-products__summary">
            <p className="admin-products__summary-label">
              Productos con stock bajo
            </p>

            <p className="admin-products__summary-value">
              {lowStockProducts.length}
            </p>
          </div>

          {actionError && (
            <p
              className="admin-products__message admin-products__message--error"
              role="alert"
            >
              {actionError}
            </p>
          )}

          {productList.length === 0 ? (
            <p className="admin-products__message">
              No hay productos registrados.
            </p>
          ) : (
            <div className="admin-products__list">
              {productList.map((product) => {
                const isLowStock = product.stock <= product.minStock;
                const isDeleting = deletingIds.has(product._id);

                return (
                  <article className="admin-products__card" key={product._id}>
                    <div className="admin-products__card-content">
                      <div className="admin-products__card-header">
                        <div>
                          <h2 className="admin-products__product-name">
                            {product.name}
                          </h2>

                          <p className="admin-products__sku">
                            SKU: {product.sku}
                          </p>

                          {product.brand && product.brand !== "Genérica" && (
                            <p className="admin-products__meta">
                              Marca: {product.brand}
                            </p>
                          )}

                          {product.model && (
                            <p className="admin-products__meta">
                              Modelo: {product.model}
                            </p>
                          )}
                        </div>

                        {isLowStock && (
                          <span className="admin-products__stock-warning">
                            Stock bajo
                          </span>
                        )}
                      </div>

                      <dl className="admin-products__details">
                        <div className="admin-products__detail">
                          <dt>Precio</dt>
                          <dd>${product.price}</dd>
                        </div>

                        <div className="admin-products__detail">
                          <dt>Stock</dt>
                          <dd>{product.stock}</dd>
                        </div>

                        <div className="admin-products__detail">
                          <dt>Stock mínimo</dt>
                          <dd>{product.minStock}</dd>
                        </div>
                      </dl>

                      {isLowStock && (
                        <p className="admin-products__warning">
                          Requiere reposición de inventario.
                        </p>
                      )}
                    </div>

                    <div className="admin-products__actions">
                      <Link
                        className="admin-products__edit-link"
                        to={`/admin/productos/${product._id}/editar`}
                      >
                        Editar
                      </Link>

                      <button
                        className="admin-products__deactivate-button"
                        type="button"
                        onClick={() => handleDelete(product._id)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Desactivando..." : "Desactivar"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default AdminProducts;
