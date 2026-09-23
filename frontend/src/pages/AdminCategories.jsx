import { useEffect, useState } from "react";
import { categories } from "../services/categories";

const AdminCategories = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categories.getAll();
        setCategoryList(data.categories);
      } catch (error) {
        console.error("Error al cargar las categorías:", error);
      }
    };

    loadCategories();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const data = editingId
        ? await categories.update(editingId, {
            name,
            description,
          })
        : await categories.create({
            name,
            description,
          });

      setCategoryList((currentCategories) =>
        editingId
          ? currentCategories.map((category) =>
              category._id === editingId ? data.category : category,
            )
          : [...currentCategories, data.category],
      );

      setEditingId(null);
      setName("");
      setDescription("");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar esta categoría?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      await categories.remove(id);

      setCategoryList((currentCategories) =>
        currentCategories.filter((category) => category._id !== id),
      );
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <section>
      <h1>Administrar categorías</h1>
      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nombre</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Guardando..."
            : editingId
              ? "Guardar cambios"
              : "Crear categoría"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setName("");
              setDescription("");
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      {categoryList.map((category) => (
        <div key={category._id}>
          <h2>{category.name}</h2>
          <p>{category.description}</p>

          <button
            type="button"
            onClick={() => {
              setEditingId(category._id);
              setName(category.name);
              setDescription(category.description || "");
            }}
          >
            Editar
          </button>

          <button type="button" onClick={() => handleDelete(category._id)}>
            Eliminar
          </button>
        </div>
      ))}
    </section>
  );
};

export default AdminCategories;