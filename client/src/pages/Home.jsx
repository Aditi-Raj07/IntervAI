import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { motion } from "framer-motion";

import {
  FiLogOut,
  FiCode,
  FiBookOpen,
  FiUsers,
  FiZap,
  FiArrowRight,
  FiSliders,
  FiTrendingUp,
  FiAward,
  FiShield
} from "react-icons/fi";

// Configuration for rich UI changes based on selecting difficulty
const DIFFICULTY_THEMES = {
  easy: {
    accent: "from-emerald-400 to-teal-500",
    bgAccent: "bg-emerald-500/10",
    borderAccent: "border-emerald-500/20",
    textAccent: "text-emerald-400",
    glow: "bg-emerald-500/10",
    badgeText: "Lvl 1 - Foundation",
    metaText: "Standard prompt structures. Generous response time ceilings."
  },
  medium: {
    accent: "from-indigo-400 to-blue-500",
    bgAccent: "bg-indigo-500/10",
    borderAccent: "border-indigo-500/20",
    textAccent: "text-indigo-400",
    glow: "bg-indigo-500/10",
    badgeText: "Lvl 2 - Professional",
    metaText: "Production architecture edge cases. Standard FAANG validation."
  },
  hard: {
    accent: "from-rose-500 to-amber-500",
    bgAccent: "bg-rose-500/10",
    borderAccent: "border-rose-500/20",
    textAccent: "text-rose-400",
    glow: "bg-rose-500/10",
    badgeText: "Lvl 3 - Expert Elite",
    metaText: "Highly volatile deep-dives. Low fault tolerance limits."
  }
};

