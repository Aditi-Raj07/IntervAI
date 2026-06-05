import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

import { motion, AnimatePresence } from "framer-motion";

import {
  FiArrowLeft,
  FiSend,
  FiSquare,
  FiCpu,
  FiUser,
  FiVolume2,
  FiVolumeX,
  FiAward,
  FiClock,
  FiActivity,
  FiZap,
  FiCheckCircle,
  FiTrendingUp,
} from "react-icons/fi";

// API BASE URL
const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";

// THEMES
const LEVEL_THEMES = {
  easy: {
    accent: "from-emerald-400 to-teal-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
  },

  medium: {
    accent: "from-indigo-400 to-blue-500",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    text: "text-indigo-400",
  },

  hard: {
    accent: "from-rose-500 to-orange-500",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    text: "text-rose-400",
  },
};

export default function Interview() {
  const { mode, level } = useParams();

  const navigate = useNavigate();

  const theme =
    LEVEL_THEMES[level] ||
    LEVEL_THEMES.easy;

  const [messages, setMessages] =
    useState([]);

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [ended, setEnded] =
    useState(false);

  const [score, setScore] =
    useState(null);

  const [isMuted, setIsMuted] =
    useState(false);

  const [speechRate, setSpeechRate] =
    useState(1);

  const bottomRef = useRef(null);

  // ==========================
  // STOP SPEAKING
  // ==========================
  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
  };

  // ==========================
  // SPEAK TEXT
  // ==========================
  const speakText = (text) => {
    if (isMuted || ended) return;

    const utterance =
      new SpeechSynthesisUtterance(text);

    utterance.rate = speechRate;
    utterance.lang = "en-US";

    window.speechSynthesis.cancel();

    window.speechSynthesis.speak(
      utterance
    );
  };

  // ==========================
  // AUTO START
  // ==========================
  useEffect(() => {
    startInterview();

    return () => {
      stopSpeaking();
    };
  }, []);

  // ==========================
  // AUTO SCROLL
  // ==========================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // ==========================
  // START INTERVIEW
  // ==========================
  const startInterview = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        `${API_BASE}/api/interview/chat`,
        {
          messages: [],
          mode,
          level,
        }
      );

      const reply = res.data.reply;

      setMessages([
        {
          role: "assistant",
          content: reply,
        },
      ]);

      speakText(reply);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // SEND MESSAGE
  // ==========================
  const sendMessage = async () => {
    if (!input.trim() || ended) return;

    const updatedMessages = [
      ...messages,
      {
        role: "user",
        content: input,
      },
    ];

    setMessages(updatedMessages);

    const currentInput = input;

    setInput("");

    setLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE}/api/interview/chat`,
        {
          messages: updatedMessages,
          mode,
          level,
        }
      );

      const reply = res.data.reply;

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: reply,
        },
      ]);

      speakText(reply);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // END INTERVIEW
  // ==========================
  const endInterview = async () => {
    if (ended) return;

    stopSpeaking();

    setLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE}/api/interview/chat`,
        {
          messages: [
            ...messages,
            {
              role: "user",
              content: "END_INTERVIEW",
            },
          ],
          mode,
          level,
        }
      );

      const reply = res.data.reply;

      const match =
        reply.match(/(\d+)\s*\/\s*10/);

      if (match) {
        setScore(parseInt(match[1]));
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply,
        },
      ]);

      speakText(reply);

      setEnded(true);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // BACK
  // ==========================
  const handleBack = () => {
    stopSpeaking();
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-white overflow-hidden relative">

      {/* GRID BACKGROUND */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* GLOW */}
      <div
        className={`absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] ${theme.bg} blur-[140px] rounded-full`}
      />

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-slate-800/60 bg-[#090d16]/70 backdrop-blur-md">

        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-4">

            <button
              onClick={handleBack}
              className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition"
            >
              <FiArrowLeft />
            </button>

            <div>
              <h1 className="text-xl font-bold capitalize">
                {mode} Interview
              </h1>

              <div className="flex items-center gap-2 mt-1">

                <span
                  className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-md ${theme.bg} ${theme.border} border ${theme.text} font-bold`}
                >
                  {level}
                </span>

                <span className="text-xs text-slate-500">
                  AI Interview Session
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">

            {/* VOICE */}
            <button
              onClick={() =>
                setIsMuted(!isMuted)
              }
              className={`w-11 h-11 rounded-xl border flex items-center justify-center transition ${
                isMuted
                  ? "bg-red-500/10 border-red-500/20 text-red-400"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {isMuted ? (
                <FiVolumeX />
              ) : (
                <FiVolume2 />
              )}
            </button>

            {/* SPEED */}
            <select
              value={speechRate}
              onChange={(e) =>
                setSpeechRate(
                  parseFloat(
                    e.target.value
                  )
                )
              }
              className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none"
            >
              <option value={0.8}>
                Slow
              </option>

              <option value={1}>
                Normal
              </option>

              <option value={1.3}>
                Fast
              </option>
            </select>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* CHAT */}
        <section
          className={`${
            score !== null
              ? "lg:col-span-8"
              : "lg:col-span-12"
          } flex flex-col bg-slate-900/30 border border-slate-800/60 rounded-3xl overflow-hidden h-[82vh]`}
        >

          {/* TOP BAR */}
          <div className="px-6 py-4 border-b border-slate-800/60 flex items-center justify-between bg-slate-950/40">

            <div className="flex items-center gap-3">

              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${theme.accent} flex items-center justify-center text-[#090d16]`}
              >
                <FiCpu className="text-xl" />
              </div>

              <div>
                <h2 className="font-bold">
                  AI Interviewer
                </h2>

                <p className="text-xs text-slate-500">
                  Real-time interview simulation
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <FiActivity />
              Live Session
            </div>
          </div>

          {/* CHAT AREA */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">

            <AnimatePresence>

              {messages.map((msg, index) => {
                const isUser =
                  msg.role === "user";

                return (
                  <motion.div
                    key={index}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.3,
                    }}
                    className={`flex ${
                      isUser
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >

                    <div
                      className={`max-w-[80%] rounded-3xl px-5 py-4 border shadow-xl ${
                        isUser
                          ? `bg-gradient-to-r ${theme.accent} text-[#090d16] border-white/10 rounded-br-md`
                          : "bg-slate-950/80 border-slate-800/60 rounded-bl-md text-slate-300"
                      }`}
                    >

                      {/* HEADER */}
                      <div className="flex items-center gap-2 mb-2">

                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center ${
                            isUser
                              ? "bg-black/10"
                              : `${theme.bg} ${theme.text}`
                          }`}
                        >
                          {isUser ? (
                            <FiUser size={14} />
                          ) : (
                            <FiCpu size={14} />
                          )}
                        </div>

                        <span className="text-xs uppercase tracking-widest font-bold">
                          {isUser
                            ? "Candidate"
                            : "AI"}
                        </span>
                      </div>

                      {/* CONTENT */}
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* LOADING */}
            {loading && (
              <div className="flex justify-start">

                <div className="bg-slate-950/80 border border-slate-800/60 rounded-3xl rounded-bl-md px-5 py-4 flex items-center gap-3">

                  <div
                    className={`w-8 h-8 rounded-full ${theme.bg} flex items-center justify-center ${theme.text}`}
                  >
                    <FiCpu />
                  </div>

                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
                    <span
                      className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"
                      style={{
                        animationDelay:
                          "0.2s",
                      }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"
                      style={{
                        animationDelay:
                          "0.4s",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* INPUT */}
          <div className="p-5 border-t border-slate-800/60 bg-slate-950/40">

            {!ended ? (
              <div className="flex gap-3">

                {/* INPUT */}
                <div className="relative flex-1">

                  <input
                    value={input}
                    onChange={(e) =>
                      setInput(
                        e.target.value
                      )
                    }
                    placeholder="Type your answer..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-5 pr-14 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      sendMessage()
                    }
                  />

                  <button
                    onClick={sendMessage}
                    disabled={!input.trim()}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-gradient-to-r ${theme.accent} flex items-center justify-center text-[#090d16] hover:scale-105 transition disabled:opacity-50`}
                  >
                    <FiSend />
                  </button>
                </div>

                {/* END */}
                <button
                  onClick={endInterview}
                  className="px-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition font-semibold flex items-center gap-2"
                >
                  <FiSquare />
                  End
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center">

                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-5 py-3 rounded-2xl">
                  <FiCheckCircle />
                  Interview Completed
                </div>
              </div>
            )}
          </div>
        </section>

        {/* SIDEBAR */}
        {score !== null && (
          <aside className="lg:col-span-4 space-y-5">

            {/* SCORE */}
            <div className="bg-slate-900/30 border border-slate-800/60 rounded-3xl p-6">

              <div className="flex items-center gap-3 mb-6">

                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${theme.accent} flex items-center justify-center text-[#090d16]`}
                >
                  <FiAward />
                </div>

                <div>
                  <h2 className="font-bold text-lg">
                    Performance Score
                  </h2>

                  <p className="text-slate-500 text-sm">
                    AI Evaluation Metrics
                  </p>
                </div>
              </div>

              {/* SCORE NUMBER */}
              <div className="text-center py-8">

                <h1
                  className={`text-7xl font-black bg-gradient-to-r ${theme.accent} bg-clip-text text-transparent`}
                >
                  {score}/10
                </h1>

                <p className="text-slate-400 mt-3">
                  Excellent Performance
                </p>
              </div>

              {/* BAR */}
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">

                <motion.div
                  initial={{
                    width: 0,
                  }}
                  animate={{
                    width: `${score * 10}%`,
                  }}
                  transition={{
                    duration: 1,
                  }}
                  className={`h-full bg-gradient-to-r ${theme.accent}`}
                />
              </div>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 gap-4">

              <div className="bg-slate-900/30 border border-slate-800/60 rounded-2xl p-5 text-center">

                <div
                  className={`w-12 h-12 mx-auto rounded-xl ${theme.bg} flex items-center justify-center ${theme.text} mb-3`}
                >
                  <FiZap />
                </div>

                <h3 className="text-xl font-bold">
                  {messages.length}
                </h3>

                <p className="text-slate-500 text-xs">
                  Responses
                </p>
              </div>

              <div className="bg-slate-900/30 border border-slate-800/60 rounded-2xl p-5 text-center">

                <div
                  className={`w-12 h-12 mx-auto rounded-xl ${theme.bg} flex items-center justify-center ${theme.text} mb-3`}
                >
                  <FiClock />
                </div>

                <h3 className="text-xl font-bold capitalize">
                  {level}
                </h3>

                <p className="text-slate-500 text-xs">
                  Difficulty
                </p>
              </div>
            </div>

            {/* BUTTON */}
            <button
              onClick={handleBack}
              className={`w-full py-4 rounded-2xl bg-gradient-to-r ${theme.accent} text-[#090d16] font-bold hover:scale-[1.02] transition shadow-lg`}
            >
              Return to Dashboard
            </button>
          </aside>
        )}
      </main>
    </div>
  );
}