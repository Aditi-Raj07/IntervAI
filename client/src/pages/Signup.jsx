import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate, Link } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";

import {
  FiMail,
  FiLock,
  FiArrowRight,
  FiUserPlus,
  FiAlertCircle,
  FiUser,
} from "react-icons/fi";

import { Canvas } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";

// Animated 3D Blob
function AnimatedBlob() {
  return (
    <Sphere args={[1, 100, 200]} scale={2.4}>
      <MeshDistortMaterial
        color="#ec4899"
        distort={0.35}
        speed={1.2}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  );
}

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");

    if (!name || !email || !password) {
      setError("Please fill all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      navigate("/home");

    } catch (err) {
      setError(
        err.message.replace("Firebase: ", "")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-950 overflow-hidden px-4">

      {/* 3D Background */}
      <div className="absolute inset-0 z-0 opacity-40 md:opacity-60 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 4] }}>
          <ambientLight intensity={0.7} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1.5}
          />
          <pointLight
            position={[-10, -10, -5]}
            intensity={0.5}
          />

          <AnimatedBlob />
        </Canvas>
      </div>

      {/* Glow Effects */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-[120px]" />

      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
        }}
        className="relative z-10 w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 md:p-10 rounded-3xl shadow-2xl"
      >

        {/* Header */}
        <div className="text-center mb-8">

          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 100,
            }}
            className="inline-flex p-3 bg-pink-500/10 border border-pink-500/20 rounded-2xl text-pink-400 mb-4 text-2xl"
          >
            <FiUserPlus />
          </motion.div>

          <h2 className="text-3xl font-bold text-white tracking-tight">
            Create Account
          </h2>

          <p className="text-slate-400 mt-2 text-sm">
            Start your AI interview journey
          </p>
        </div>

        {/* Error */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs font-medium mb-5"
            >
              <FiAlertCircle className="text-base" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form
          onSubmit={handleSignup}
          className="space-y-5"
        >

          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-slate-300 text-xs font-semibold uppercase">
              Full Name
            </label>

            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                <FiUser />
              </span>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-800 text-white placeholder-slate-600 rounded-xl focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all duration-200 text-sm"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-slate-300 text-xs font-semibold uppercase">
              Email Address
            </label>

            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                <FiMail />
              </span>

              <input
                type="email"
                placeholder="name@domain.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-800 text-white placeholder-slate-600 rounded-xl focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all duration-200 text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-slate-300 text-xs font-semibold uppercase">
              Password
            </label>

            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                <FiLock />
              </span>

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-800 text-white placeholder-slate-600 rounded-xl focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all duration-200 text-sm"
              />
            </div>
          </div>

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-pink-500/20 transition-all duration-300 disabled:opacity-50 text-sm"
          >
            {loading ? (
              "Creating Account..."
            ) : (
              <>
                Sign Up
                <FiArrowRight />
              </>
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <p className="text-slate-400 text-sm text-center mt-8 font-medium">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-pink-400 hover:text-pink-300 hover:underline ml-1"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}