import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { db, auth } from "../firebase/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function Interview() {
  const { mode, level } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [ended, setEnded] = useState(false);
  const [score, setScore] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);

  const recognitionRef = useRef(null);
  const bottomRef = useRef(null);

  // 🔊 Stop voice
  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
  };

  // 🔊 Speak
  const speakText = (text) => {
    if (isMuted || ended) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speechRate;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  // 🎤 Mic Input
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported");
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognitionRef.current.start();
  };

  // Start Interview
  useEffect(() => {
    startInterview();
    return () => stopSpeaking();
  }, []);

  const startInterview = async () => {
    setLoading(true);

    const res = await axios.post(
      "http://localhost:5000/api/interview/chat",
      { messages: [], mode, level }
    );

    setMessages([{ role: "assistant", content: res.data.reply }]);
    speakText(res.data.reply);
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || ended) return;

    const updatedMessages = [
      ...messages,
      { role: "user", content: input },
    ];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    const res = await axios.post(
      "http://localhost:5000/api/interview/chat",
      { messages: updatedMessages, mode, level }
    );

    const reply = res.data.reply;

    setMessages([
      ...updatedMessages,
      { role: "assistant", content: reply },
    ]);

    setProgress((prev) => Math.min(prev + 20, 100));
    speakText(reply);
    setLoading(false);
  };

  const endInterview = async () => {
    stopSpeaking();

    const res = await axios.post(
      "http://localhost:5000/api/interview/chat",
      {
        messages: [
          ...messages,
          { role: "user", content: "END_INTERVIEW" },
        ],
        mode,
        level,
      }
    );

    const reply = res.data.reply;

    const match = reply.match(/(\d+)\s*\/\s*10/);
    let finalScore = null;
    if (match) {
      finalScore = parseInt(match[1]);
      setScore(finalScore);
    }

    setMessages([...messages, { role: "assistant", content: reply }]);
    speakText(reply);
    setEnded(true);

    // 💾 Save to Firebase
    await addDoc(collection(db, "interviews"), {
      user: auth.currentUser.email,
      mode,
      level,
      score: finalScore,
      createdAt: serverTimestamp(),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-black flex flex-col text-white">

      {/* Header */}
      <div className="p-4 flex justify-between items-center bg-black/30">

        <div>
          🤖 AI Interview - {mode} ({level})
        </div>

        <div className="flex gap-3 items-center">
          <button onClick={() => setIsMuted(!isMuted)}
            className="bg-white text-black px-3 py-1 rounded">
            {isMuted ? "🔇" : "🔊"}
          </button>

          <select
            value={speechRate}
            onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
            className="text-black rounded"
          >
            <option value={0.8}>Slow</option>
            <option value={1}>Normal</option>
            <option value={1.3}>Fast</option>
          </select>

          <button
            onClick={() => {
              stopSpeaking();
              navigate("/");
            }}
            className="bg-red-500 px-4 py-1 rounded"
          >
            Back
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="w-full bg-gray-700 h-2">
        <div
          className="bg-green-400 h-2 transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-4 rounded-xl max-w-[70%] ${
              msg.role === "user"
                ? "bg-indigo-600 ml-auto"
                : "bg-gray-200 text-black"
            }`}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <div className="animate-pulse text-gray-300">
            🤖 AI is typing...
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      {/* Input */}
      {!ended && (
        <div className="p-4 flex gap-2 bg-black/30">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your answer confidently..."
            className="flex-1 p-3 rounded-lg text-black"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button onClick={startListening}
            className="bg-blue-500 px-4 rounded">
            🎤
          </button>

          <button onClick={sendMessage}
            className="bg-indigo-600 px-6 rounded">
            Send
          </button>

          <button onClick={endInterview}
            className="bg-red-600 px-6 rounded">
            End
          </button>
        </div>
      )}

      {score !== null && (
        <div className="bg-white text-black p-6 text-center">
          Final Score: {score}/10
        </div>
      )}
    </div>
  );
}
