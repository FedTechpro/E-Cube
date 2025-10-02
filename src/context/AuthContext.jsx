import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("http://localhost:4000/api/me", {
          credentials: "include", // important to send cookies
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  async function login(email, password) {
    try {
      if (!email || !password) {
        throw new Error("All fields are required");
      }

      let response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      let data = await response.json();

      if (response.ok) {
        setUser(data.user);
        return data.user;
      } else {
        console.log("❌ Login failed:", data.message || "Unknown error");
      }
    } catch (error) {
      console.error("Signup error:", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function signup(name, email, password, role, whatsapp, agreeToTerms) {
    try {
      if (!name || !email || !password) {
        throw new Error("All fields are required");
      }

      const response = await fetch("http://localhost:4000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          whatsapp,
          agreeToTerms,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user); // ✅ update state
        return data.user; // ✅ return the actual user
      } else {
        throw new Error(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error.message);
      throw error; // ✅ re-throw so caller can catch it
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    if (user) {
      const response = await fetch("http://localhost:4000/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (response.ok) {
        setUser(null);
        console.log("✅ Logout successful");
      } else {
        console.log("❌ Logout failed");
      }
    }
    setLoading(false);
  }

  return (
    <AuthContext.Provider value={{ login, signup, logout, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
