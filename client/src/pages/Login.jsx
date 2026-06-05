import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMail,
  FiLock,
  FiArrowRight,
  FiLogIn,
  FiAlertCircle,
} from "react-icons/fi";

import { Canvas } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";

// Animated 3D Blob
function AnimatedBlob() {
  return (
    <Sphere args={[1, 100, 200]} scale={2.3}>
      <MeshDistortMaterial
        color="#ec4899"
        attach="material"
        distort={0.4}
        speed={1.5}
        roughness={0.2}
      />
    </Sphere>
  );
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await signInWithEmailAndPassword(auth, email, password);

      navigate("/home");
    } catch (error) {
      setError(error.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden px-4">

      {/* 3D Background */}
      <div className="absolute inset-0 opacity-50">
        <Canvas camera={{ position: [0, 0, 4] }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[3, 2, 1]} />
          <AnimatedBlob />
        </Canvas>
      </div>

      {/* Glow Effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-pink-500/20 blur-[140px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/20 blur-[140px] rounded-full" />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="inline-flex items-center justify-center p-4 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-400 text-3xl mb-4"
          >
            <FiLogIn />
          </motion.div>

          <h2 className="text-3xl font-bold text-white">
            Welcome Back
          </h2>

          <p className="text-slate-400 mt-2 text-sm">
            Login to continue your interview practice
          </p>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm mb-5"
            >
              <FiAlertCircle />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">

          {/* Email */}
          <div>
            <label className="text-slate-300 text-sm mb-2 block">
              Email Address
            </label>

            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/60 border border-slate-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300 rounded-xl py-3 pl-11 pr-4 text-white placeholder-slate-500 outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-slate-300 text-sm">
                Password
              </label>

              <Link
                to="/forgot-password"
                className="text-pink-400 text-xs hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/60 border border-slate-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300 rounded-xl py-3 pl-11 pr-4 text-white placeholder-slate-500 outline-none"
              />
            </div>
          </div>

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 transition-all duration-300 text-white font-semibold py-3 rounded-xl shadow-lg shadow-pink-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              "Logging in..."
            ) : (
              <>
                Login
                <FiArrowRight />
              </>
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <p className="text-slate-400 text-sm text-center mt-8">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-pink-400 hover:text-pink-300 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}