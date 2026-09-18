import { useEffect, useState } from "react";
import { products } from "../services/products";
import ProductGrid from "../components/ProductGrid";

const Products = () => {
  const [productList, setProductList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <section>
      <h1>Catálogo de productos</h1>

      <p>Explora nuestro catálogo de herramientas, materiales y accesorios.</p>

      {productList.length === 0 ? (
        <p>No hay productos disponibles.</p>
      ) : (
        <ProductGrid products={productList} />
      )}
    </section>
  );
};

export default Products;
