import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "../services/categories";
import { products } from "../services/products";

const AdminProductCreate = () => {
  const navigate = useNavigate();
  const [categoryList, setCategoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sku: "",
    price: "",
    stock: "",
    minStock: "",
    image: "",
    category: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitError("");
      setIsSubmitting(true);

      const productData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        minStock: Number(formData.minStock),
      };

      await products.create(productData);

      navigate("/admin/productos");
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    categories
      .getAll()
      .then((data) => {
        setCategoryList(data.categories);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <p>Cargando categorías...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <section>
      <h1>Crear producto</h1>
      {submitError && <p role="alert">{submitError}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nombre</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="sku">SKU</label>
          <input
            id="sku"
            name="sku"
            type="text"
            value={formData.sku}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="price">Precio</label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="stock">Stock</label>
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            step="1"
            value={formData.stock}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="minStock">Stock mínimo</label>
          <input
            id="minStock"
            name="minStock"
            type="number"
            min="0"
            step="1"
            value={formData.minStock}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="image">URL de imagen</label>
          <input
            id="image"
            name="image"
            type="text"
            value={formData.image}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="category">Categoría</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Selecciona una categoría
            </option>

            {categoryList.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creando producto..." : "Crear producto"}
        </button>
      </form>
    </section>
  );
};

export default AdminProductCreate;