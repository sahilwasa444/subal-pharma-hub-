import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

function AuthProvider({ children }) {

  const [user, setUser] = useState(null);

  useEffect(() => {

    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {

      setUser(
        JSON.parse(storedUser)
      );

    }

  }, []);

  function login(userData) {

    setUser(userData);

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

  }

  function logout() {

    setUser(null);

    localStorage.removeItem("user");

    localStorage.removeItem("token");

  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;