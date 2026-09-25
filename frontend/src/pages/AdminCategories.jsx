import { useEffect, useState } from "react";
import { categories } from "../services/categories";

const AdminCategories = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingIds, setDeletingIds] = useState(new Set());

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categories.getAll();
        setCategoryList(data.categories);
      } catch (error) {
        setLoadError(error.message);
      } finally {
        setIsLoading(false);
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

      setDeletingIds((currentIds) => {
        const nextIds = new Set(currentIds);
        nextIds.add(id);
        return nextIds;
      });

      await categories.remove(id);

      setCategoryList((currentCategories) =>
        currentCategories.filter((category) => category._id !== id),
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setDeletingIds((currentIds) => {
        const nextIds = new Set(currentIds);
        nextIds.delete(id);
        return nextIds;
      });
    }
  };

  return (
    <section className="admin-categories">
      <div className="admin-categories__header">
        <h1 className="admin-categories__title">Administrar categorías</h1>

        <p className="admin-categories__description">
          Crea y administra las categorías utilizadas para organizar el
          catálogo.
        </p>
      </div>

      {isLoading && (
        <p className="admin-categories__message">Cargando categorías...</p>
      )}

      {!isLoading && loadError && (
        <p
          className="admin-categories__message admin-categories__message--error"
          role="alert"
        >
          Error al cargar las categorías: {loadError}
        </p>
      )}

      {!isLoading && !loadError && (
        <div className="admin-categories__content">
          <section className="admin-categories__form-card">
            <div className="admin-categories__form-header">
              <h2 className="admin-categories__subtitle">
                {editingId ? "Editar categoría" : "Nueva categoría"}
              </h2>

              <p className="admin-categories__form-description">
                {editingId
                  ? "Actualiza la información de la categoría seleccionada."
                  : "Agrega una categoría para clasificar los productos."}
              </p>
            </div>

            {error && (
              <p
                className="admin-categories__message admin-categories__message--error"
                role="alert"
              >
                {error}
              </p>
            )}

            <form className="admin-categories__form" onSubmit={handleSubmit}>
              <div className="admin-categories__field">
                <label className="admin-categories__label" htmlFor="name">
                  Nombre
                </label>

                <input
                  className="admin-categories__input"
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>

              <div className="admin-categories__field">
                <label
                  className="admin-categories__label"
                  htmlFor="description"
                >
                  Descripción
                </label>

                <textarea
                  className="admin-categories__textarea"
                  id="description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>

              <div className="admin-categories__form-actions">
                <button
                  className="admin-categories__submit-button"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Guardando..."
                    : editingId
                      ? "Guardar cambios"
                      : "Crear categoría"}
                </button>

                {editingId && (
                  <button
                    className="admin-categories__cancel-button"
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
              </div>
            </form>
          </section>

          <section className="admin-categories__list-section">
            <div className="admin-categories__list-header">
              <h2 className="admin-categories__subtitle">
                Categorías registradas
              </h2>

              <span className="admin-categories__count">
                {categoryList.length}
              </span>
            </div>

            {categoryList.length === 0 ? (
              <p className="admin-categories__message">
                No hay categorías registradas.
              </p>
            ) : (
              <div className="admin-categories__list">
                {categoryList.map((category) => {
                  const isDeleting = deletingIds.has(category._id);

                  return (
                    <article
                      className="admin-categories__card"
                      key={category._id}
                    >
                      <div className="admin-categories__card-content">
                        <h3 className="admin-categories__category-name">
                          {category.name}
                        </h3>

                        <p className="admin-categories__category-description">
                          {category.description || "Sin descripción."}
                        </p>
                      </div>

                      <div className="admin-categories__actions">
                        <button
                          className="admin-categories__edit-button"
                          type="button"
                          onClick={() => {
                            setEditingId(category._id);
                            setName(category.name);
                            setDescription(category.description || "");
                          }}
                        >
                          Editar
                        </button>

                        <button
                          className="admin-categories__delete-button"
                          type="button"
                          onClick={() => handleDelete(category._id)}
                          disabled={isDeleting}
                        >
                          {isDeleting ? "Eliminando..." : "Eliminar"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      )}
    </section>
  );
};

export default AdminCategories;