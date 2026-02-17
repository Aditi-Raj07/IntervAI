import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { FaGoogle, FaRobot } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);

      navigate("/home"); // ✅ smooth redirect
    } catch (err) {
      console.error("Login Error:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center relative overflow-hidden">

      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full blur-[140px] opacity-30 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-500 rounded-full blur-[140px] opacity-30 animate-pulse"></div>

      <div className="relative bg-slate-900/70 backdrop-blur-xl border border-white/10 p-12 rounded-3xl shadow-2xl w-full max-w-md text-center">

        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-tr from-purple-600 to-cyan-500 p-4 rounded-2xl shadow-lg">
            <FaRobot className="text-white text-3xl" />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-white mb-2">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">IntervAI</span>
        </h1>

        <p className="text-slate-400 text-sm mb-8">
          Sign in to continue your AI interview journey
        </p>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white text-black py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg"
        >
          <FaGoogle />
          {loading ? "Signing in..." : "Continue with Google"}
        </button>

        <p className="text-xs text-slate-500 mt-6">
          Secure authentication powered by Firebase
        </p>
      </div>
    </div>
  );
}
