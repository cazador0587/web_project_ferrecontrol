import { useEffect, useState } from "react";
import { auth } from "../services/auth";

const AdminUsers = () => {
  const [userList, setUserList] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await auth.getUsers();
        setUserList(data.users);
      } catch (error) {
        setError(error.message);
        //console.error("Error al cargar los usuarios:", error);
      }
    };

    loadUsers();
  }, []);

  const handleRoleChange = async (id, role) => {
    try {
      setError("");

      const data = await auth.updateUserRole(id, role);

      setUserList((currentUsers) =>
        currentUsers.map((user) => (user._id === id ? data.user : user)),
      );
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <section>
      <h1>Administrar usuarios</h1>
      {error && <p>{error}</p>}

      <p>Usuarios encontrados: {userList.length}</p>
      {userList.map((user) => (
        <div key={user._id}>
          <h2>
            {user.name} {user.lastname}
          </h2>
          <p>Correo: {user.email}</p>
          <p>Rol: {user.role}</p>
          <select
            value={user.role}
            onChange={(event) => handleRoleChange(user._id, event.target.value)}
          >
            <option value="client">Cliente</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
      ))}
    </section>
  );
};

export default AdminUsers;
