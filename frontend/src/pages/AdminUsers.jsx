import { useEffect, useState } from "react";
import { auth } from "../services/auth";

const AdminUsers = () => {
  const [userList, setUserList] = useState([]);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await auth.getUsers();
        setUserList(data.users);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleRoleChange = async (id, role) => {
    try {
      setActionError("");
      setUpdatingUserId(id);

      const data = await auth.updateUserRole(id, role);

      setUserList((currentUsers) =>
        currentUsers.map((user) => (user._id === id ? data.user : user)),
      );
    } catch (error) {
      setActionError(error.message);
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (isLoading) {
    return <p>Cargando usuarios...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <section>
      <h1>Administrar usuarios</h1>
      {actionError && <p role="alert">{actionError}</p>}

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
            disabled={updatingUserId === user._id}
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
