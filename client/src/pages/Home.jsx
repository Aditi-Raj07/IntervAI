import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

<button
  onClick={() => signOut(auth)}
  className="bg-red-500 px-4 py-2 rounded-lg"
>
  Logout
</button>

export default function Home() {
  const navigate = useNavigate();
  const [level, setLevel] = useState("easy");

  const startInterview = (mode) => {
    navigate(`/interview/${mode}/${level}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 text-white">

      <h1 className="text-4xl font-bold mb-10">
        Customize Your Interview
      </h1>

      {/* Modes */}
      <div className="grid grid-cols-2 gap-8 mb-10">

        <div onClick={() => startInterview("technical")}
          className="cursor-pointer p-10 bg-white/20 rounded-2xl text-center hover:scale-105 transition">
          🧠 Technical
        </div>

        <div onClick={() => startInterview("core")}
          className="cursor-pointer p-10 bg-white/20 rounded-2xl text-center hover:scale-105 transition">
          📚 Core Subjects
        </div>

        <div onClick={() => startInterview("hr")}
          className="cursor-pointer p-10 bg-white/20 rounded-2xl text-center hover:scale-105 transition">
          🗣 HR / Behavioral
        </div>

        <div onClick={() => startInterview("rapid")}
          className="cursor-pointer p-10 bg-white/20 rounded-2xl text-center hover:scale-105 transition">
          ⚡ Rapid Fire
        </div>

      </div>

      {/* Difficulty */}
      <div className="flex gap-6">
        <button onClick={() => setLevel("easy")}
          className={`px-6 py-3 rounded-xl ${level==="easy"?"bg-pink-500":"bg-white text-black"}`}>
          Easy
        </button>

        <button onClick={() => setLevel("medium")}
          className={`px-6 py-3 rounded-xl ${level==="medium"?"bg-pink-500":"bg-white text-black"}`}>
          Medium
        </button>

        <button onClick={() => setLevel("hard")}
          className={`px-6 py-3 rounded-xl ${level==="hard"?"bg-pink-500":"bg-white text-black"}`}>
          Hard
        </button>
      </div>

    </div>
  );
}
