import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { FaBolt, FaMicrophone, FaStop, FaTrophy, FaBrain, FaRedo, FaCheckCircle } from "react-icons/fa";

export default function RapidFire() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const level = queryParams.get("level");

  // Game State
  const [question, setQuestion] = useState("Get Ready...");
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(60); // 60 seconds per question
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // New State for Game Loop
  const [questionIndex, setQuestionIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [sessionHistory, setSessionHistory] = useState([]); // Stores {q, a, score}
  
  // Ref for speech recognition
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join('');
        setInput(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) return alert("Speech recognition not supported in this browser.");
    
    if (isListening) {
      // STOP MIC: Automatically submit answer
      recognitionRef.current.stop();
      setIsListening(false);
      submitAnswer(); 
    } else {
      // START MIC
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  // Timer Effect: Handles countdown and Auto-Submit if time runs out
  useEffect(() => {
    if (gameOver) return; // Stop timer if game is over

    if (time === 0) {
      submitAnswer(); 
    }

    const timer = setTimeout(() => {
      setTime(time - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [time, gameOver]);

  const fetchQuestion = async () => {
    setLoading(true);
    setInput("");
    // Stop mic if it was running from previous question
    if(recognitionRef.current) recognitionRef.current.stop();
    setIsListening(false);

    try {
      // We send the index to the backend to ensure unique questions
      const res = await axios.post(
        "http://localhost:5000/api/interview/chat",
        {
          messages: [{ 
            role: "assistant", 
            content: `Ask a unique rapid fire question (Question ${questionIndex + 1} of 10). Do not repeat questions.` 
          }],
          mode: "rapid",
          level,
        }
      );
      
      const newQuestion = res.data.reply;
      
      // Simple duplicate check (optional safety net)
      if (newQuestion === question && questionIndex > 0) {
        fetchQuestion(); // Retry if duplicate
        return;
      }

      setQuestion(newQuestion);
    } catch (error) {
      console.error("Error fetching question", error);
      setQuestion("Could not load question. Retrying...");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = () => {
    // 1. Save history
    const currentEntry = {
      q: question,
      a: input || "(No Answer)",
    };
    setSessionHistory(prev => [...prev, currentEntry]);

    // 2. Update Score (Simple logic: +1 for every attempt, or you could validate answer here)
    setScore(score + 1);

    // 3. Check Game Over Condition (10 Questions)
    if (questionIndex + 1 >= 10) {
      setGameOver(true);
    } else {
      // 4. Next Question
      setQuestionIndex(prev => prev + 1);
      setTime(60); // Reset timer
      fetchQuestion();
    }
  };

  const resetGame = () => {
    setScore(0);
    setQuestionIndex(0);
    setSessionHistory([]);
    setGameOver(false);
    setTime(60);
    fetchQuestion();
  };

  // Helper for Digital Timer Format
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const timerColorClass = time <= 10 ? 'text-red-500 animate-pulse' : 'text-cyan-400';

  // --- RESULT SCREEN COMPONENT ---
  if (gameOver) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center relative overflow-hidden font-sans">
        {/* Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000"></div>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl max-w-2xl w-full text-center relative z-10">
          <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 shadow-lg shadow-orange-500/30">
            <FaTrophy className="text-4xl text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Mission Complete!
          </h1>
          <p className="text-slate-400 mb-8 text-lg">Here is your performance summary</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
              <div className="text-slate-400 text-sm uppercase tracking-wider mb-1">Final Score</div>
              <div className="text-4xl font-mono font-bold text-yellow-400">{score} / 10</div>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
              <div className="text-slate-400 text-sm uppercase tracking-wider mb-1">Level</div>
              <div className="text-4xl font-mono font-bold text-cyan-400">{level || 'Mixed'}</div>
            </div>
          </div>

          {/* Scrollable History */}
          <div className="bg-slate-900/50 rounded-2xl p-4 max-h-60 overflow-y-auto mb-8 border border-white/5 text-left">
            <h3 className="text-sm font-bold text-slate-300 mb-3 sticky top-0 bg-slate-900/90 py-1 border-b border-white/10">Session Log</h3>
            {sessionHistory.map((item, idx) => (
              <div key={idx} className="mb-3 last:mb-0">
                <p className="text-xs text-cyan-400 font-bold mb-1">Q{idx + 1}: {item.q}</p>
                <p className="text-sm text-slate-300 italic pl-2 border-l-2 border-slate-700">"{item.a}"</p>
              </div>
            ))}
          </div>

          <button 
            onClick={resetGame}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl font-bold text-lg shadow-lg shadow-purple-500/25 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <FaRedo /> Play Again
          </button>
        </div>
      </div>
    );
  }

  // --- MAIN GAME SCREEN ---
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center relative overflow-hidden font-sans selection:bg-purple-500 selection:text-white">
      
      {/* Background Ambient Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header / Stats Bar */}
      <div className="w-full max-w-4xl px-6 py-4 flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          <FaBolt className="text-yellow-400 animate-pulse" />
          <span className="font-bold tracking-wider text-sm uppercase">Rapid Fire</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-slate-800/80 px-4 py-2 rounded-full border border-slate-700">
            <span className="text-xs text-gray-400 uppercase">Progress</span>
            <span className="font-bold text-cyan-400">{questionIndex + 1}/10</span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-800/80 px-4 py-2 rounded-full border border-slate-700">
            <FaTrophy className="text-yellow-500" />
            <span className="font-mono text-xl font-bold">{score}</span>
          </div>
        </div>
      </div>

      {/* Main Game Card */}
      <div className="relative w-full max-w-3xl bg-slate-800/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-purple-500/20">
        
        <div className="p-8 md:p-12 flex flex-col items-center text-center">
          
          {/* Digital Timer Display */}
          <div className="mb-8">
            <div className={`text-7xl md:text-8xl font-mono font-black tracking-tighter ${timerColorClass} drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]`}>
              {formatTime(time)}
            </div>
            <div className="text-slate-500 text-sm uppercase tracking-widest mt-2">
              {isListening ? "Listening... (Click Stop to Submit)" : "Time Remaining"}
            </div>
          </div>

          {/* Question Area */}
          <div className="mb-8 min-h-[120px] flex items-center justify-center">
            {loading ? (
              <div className="flex flex-col items-center space-y-3">
                <FaBrain className="text-4xl text-purple-500 animate-bounce" />
                <p className="text-slate-400 animate-pulse">Generating Challenge...</p>
              </div>
            ) : (
              <h2 className="text-2xl md:text-4xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                {question}
              </h2>
            )}
          </div>

          {/* Input Area */}
          <div className="w-full relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-slate-900 rounded-2xl p-2 border border-slate-700">
              
              <textarea
                className="w-full bg-transparent text-white p-4 focus:outline-none resize-none h-24 md:h-32 placeholder-slate-500 font-mono"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? "Listening..." : "Type your answer or use the mic..."}
                disabled={loading || isListening} // Disable typing while listening to avoid conflict
              />

              {/* Mic Button */}
              <button
                onClick={toggleMic}
                className={`m-2 p-4 rounded-xl transition-all duration-300 flex items-center justify-center w-16 h-16 ${
                  isListening 
                    ? 'bg-red-500 text-white border border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.6)] scale-110' 
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-transparent'
                }`}
                disabled={loading}
                title={isListening ? "Stop & Submit" : "Start Mic"}
              >
                {isListening ? <FaStop size={24} /> : <FaMicrophone size={24} />}
              </button>
            </div>
            {isListening && (
                <div className="text-center mt-2 text-red-400 text-xs font-bold uppercase tracking-widest animate-pulse">
                    Click Stop Button to Submit Answer
                </div>
            )}
          </div>
          
        </div>
      </div>
      
      {/* Footer Instructions */}
      <div className="mt-8 text-slate-500 text-sm flex items-center space-x-2">
        <span>Powered by AI</span>
        <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
        <span>Stop Mic to Auto-Submit</span>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
