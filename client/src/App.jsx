import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "./firebase/firebase";

import Interview from "./pages/Interview.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Show loading until Firebase checks auth state
  if (loading) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/home"
          element={user ? <Home /> : <Navigate to="/login" />}
        />

        <Route
          path="/interview/:mode/:level"
          element={user ? <Interview /> : <Navigate to="/login" />}
        />

        <Route path="*" element={<Navigate to="/home" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;