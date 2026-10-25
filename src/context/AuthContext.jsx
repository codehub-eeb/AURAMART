
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "../services/api";

const AuthContext = createContext();

function getSavedUser() {
  try {
    const savedUser = localStorage.getItem("auramart-user");
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    localStorage.removeItem("auramart-user");
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getSavedUser);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function verifySession() {
      const token = localStorage.getItem("auramart-token");

      if (!token) {
        if (active) setIsAuthLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");
        const verifiedUser = response.data.user;

        if (active) {
          setUser(verifiedUser);
          localStorage.setItem(
            "auramart-user",
            JSON.stringify(verifiedUser)
          );
        }
      } catch {
        localStorage.removeItem("auramart-token");
        localStorage.removeItem("auramart-user");

        if (active) setUser(null);
      } finally {
        if (active) setIsAuthLoading(false);
      }
    }

    verifySession();

    return () => {
      active = false;
    };
  }, []);

  const saveSession = (data) => {
    if (!data?.token || !data?.user) {
      throw new Error("Invalid authentication response from server.");
    }

    localStorage.setItem("auramart-token", data.token);
    localStorage.setItem(
      "auramart-user",
      JSON.stringify(data.user)
    );

    setUser(data.user);

    return data.user;
  };

  const login = async ({ email, password }) => {
    const response = await api.post("/auth/login", {
      email: email.trim().toLowerCase(),
      password,
    });

    return saveSession(response.data);
  };

  const signup = async ({ name, email, mobile, password }) => {
    // Validate before sending the request.
    if (!name?.trim() || !email?.trim() || !password) {
      throw new Error("Name, email and password are required.");
    }

    const response = await api.post("/auth/signup", {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      mobile: mobile?.trim() || "",
      password,
    });

    return saveSession(response.data);
  };

  const logout = () => {
    localStorage.removeItem("auramart-token");
    localStorage.removeItem("auramart-user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isLoggedIn: Boolean(user),
        isAuthLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
