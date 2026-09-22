import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const Profile = () => {
  const { user } = useContext(AuthContext);

  return (
    <section>
      <h1>Perfil de usuario</h1>

      <p>
        Nombre: {user?.name} {user?.lastname}
      </p>

      <p>Correo: {user?.email}</p>
      <p>Rol: {user?.role}</p>
    </section>
  );
};

export default Profile;