export default function Home() {
  const navigate = useNavigate();
  const [level, setLevel] = useState("easy");

  // Fetch the design configuration matching the state selection
  const currentTheme = DIFFICULTY_THEMES[level];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error(error);
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

  const interviewCards = [
    {
      title: "Technical Assessment",
      icon: <FiCode />,
      mode: "technical",
      description: "Evaluate algorithms, data structures, and optimized system development logic.",
      duration: "45 mins",
      topics: ["DSA", "System Design", "Coding"]
    },
    {
      title: "Core Engineering Subjects",
      icon: <FiBookOpen />,
      mode: "core",
      description: "Deep-dive validation of database systems, computer networks, architecture, and OS.",
      duration: "30 mins",
      topics: ["DBMS", "OS", "Networks"]
    },
    {
      title: "Behavioral & HR",
      icon: <FiUsers />,
      mode: "hr",
      description: "Assess situational responses, communication framework, culture-fit, and leadership potential.",
      duration: "20 mins",
      topics: ["STAR Method", "Culture", "EQ"]
    },
    {
      title: "Rapid Fire Blueprint",
      icon: <FiZap />,
      mode: "rapid",
      description: "High-pressure, fast-paced environment simulating real-time lightning technical screens.",
      duration: "15 mins",
      topics: ["Speed", "Precision", "Recall"]
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#090d16] text-slate-100 font-sans antialiased overflow-x-hidden transition-colors duration-500">
      
      {/* Structural Ambient Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      
      {/* Reactive Glow Vectors changing with target difficulty selection */}
      <div className={`absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] ${currentTheme.glow} blur-[160px] rounded-full pointer-events-none transition-all duration-700`} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-slate-500/5 blur-[160px] rounded-full pointer-events-none" />

      {/* Modern Fixed Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/60 bg-[#090d16]/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${currentTheme.accent} flex items-center justify-center shadow-lg transition-all duration-500`}>
              <FiAward className="text-xl text-[#090d16]" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                InterviewAI
              </span>
              <span className={`text-[10px] block font-semibold ${currentTheme.textAccent} tracking-widest uppercase transition-colors duration-500`}>
                {level} Matrix
              </span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "rgba(239, 68, 68, 0.15)" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium"
          >
            <FiLogOut className="text-base" />
            Sign Out
          </motion.button>
        </div>
      </header>

      {/* Dashboard Canvas Wrapper */}
      <main className="max-w-7xl mx-auto px-6 pt-12 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Left Column: Context Controls */}
        <section className="lg:col-span-4 flex flex-col justify-between lg:h-[calc(100vh-12rem)] lg:sticky lg:top-32">
          <div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${currentTheme.bgAccent} border ${currentTheme.borderAccent} ${currentTheme.textAccent} text-xs font-medium mb-5 transition-all duration-500`}>
              <FiTrendingUp className="text-sm" /> Engine Running: {level.toUpperCase()}
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white mb-4">
              Refine Your <br />
              <span className={`bg-gradient-to-r ${currentTheme.accent} bg-clip-text text-transparent transition-all duration-500`}>
                Technical Edge
              </span>
            </h1>
            
            <p className="text-slate-400 text-base leading-relaxed max-w-sm">
              Deploy specialized AI screening modules optimized to replicate high-tier company infrastructure standards.
            </p>
          </div>

          {/* Upgraded Difficulty Switcher Widget */}
          <div className="mt-12 lg:mt-0 bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-slate-300 text-sm font-semibold mb-4">
              <FiSliders className={`${currentTheme.textAccent} transition-colors duration-500`} />
              <span>Target Baseline Complexity</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800/40">
              {["easy", "medium", "hard"].map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`relative py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    level === l
                      ? "text-[#090d16] font-extrabold z-10"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {level === l && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className={`absolute inset-0 bg-gradient-to-r ${currentTheme.accent} rounded-lg -z-10`}
                      transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    />
                  )}
                  {l}
                </button>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/40 text-[11px] text-slate-400 flex flex-col gap-1">
              <span className="font-semibold text-slate-200">System Parameters:</span>
              <span className="text-slate-400 transition-all duration-300">{currentTheme.metaText}</span>
            </div>
          </div>
        </section>

        {/* Right Column: Execution Modules Grid */}
        <section className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {interviewCards.map((card, index) => (
            <motion.div
              key={card.mode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, duration: 0.4 }}
              whileHover={{ y: -4, borderColor: "rgba(255,255,255,0.15)" }}
              onClick={() => startInterview(card.mode)}
              className="group cursor-pointer flex flex-col justify-between bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 transition-all duration-300 hover:bg-slate-900/60 relative overflow-hidden"
            >
              <div>
                {/* Card Header Metadata */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xl text-slate-400 group-hover:bg-slate-100 group-hover:text-[#090d16] transition-colors duration-300`}>
                    {card.icon}
                  </div>
                  
                  {/* Dynamic Level Track Indicator Badge */}
                  <span className={`text-[10px] font-bold tracking-wider ${currentTheme.textAccent} ${currentTheme.bgAccent} border ${currentTheme.borderAccent} px-2.5 py-1 rounded-md uppercase transition-all duration-500 flex items-center gap-1`}>
                    <FiShield className="text-[9px]" /> {currentTheme.badgeText}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-slate-100 group-hover:text-white transition-colors duration-200 mb-2">
                  {card.title}
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-6">
                  {card.description}
                </p>
              </div>

              {/* Bottom Tags / Meta Footer */}
              <div>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {card.topics.map((topic) => (
                    <span key={topic} className="text-[10px] font-medium text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800/60">
                      {topic}
                    </span>
                  ))}
                  <span className="text-[10px] font-medium text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800/20 ml-auto">
                    {card.duration}
                  </span>
                </div>

                <div className="pt-4 border-t border-slate-800/40 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-white transition-colors duration-200">
                  <span>Initialize Simulation</span>
                  <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 group-hover:bg-white group-hover:border-white text-slate-400 group-hover:text-[#090d16] transition-all duration-300 group-hover:translate-x-1">
                    <FiArrowRight className="text-xs" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </section>

      </main>
    </div>
  );
}