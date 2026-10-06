import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const roleLabels = {
  client: "Cliente",
  admin: "Administrador",
};

const Profile = () => {
  const { user } = useContext(AuthContext);

  const fullName = [user?.name, user?.lastname].filter(Boolean).join(" ");

  return (
    <section className="profile">
      <div className="profile__header">
        <h1 className="profile__title">Perfil de usuario</h1>
        <p className="profile__description">
          Consulta la información asociada a tu cuenta.
        </p>
      </div>

      <div className="profile__card">
        <dl className="profile__details">
          <div className="profile__item">
            <dt className="profile__label">Nombre</dt>
            <dd className="profile__value">{fullName || "No disponible"}</dd>
          </div>

          <div className="profile__item">
            <dt className="profile__label">Correo electrónico</dt>
            <dd className="profile__value">{user?.email || "No disponible"}</dd>
          </div>

          <div className="profile__item">
            <dt className="profile__label">Rol</dt>
            <dd className="profile__value">
              {roleLabels[user?.role] ?? user?.role ?? "No disponible"}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
};

export default Profile;
