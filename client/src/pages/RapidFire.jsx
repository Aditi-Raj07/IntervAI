import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";

import {
  FiZap,
  FiMic,
  FiSquare,
  FiAward,
  FiCpu,
  FiRotateCcw,
  FiCheckCircle,
  FiArrowLeft,
  FiTrendingUp,
  FiClock,
  FiActivity,
} from "react-icons/fi";

// API
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

export default function RapidFire() {
  const location = useLocation();

  const navigate = useNavigate();

  const queryParams = new URLSearchParams(
    location.search
  );

  const level =
    queryParams.get("level") || "easy";

  const theme =
    LEVEL_THEMES[level] ||
    LEVEL_THEMES.easy;

  // STATES
  const [question, setQuestion] =
    useState("Loading...");

  const [input, setInput] =
    useState("");

  const [score, setScore] =
    useState(0);

  const [time, setTime] =
    useState(60);

  const [loading, setLoading] =
    useState(false);

  const [isListening, setIsListening] =
    useState(false);

  const [questionIndex, setQuestionIndex] =
    useState(0);

  const [gameOver, setGameOver] =
    useState(false);

  const [sessionHistory, setSessionHistory] =
    useState([]);

  const recognitionRef = useRef(null);

  // ==========================
  // INIT SPEECH RECOGNITION
  // ==========================
  useEffect(() => {
    if (
      "webkitSpeechRecognition" in window ||
      "SpeechRecognition" in window
    ) {
      const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

      recognitionRef.current =
        new SpeechRecognition();

      recognitionRef.current.continuous =
        true;

      recognitionRef.current.interimResults =
        true;

      recognitionRef.current.lang =
        "en-US";

      recognitionRef.current.onresult = (
        event
      ) => {
        const transcript = Array.from(
          event.results
        )
          .map((result) => result[0])
          .map(
            (result) => result.transcript
          )
          .join("");

        setInput(transcript);
      };

      recognitionRef.current.onend =
        () => {
          setIsListening(false);
        };
    }
  }, []);

  // ==========================
  // FETCH QUESTION
  // ==========================
  useEffect(() => {
    fetchQuestion();
  }, []);

  // ==========================
  // TIMER
  // ==========================
  useEffect(() => {
    if (gameOver) return;

    if (time === 0) {
      submitAnswer();
    }

    const timer = setTimeout(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [time, gameOver]);

  // ==========================
  // MIC TOGGLE
  // ==========================
  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert(
        "Speech Recognition not supported"
      );

      return;
    }

    if (isListening) {
      recognitionRef.current.stop();

      setIsListening(false);

      submitAnswer();

    } else {
      recognitionRef.current.start();

      setIsListening(true);
    }
  };

  // ==========================
  // FETCH QUESTION
  // ==========================
  const fetchQuestion = async () => {
    setLoading(true);

    setInput("");

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    setIsListening(false);

    try {
      const res = await axios.post(
        `${API_BASE}/api/interview/chat`,
        {
          messages: [
            {
              role: "assistant",
              content: `Ask unique rapid fire question ${
                questionIndex + 1
              } of 10`,
            },
          ],

          mode: "rapid",

          level,
        }
      );

      setQuestion(res.data.reply);

    } catch (error) {
      console.error(error);

      setQuestion(
        "Could not load question."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // SUBMIT ANSWER
  // ==========================
 const submitAnswer = async () => {
  try {
    setLoading(true);

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const userAnswer =
      input.trim() || "No Answer";

    const currentEntry = {
      q: question,
      a: userAnswer,
    };

    // STRICT AI EVALUATION
    const evaluationPrompt = `
You are a STRICT technical interviewer.

Question:
${question}

Candidate Answer:
${userAnswer}

Evaluate VERY STRICTLY.

Rules:
- Correct answer = high score
- Partial answer = medium score
- Wrong answer = low score
- Empty answer = 0
- Do NOT be generous
- Technical accuracy matters most

Return ONLY in this format:

Score: X/10
Correctness: Correct/Partial/Wrong
Feedback: short feedback
Ideal Answer: short ideal answer
`;

    const res = await axios.post(
      `${API_BASE}/api/interview/chat`,
      {
        messages: [
          {
            role: "user",
            content: evaluationPrompt,
          },
        ],

        mode: "rapid",
        level,
      }
    );

    const aiReply = res.data.reply;

    // SCORE EXTRACTION
    const match =
      aiReply.match(/Score:\s*(\d+)/i);

    const earnedScore = match
      ? parseInt(match[1])
      : 0;

    // UPDATE TOTAL SCORE
    setScore((prev) => prev + earnedScore);

    // SAVE HISTORY
    setSessionHistory((prev) => [
      ...prev,
      {
        ...currentEntry,
        feedback: aiReply,
        earnedScore,
      },
    ]);

    // GAME OVER
    if (questionIndex + 1 >= 10) {
      setGameOver(true);

      // CELEBRATION SOUND
      const audio = new Audio(
        "https://actions.google.com/sounds/v1/cartoon/concussive_hit_guitar_boing.ogg"
      );

      audio.play();

    } else {
      setQuestionIndex((prev) => prev + 1);

      setTime(60);

      fetchQuestion();
    }

  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  // ==========================
  // RESET
  // ==========================
  const resetGame = () => {
    setScore(0);

    setQuestionIndex(0);

    setSessionHistory([]);

    setGameOver(false);

    setTime(60);

    fetchQuestion();
  };

  // ==========================
  // FORMAT TIME
  // ==========================
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);

    const secs = seconds % 60;

    return `${mins
      .toString()
      .padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // ==========================
  // RESULT SCREEN
  // ==========================
  if (gameOver) {
    return (
      <div className="min-h-screen bg-[#090d16] text-white overflow-hidden relative">

        {/* GRID */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        {/* GLOW */}
        <div
          className={`absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] ${theme.bg} blur-[140px] rounded-full`}
        />

        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="w-full max-w-3xl bg-slate-900/30 border border-slate-800/60 rounded-3xl backdrop-blur-xl p-8"
          >

            {/* HEADER */}
            <div className="text-center mb-10">

              <div
                className={`w-24 h-24 mx-auto rounded-3xl bg-gradient-to-r ${theme.accent} flex items-center justify-center text-[#090d16] shadow-2xl mb-6`}
              >
                <FiAward className="text-5xl" />
              </div>

              <h1 className="text-5xl font-black mb-3">
                Rapid Fire Complete
              </h1>

              <p className="text-slate-400 text-lg">
                AI Session Summary &
                Performance Metrics
              </p>
            </div>

            {/* SCORE */}
            <div className="grid md:grid-cols-2 gap-5 mb-8">

              <div className="bg-slate-950/60 border border-slate-800 rounded-3xl p-6 text-center">

                <div
                  className={`w-14 h-14 mx-auto rounded-2xl ${theme.bg} flex items-center justify-center ${theme.text} mb-4`}
                >
                  <FiTrendingUp className="text-2xl" />
                </div>

                <h2
                  className={`text-6xl font-black bg-gradient-to-r ${theme.accent} bg-clip-text text-transparent`}
                >
                  {score}/10
                </h2>

                <p className="text-slate-500 mt-2">
                  Final Score
                </p>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 rounded-3xl p-6 text-center">

                <div
                  className={`w-14 h-14 mx-auto rounded-2xl ${theme.bg} flex items-center justify-center ${theme.text} mb-4`}
                >
                  <FiActivity className="text-2xl" />
                </div>

                <h2 className="text-5xl font-black capitalize">
                  {level}
                </h2>

                <p className="text-slate-500 mt-2">
                  Difficulty
                </p>
              </div>
            </div>

            {/* HISTORY */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-3xl p-5 max-h-72 overflow-y-auto mb-8">

              <h3 className="font-bold text-lg mb-5">
                Session Logs
              </h3>

              <div className="space-y-4">

                {sessionHistory.map(
                  (item, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4"
                    >

                      <p
                        className={`${theme.text} font-bold text-sm mb-2`}
                      >
                        Q{idx + 1}:{" "}
                        {item.q}
                      </p>

                      <p className="text-slate-300 text-sm italic border-l-2 border-slate-700 pl-3">
                        "{item.a}"
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* BUTTONS */}
            <div className="grid md:grid-cols-2 gap-4">

              <button
                onClick={resetGame}
                className={`py-4 rounded-2xl bg-gradient-to-r ${theme.accent} text-[#090d16] font-bold hover:scale-[1.02] transition flex items-center justify-center gap-2`}
              >
                <FiRotateCcw />
                Play Again
              </button>

              <button
                onClick={() =>
                  navigate("/home")
                }
                className="py-4 rounded-2xl bg-slate-900 border border-slate-800 text-white hover:bg-slate-800 transition flex items-center justify-center gap-2"
              >
                <FiArrowLeft />
                Dashboard
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ==========================
  // MAIN SCREEN
  // ==========================
  return (
    <div className="min-h-screen bg-[#090d16] text-white overflow-hidden relative">

      {/* GRID */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem]" />

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
              onClick={() =>
                navigate("/home")
              }
              className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition"
            >
              <FiArrowLeft />
            </button>

            <div>

              <div className="flex items-center gap-2">

                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-r ${theme.accent} flex items-center justify-center text-[#090d16]`}
                >
                  <FiZap className="text-xl" />
                </div>

                <div>
                  <h1 className="text-xl font-bold">
                    Rapid Fire
                  </h1>

                  <p className="text-xs text-slate-500">
                    AI Speed Interview
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">

            <div
              className={`px-4 py-2 rounded-xl ${theme.bg} ${theme.border} border ${theme.text} text-sm font-bold uppercase`}
            >
              {level}
            </div>

            <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold">
              {questionIndex + 1}/10
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="relative z-10 min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-10">

        <div className="w-full max-w-5xl">

          {/* TIMER */}
          <div className="text-center mb-10">

            <div
              className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-900 border border-slate-800 mb-5`}
            >
              <FiClock
                className={`${theme.text}`}
              />

              <span className="text-slate-400 uppercase tracking-widest text-sm">
                Remaining Time
              </span>
            </div>

            <motion.h1
              key={time}
              initial={{
                scale: 0.9,
                opacity: 0.5,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              className={`text-8xl md:text-9xl font-black ${
                time <= 10
                  ? "text-red-500"
                  : theme.text
              }`}
            >
              {formatTime(time)}
            </motion.h1>
          </div>

          {/* QUESTION CARD */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="bg-slate-900/30 border border-slate-800/60 rounded-3xl p-8 md:p-12 backdrop-blur-xl"
          >

            {/* QUESTION */}
            <div className="text-center mb-10 min-h-[140px] flex items-center justify-center">

              {loading ? (
                <div className="flex flex-col items-center">

                  <div
                    className={`w-20 h-20 rounded-3xl ${theme.bg} flex items-center justify-center ${theme.text} animate-pulse mb-5`}
                  >
                    <FiCpu className="text-4xl" />
                  </div>

                  <p className="text-slate-400 text-lg">
                    Generating Question...
                  </p>
                </div>
              ) : (
                <h2 className="text-3xl md:text-5xl font-black leading-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                  {question}
                </h2>
              )}
            </div>

            {/* INPUT */}
            <div className="relative">

              <div className="relative bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden">

                <textarea
                  value={input}
                  onChange={(e) =>
                    setInput(
                      e.target.value
                    )
                  }
                  placeholder={
                    isListening
                      ? "Listening..."
                      : "Type your answer or use microphone..."
                  }
                  disabled={
                    loading ||
                    isListening
                  }
                  className="w-full bg-transparent p-6 text-white placeholder-slate-500 focus:outline-none resize-none h-40 text-lg"
                />

                {/* BUTTONS */}
                <div className="flex items-center justify-between px-5 py-4 border-t border-slate-800">

                  <div className="flex items-center gap-3">

                    {/* MIC */}
                    <button
                      onClick={toggleMic}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        isListening
                          ? "bg-red-500 text-white scale-110 shadow-2xl shadow-red-500/30"
                          : `bg-gradient-to-r ${theme.accent} text-[#090d16]`
                      }`}
                    >
                      {isListening ? (
                        <FiSquare className="text-xl" />
                      ) : (
                        <FiMic className="text-xl" />
                      )}
                    </button>

                    <div>
                      <p className="font-semibold">
                        {isListening
                          ? "Listening..."
                          : "Voice Input"}
                      </p>

                      <p className="text-xs text-slate-500">
                        {isListening
                          ? "Stop mic to submit"
                          : "Click mic to answer"}
                      </p>
                    </div>
                  </div>

                  {/* SUBMIT */}
                  <button
                    onClick={submitAnswer}
                    className={`px-8 py-4 rounded-2xl bg-gradient-to-r ${theme.accent} text-[#090d16] font-black hover:scale-[1.02] transition flex items-center gap-2`}
                  >
                    <FiCheckCircle />
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* FOOTER */}
          <div className="mt-8 flex items-center justify-center gap-4 text-slate-500 text-sm">

            <span>
              AI Powered Evaluation
            </span>

            <span className="w-1 h-1 rounded-full bg-slate-600" />

            <span>
              10 Questions Challenge
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}