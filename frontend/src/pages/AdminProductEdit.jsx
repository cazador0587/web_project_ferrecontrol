import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { products } from "../services/products";
import { categories } from "../services/categories";

const AdminProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  //const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
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
      setError("");

      const productData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        minStock: Number(formData.minStock),
      };

      await products.update(id, productData);

      navigate("/admin/productos");
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    products
      .getById(id)
      .then((data) => {
        // setProduct(data.product);

        setFormData({
          name: data.product.name,
          description: data.product.description,
          sku: data.product.sku,
          price: data.product.price,
          stock: data.product.stock,
          minStock: data.product.minStock,
          image: data.product.image || "",
          category: data.product.category?._id || data.product.category,
        });
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  useEffect(() => {
    categories
      .getAll()
      .then((data) => {
        setCategoryList(data.categories);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  if (isLoading) {
    return <p>Cargando producto...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <section>
      <h1>Editar producto</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nombre</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        {/* <p>Nombre: {product.name}</p> */}
        <div>
          <label htmlFor="sku">SKU</label>
          <input
            id="sku"
            name="sku"
            type="text"
            value={formData.sku}
            onChange={handleChange}
          />
        </div>
        {/* <p>SKU: {product.sku}</p> */}
        {/* <p>Precio: ${product.price}</p> */}
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
          />
        </div>
        {/* <p>Stock: {product.stock}</p> */}
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
        <button type="submit">Guardar cambios</button>
      </form>
    </section>
  );
};

export default AdminProductEdit;
