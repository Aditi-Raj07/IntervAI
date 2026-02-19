import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "./firebase/firebase";

import Home from "./pages/Home";
import Interview from "./pages/Interview";
import Login from "./pages/Login";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Simple role logic
        if (currentUser.email === "youradmin@gmail.com") {
          setRole("admin");
        } else {
          setRole("user");
        }
      } else {
        setUser(null);
        setRole(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading authentication...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN PAGE */}
        <Route
          path="/"
          element={user ? <Navigate to="/home" /> : <Login />}
        />

        {/* HOME PAGE */}
        <Route
          path="/home"
          element={user ? <Home role={role} /> : <Navigate to="/" />}
        />

        {/* INTERVIEW PAGE */}
        <Route
          path="/interview/:mode/:level"
          element={user ? <Interview /> : <Navigate to="/" />}
        />

        {/* UNKNOWN ROUTES */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
