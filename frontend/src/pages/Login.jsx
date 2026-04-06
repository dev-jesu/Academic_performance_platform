import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await authService.login(email, password);
      const role = data.role;

      if (role === "admin") {
        navigate("/admin-dashboard");
      } else if (role === "mentor") {
        navigate("/mentor-dashboard");
      } else {
        navigate("/student-dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
      {/* Decorative Subtle Gradients */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-100/50 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-100/40 blur-[120px] rounded-full" />

      <div className="max-w-md w-full glass-card p-12 relative z-10 border border-slate-200 shadow-xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/20">
            <span className="text-white font-black text-3xl italic">A</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter uppercase">Academic Sync</h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Sign In</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-8 text-xs font-black uppercase tracking-widest text-center animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-8">
          <div>
            <label className="block text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3 italic">Email Address</label>
            <input
              type="email"
              required
              className="w-full input-field h-14"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3 italic">Password</label>
            <input
              type="password"
              required
              className="w-full input-field h-14"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary h-14 text-sm tracking-widest uppercase font-black"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-slate-100 text-center">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
            Academic Performance Analysis v2.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;