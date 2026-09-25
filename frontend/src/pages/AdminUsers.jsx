import { useEffect, useState } from "react";
import { auth } from "../services/auth";

const AdminUsers = () => {
  const [userList, setUserList] = useState([]);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingUserIds, setUpdatingUserIds] = useState(new Set());

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

    setUpdatingUserIds((currentIds) => {
      const nextIds = new Set(currentIds);
      nextIds.add(id);
      return nextIds;
    });

    const data = await auth.updateUserRole(id, role);

    setUserList((currentUsers) =>
      currentUsers.map((user) => (user._id === id ? data.user : user)),
    );
  } catch (error) {
    setActionError(error.message);
  } finally {
    setUpdatingUserIds((currentIds) => {
      const nextIds = new Set(currentIds);
      nextIds.delete(id);
      return nextIds;
    });
  }
};

  return (
    <section className="admin-users">
      <div className="admin-users__header">
        <h1 className="admin-users__title">Administrar usuarios</h1>

        <p className="admin-users__description">
          Consulta los usuarios registrados y administra sus permisos.
        </p>
      </div>

      {isLoading && (
        <p className="admin-users__message">Cargando usuarios...</p>
      )}

      {!isLoading && error && (
        <p
          className="admin-users__message admin-users__message--error"
          role="alert"
        >
          Error: {error}
        </p>
      )}

      {!isLoading && !error && (
        <>
          <div className="admin-users__summary">
            <p className="admin-users__summary-label">Usuarios registrados</p>

            <p className="admin-users__summary-value">{userList.length}</p>
          </div>

          {actionError && (
            <p
              className="admin-users__message admin-users__message--error"
              role="alert"
            >
              {actionError}
            </p>
          )}

          {userList.length === 0 ? (
            <p className="admin-users__message">No hay usuarios registrados.</p>
          ) : (
            <div className="admin-users__list">
              {userList.map((user) => {
                const isUpdating = updatingUserIds.has(user._id);

                return (
                  <article className="admin-users__card" key={user._id}>
                    <div className="admin-users__user-info">
                      <h2 className="admin-users__name">
                        {user.name} {user.lastname}
                      </h2>

                      <p className="admin-users__email">{user.email}</p>
                    </div>

                    <div className="admin-users__role">
                      <label
                        className="admin-users__role-label"
                        htmlFor={`role-${user._id}`}
                      >
                        Rol
                      </label>

                      <select
                        className="admin-users__select"
                        id={`role-${user._id}`}
                        value={user.role}
                        onChange={(event) =>
                          handleRoleChange(user._id, event.target.value)
                        }
                        disabled={isUpdating}
                      >
                        <option value="client">Cliente</option>
                        <option value="admin">Administrador</option>
                      </select>

                      {isUpdating && (
                        <span className="admin-users__updating" role="status">
                          Actualizando...
                        </span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default AdminUsers;
