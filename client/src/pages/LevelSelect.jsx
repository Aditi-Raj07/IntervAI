import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LevelSelect() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("technical");
  const [difficulty, setDifficulty] = useState("easy");

  const startInterview = () => {
    if (mode === "rapid") {
      navigate(`/rapid?level=${difficulty}`);
    } else {
      navigate(`/interview/${mode}/${difficulty}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 text-white flex flex-col items-center justify-center p-10">

      <h1 className="text-4xl font-bold mb-10">
        Customize Your Interview
      </h1>

      {/* Mode Selection */}
      <h2 className="text-2xl mb-6">Select Interview Mode</h2>

      <div className="grid grid-cols-2 gap-6 mb-12">

        {["technical", "core", "hr", "rapid"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-8 py-6 rounded-2xl text-lg font-semibold transition-all duration-300 ${
              mode === m
                ? "bg-gradient-to-r from-purple-500 to-indigo-500 scale-105"
                : "bg-white text-black"
            }`}
          >
            {m.toUpperCase()}
          </button>
        ))}

      </div>

      {/* Difficulty */}
      <h2 className="text-2xl mb-6">Select Difficulty</h2>

      <div className="flex gap-6 mb-10">
        {["easy", "medium", "hard"].map((lvl) => (
          <button
            key={lvl}
            onClick={() => setDifficulty(lvl)}
            className={`px-8 py-4 rounded-xl font-semibold transition-all ${
              difficulty === lvl
                ? "bg-gradient-to-r from-pink-500 to-purple-500 scale-110"
                : "bg-white text-black"
            }`}
          >
            {lvl.toUpperCase()}
          </button>
        ))}
      </div>

      <button
        onClick={startInterview}
        className="px-12 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl text-xl font-semibold hover:scale-105 transition"
      >
        🚀 Start Interview
      </button>
    </div>
  );
}
