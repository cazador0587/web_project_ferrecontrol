import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { products } from "../services/products";
import { categories } from "../services/categories";

const AdminProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [categoryList, setCategoryList] = useState([]);

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

      await products.update(id, productData);

      navigate("/admin/productos");
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const loadProductData = async () => {
      setIsLoading(true);
      setError("");

      try {
        const [productData, categoryData] = await Promise.all([
          products.getById(id),
          categories.getAll(),
        ]);

        setFormData({
          name: productData.product.name,
          description: productData.product.description,
          sku: productData.product.sku,
          price: productData.product.price,
          stock: productData.product.stock,
          minStock: productData.product.minStock,
          image: productData.product.image || "",
          category:
            productData.product.category?._id || productData.product.category,
        });

        setCategoryList(categoryData.categories);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadProductData();
  }, [id]);

  return (
    <section className="admin-product-form">
      <div className="admin-product-form__header">
        <h1 className="admin-product-form__title">Editar producto</h1>

        <p className="admin-product-form__description">
          Actualiza la información, categoría e inventario del producto.
        </p>
      </div>

      {isLoading && (
        <p className="admin-product-form__message">Cargando producto...</p>
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
                {isSubmitting ? "Guardando cambios..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};

export default AdminProductEdit;
