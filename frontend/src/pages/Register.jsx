import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/auth";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      await auth.register(formData);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth">
      <div className="auth__card">
        <div className="auth__header">
          <h1 className="auth__title">Crear cuenta</h1>
          <p className="auth__description">
            Regístrate para realizar compras y consultar tus pedidos.
          </p>
        </div>

        <form className="auth__form" onSubmit={handleSubmit}>
          <div className="auth__field">
            <label className="auth__label" htmlFor="name">
              Nombre
            </label>

            <input
              className="auth__input"
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              autoComplete="given-name"
              required
            />
          </div>

          <div className="auth__field">
            <label className="auth__label" htmlFor="lastname">
              Apellidos
            </label>

            <input
              className="auth__input"
              id="lastname"
              name="lastname"
              type="text"
              value={formData.lastname}
              onChange={handleChange}
              autoComplete="family-name"
              required
            />
          </div>

          <div className="auth__field">
            <label className="auth__label" htmlFor="email">
              Correo electrónico
            </label>

            <input
              className="auth__input"
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="auth__field">
            <label className="auth__label" htmlFor="password">
              Contraseña
            </label>

            <input
              className="auth__input"
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              minLength="8"
              required
            />
          </div>

          {error && (
            <p className="auth__error" role="alert">
              {error}
            </p>
          )}

          <button
            className="auth__button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Register;
