import { useEffect, useState } from "react";
import { auth } from "../services/auth";
import { getToken, removeToken, setToken } from "../utils/token";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(() => Boolean(getToken()));

  const login = async (credentials) => {
    const data = await auth.login(credentials);

    setToken(data.token);
    setUser(data.user);

    return data;
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  useEffect(() => {
    const token = getToken();

    if (!token) {
      return;
    }

    auth
      .getCurrentUser()
      .then((data) => {
        setUser(data.user);
      })
      .catch(() => {
        removeToken();
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
