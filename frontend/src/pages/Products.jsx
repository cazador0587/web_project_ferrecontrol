import { useEffect, useState } from "react";
import { products } from "../services/products";
import ProductGrid from "../components/ProductGrid";
import { categories } from "../services/categories";

const Products = () => {
  const [productList, setProductList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

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
    
    categories
      .getAll()
      .then((data) => {
        setCategoryList(data.categories);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  const filteredProducts = productList.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "" || product.category?._id === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return <p>Cargando productos...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <section className="products">
      <h1 className="products__title">Catálogo de productos</h1>

      <p className="products__description">
        Explora nuestro catálogo de herramientas, materiales y accesorios.
      </p>
      <div className="products__filters">
        <input
          className="products__search"
          type="search"
          aria-label="Buscar productos"
          placeholder="Buscar producto..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        <select
          className="products__select"
          aria-label="Filtrar por categoría"
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}
        >
          <option value="">Todas las categorías</option>

          {categoryList.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {filteredProducts.length > 0 && (
        <p className="products__results">
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1
            ? "producto encontrado"
            : "productos encontrados"}
        </p>
      )}

      {productList.length === 0 ? (
        <p className="products__empty">No hay productos disponibles.</p>
      ) : filteredProducts.length === 0 ? (
        <p className="products__empty">No se encontraron productos.</p>
      ) : (
        <ProductGrid products={filteredProducts} />
      )}
    </section>
  );
};

export default Products;
