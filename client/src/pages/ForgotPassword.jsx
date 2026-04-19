// client/src/pages/ForgotPassword.jsx
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate, Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleReset = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-4">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl p-10 w-full max-w-md text-center">
        
        <h2 className="text-3xl font-bold text-white mb-2">Forgot Password?</h2>
        <p className="text-white/70 mb-8">
          Enter your email and we'll send you a link to reset your password
        </p>

        {success ? (
          <div className="text-green-400 text-lg mb-6">
            ✅ Reset link sent successfully!<br />
            Please check your email (including spam folder).
          </div>
        ) : (
          <>
            <div className="mb-6 text-left">
              <label className="text-white text-sm block mb-1">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            {error && <p className="text-red-400 mb-4 text-sm">{error}</p>}

            <button
              onClick={handleReset}
              disabled={loading}
              className="w-full bg-pink-500 hover:bg-pink-600 transition py-3 rounded-xl text-white font-semibold disabled:opacity-50"
            >
              {loading ? "Sending Reset Link..." : "Send Password Reset Link"}
            </button>
          </>
        )}

        <p className="text-white/70 text-sm mt-8">
          <Link to="/login" className="text-pink-300 hover:underline">
            ← Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}