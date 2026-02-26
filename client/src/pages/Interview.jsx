import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function Interview() {
  const { mode, level } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [ended, setEnded] = useState(false);
  const [score, setScore] = useState(null);

  const [isMuted, setIsMuted] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);

  const bottomRef = useRef(null);
  const typingAudioRef = useRef(null);

  // ==========================
  // 🎧 STOP SPEAKING
  // ==========================
  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
  };

  // ==========================
  // 🔊 SPEAK TEXT
  // ==========================
  const speakText = (text) => {
    if (isMuted || ended) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speechRate;
    utterance.lang = "en-US";

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  // ==========================
  // ⌨ Typing Sound
  // ==========================
  const playTypingSound = () => {
    if (!typingAudioRef.current) {
      typingAudioRef.current = new Audio(
        "https://assets.mixkit.co/sfx/preview/mixkit-keyboard-typing-1386.mp3"
      );
    }
    typingAudioRef.current.currentTime = 0;
    typingAudioRef.current.play();
  };

  // ==========================
  // AUTO START INTERVIEW
  // ==========================
  useEffect(() => {
    startInterview();

    return () => {
      stopSpeaking(); // Stop voice if user leaves page
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startInterview = async () => {
    setLoading(true);

  const res = await axios.post(
  "https://interv-ai-wb2v.vercel.app/api/interview/chat",
  { messages: [], mode, level }
);

    setMessages([{ role: "assistant", content: res.data.reply }]);
    speakText(res.data.reply);
    setLoading(false);
  };

  // ==========================
  // SEND MESSAGE
  // ==========================
  const sendMessage = async () => {
    if (!input.trim() || ended) return;

    playTypingSound();

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

    speakText(reply);
    setLoading(false);
  };

  // ==========================
  // END INTERVIEW
  // ==========================
  const endInterview = async () => {
    if (ended) return;

    stopSpeaking(); // 🔴 stop voice instantly

    setLoading(true);

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
    if (match) setScore(parseInt(match[1]));

    setMessages([
      ...messages,
      { role: "assistant", content: reply },
    ]);

    speakText(reply);

    setEnded(true);
    setLoading(false);
  };

  // ==========================
  // BACK BUTTON
  // ==========================
  const handleBack = () => {
    stopSpeaking();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-pink-600 flex flex-col text-white">

      {/* HEADER */}
      <div className="bg-black/30 p-4 flex justify-between items-center">

        <div>
          AI Interview - {mode} ({level})
        </div>

        <div className="flex gap-4 items-center">

          {/* 🔈 Mute Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="bg-white text-black px-3 py-1 rounded-lg"
          >
            {isMuted ? "🔇 Muted" : "🔊 Sound"}
          </button>

          {/* 🎚 Speech Speed */}
          <select
            value={speechRate}
            onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
            className="text-black rounded-lg px-2 py-1"
          >
            <option value={0.8}>Slow</option>
            <option value={1}>Normal</option>
            <option value={1.3}>Fast</option>
          </select>

          {/* 🔙 Back */}
          <button
            onClick={handleBack}
            className="bg-red-500 px-4 py-1 rounded-lg"
          >
            Back
          </button>
        </div>
      </div>

      {/* CHAT */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] px-4 py-3 rounded-2xl shadow-md ${
                msg.role === "user"
                  ? "bg-indigo-600"
                  : "bg-gray-200 text-black"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && <div>AI is typing...</div>}

        <div ref={bottomRef}></div>
      </div>

      {/* SCORE */}
      {score !== null && (
        <div className="bg-white text-black p-6 text-center">
          Final Score: {score}/10
        </div>
      )}

      {/* INPUT */}
      {!ended && (
        <div className="bg-black/30 p-4 flex gap-2">

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={ended}
            placeholder="Type your answer clearly and confidently..."
            className="flex-1 p-3 rounded-lg text-black"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button
            onClick={sendMessage}
            className="bg-indigo-600 px-6 rounded-lg"
          >
            Send
          </button>

          <button
            onClick={endInterview}
            className="bg-red-600 px-6 rounded-lg"
          >
            End
          </button>
        </div>
      )}
    </div>
  );
}
