import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "./firebase/firebase";

import Home from "./pages/Home";
import Interview from "./pages/Interview";
import Login from "./pages/Login";
import { signOut } from "firebase/auth";

useEffect(() => {
  signOut(auth);
}, []);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // 🔥 Role-based logic (simple version)
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

        {/* ALWAYS OPEN LOGIN FIRST */}
        <Route
          path="/"
          element={!user ? <Login /> : <Navigate to="/home" />}
        />

        {/* PROTECTED HOME */}
        <Route
          path="/home"
          element={user ? <Home role={role} /> : <Navigate to="/" />}
        />

        {/* PROTECTED INTERVIEW */}
        <Route
          path="/interview/:mode/:level"
          element={user ? <Interview /> : <Navigate to="/" />}
        />

        {/* BLOCK UNKNOWN ROUTES */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
