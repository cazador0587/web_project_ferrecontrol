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
    brand: "",
    model: "",
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

  return (
    <section className="admin-product-form">
      <div className="admin-product-form__header">
        <h1 className="admin-product-form__title">Crear producto</h1>

        <p className="admin-product-form__description">
          Registra un nuevo producto y define su información de inventario.
        </p>
      </div>

      {isLoading && (
        <p className="admin-product-form__message">Cargando categorías...</p>
      )}

      {!isLoading && error && (
        <p
          className="admin-product-form__message admin-product-form__message--error"
          role="alert"
        >
          Error: {error}
        </p>
      )}

      {!isLoading && !error && (
        <div className="admin-product-form__card">
          {submitError && (
            <p
              className="admin-product-form__message admin-product-form__message--error"
              role="alert"
            >
              {submitError}
            </p>
          )}

          <form className="admin-product-form__form" onSubmit={handleSubmit}>
            <div className="admin-product-form__field admin-product-form__field--wide">
              <label className="admin-product-form__label" htmlFor="name">
                Nombre
              </label>

              <input
                className="admin-product-form__input"
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-product-form__field">
              <label className="admin-product-form__label" htmlFor="brand">
                Marca
              </label>

              <input
                className="admin-product-form__input"
                id="brand"
                name="brand"
                type="text"
                maxLength="50"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Ej. Truper"
              />
            </div>

            <div className="admin-product-form__field">
              <label className="admin-product-form__label" htmlFor="model">
                Modelo
              </label>

              <input
                className="admin-product-form__input"
                id="model"
                name="model"
                type="text"
                maxLength="80"
                value={formData.model}
                onChange={handleChange}
                placeholder="Ej. HSS 1-6 mm"
              />
            </div>

            <div className="admin-product-form__field admin-product-form__field--wide">
              <label
                className="admin-product-form__label"
                htmlFor="description"
              >
                Descripción
              </label>

              <textarea
                className="admin-product-form__textarea"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-product-form__field">
              <label className="admin-product-form__label" htmlFor="sku">
                SKU
              </label>

              <input
                className="admin-product-form__input"
                id="sku"
                name="sku"
                type="text"
                value={formData.sku}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-product-form__field">
              <label className="admin-product-form__label" htmlFor="category">
                Categoría
              </label>

              <select
                className="admin-product-form__select"
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

            <div className="admin-product-form__field">
              <label className="admin-product-form__label" htmlFor="price">
                Precio
              </label>

              <input
                className="admin-product-form__input"
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

            <div className="admin-product-form__field">
              <label className="admin-product-form__label" htmlFor="stock">
                Stock
              </label>

              <input
                className="admin-product-form__input"
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

            <div className="admin-product-form__field">
              <label className="admin-product-form__label" htmlFor="minStock">
                Stock mínimo
              </label>

              <input
                className="admin-product-form__input"
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

            <div className="admin-product-form__field">
              <label className="admin-product-form__label" htmlFor="image">
                URL de imagen
              </label>

              <input
                className="admin-product-form__input"
                id="image"
                name="image"
                type="text"
                value={formData.image}
                onChange={handleChange}
              />
            </div>

            <div className="admin-product-form__actions">
              <button
                className="admin-product-form__submit-button"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creando producto..." : "Crear producto"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};

export default AdminProductCreate;