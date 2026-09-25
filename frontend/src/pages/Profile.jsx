import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const Profile = () => {
  const { user } = useContext(AuthContext);

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
            <dd className="profile__value">
              {user?.name} {user?.lastname}
            </dd>
          </div>

          <div className="profile__item">
            <dt className="profile__label">Correo electrónico</dt>
            <dd className="profile__value">{user?.email}</dd>
          </div>

          <div className="profile__item">
            <dt className="profile__label">Rol</dt>
            <dd className="profile__value">{user?.role}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
};

export default Profile;
