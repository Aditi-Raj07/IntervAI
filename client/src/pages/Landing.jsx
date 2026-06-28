import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiCode,
  FiUsers,
  FiZap,
  FiBookOpen,
} from "react-icons/fi";

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FiCode className="text-3xl text-pink-400" />,
      title: "Technical Interviews",
      desc: "Practice DSA, Coding and System Design interviews.",
    },
    {
      icon: <FiBookOpen className="text-3xl text-indigo-400" />,
      title: "Core Subjects",
      desc: "Prepare DBMS, OS, Computer Networks and OOP.",
    },
    {
      icon: <FiUsers className="text-3xl text-purple-400" />,
      title: "HR Interviews",
      desc: "Improve communication and behavioral interview skills.",
    },
    {
      icon: <FiZap className="text-3xl text-yellow-400" />,
      title: "Rapid Fire",
      desc: "Answer quick AI-generated questions under time pressure.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-6">

        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-indigo-500 bg-clip-text text-transparent">
          InterviewAI
        </h1>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 rounded-xl border border-slate-700 hover:border-pink-500 transition"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:scale-105 transition"
          >
            Get Started
          </button>
        </div>

      </nav>

      {/* Hero */}

      <section className="max-w-7xl mx-auto px-6 py-24 text-center">

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-6xl font-black leading-tight"
        >
          Ace Your
          <span className="block bg-gradient-to-r from-pink-500 to-indigo-500 bg-clip-text text-transparent">
            AI Mock Interviews
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 text-xl mt-8 max-w-3xl mx-auto"
        >
          Practice Technical, HR, Core Subjects and Rapid Fire interviews
          powered by Artificial Intelligence. Improve your confidence,
          communication and technical skills.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex justify-center gap-5"
        >
          <button
            onClick={() => navigate("/signup")}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:scale-105 transition"
          >
            Start Free
            <FiArrowRight />
          </button>

          <button
            onClick={() => navigate("/login")}
            className="px-8 py-4 rounded-2xl border border-slate-700 hover:border-indigo-500 transition"
          >
            Login
          </button>
        </motion.div>

      </section>

      {/* Features */}

      <section className="max-w-7xl mx-auto px-6 pb-24">

        <h2 className="text-4xl font-bold text-center mb-12">
          Everything You Need
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {features.map((feature) => (
            <motion.div
              whileHover={{ y: -6 }}
              key={feature.title}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-8"
            >
              {feature.icon}

              <h3 className="text-2xl font-bold mt-5">
                {feature.title}
              </h3>

              <p className="text-slate-400 mt-3">
                {feature.desc}
              </p>
            </motion.div>
          ))}

        </div>

      </section>

      {/* CTA */}

      <section className="bg-slate-900 py-20">

        <div className="max-w-4xl mx-auto text-center px-6">

          <h2 className="text-4xl font-bold">
            Ready to Crack Your Dream Job?
          </h2>

          <p className="text-slate-400 mt-4">
            Join InterviewAI today and start practicing with AI-powered
            interview simulations.
          </p>

          <button
            onClick={() => navigate("/signup")}
            className="mt-8 px-10 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-indigo-500 hover:scale-105 transition"
          >
            Create Free Account
          </button>

        </div>

      </section>

      {/* Footer */}

      <footer className="border-t border-slate-800 py-8 text-center text-slate-500">
        © 2026 InterviewAI • Built with React, Firebase & AI
      </footer>

    </div>
  );
}