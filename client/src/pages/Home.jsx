import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

export default function Home() {
  const navigate = useNavigate();
  const [level, setLevel] = useState("easy");

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to logout");
    }
  };

  const startInterview = (mode) => {
    if (mode === "rapid") {
      navigate(`/rapid?level=${level}`);
    } else {
      navigate(`/interview/${mode}/${level}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 text-white relative p-4">
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg font-medium transition"
      >
        Logout
      </button>

      <h1 className="text-4xl font-bold mb-10 text-center">Customize Your Interview</h1>

      <div className="grid grid-cols-2 gap-8 mb-10 w-full max-w-2xl">
        <div onClick={() => startInterview("technical")} className="cursor-pointer p-10 bg-white/20 rounded-2xl text-center hover:scale-105 transition text-xl">🧠 Technical</div>
        <div onClick={() => startInterview("core")} className="cursor-pointer p-10 bg-white/20 rounded-2xl text-center hover:scale-105 transition text-xl">📚 Core Subjects</div>
        <div onClick={() => startInterview("hr")} className="cursor-pointer p-10 bg-white/20 rounded-2xl text-center hover:scale-105 transition text-xl">🗣 HR / Behavioral</div>
        <div onClick={() => startInterview("rapid")} className="cursor-pointer p-10 bg-white/20 rounded-2xl text-center hover:scale-105 transition text-xl">⚡ Rapid Fire</div>
      </div>

      <div className="flex gap-6">
        {["easy", "medium", "hard"].map((l) => (
          <button
            key={l}
            onClick={() => setLevel(l)}
            className={`px-8 py-3 rounded-xl font-semibold ${level === l ? "bg-pink-500 scale-110" : "bg-white text-black"}`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}