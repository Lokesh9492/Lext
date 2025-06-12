
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate loading delay
    setTimeout(() => {
      const storedUsername = localStorage.getItem("lext_username");
      const storedPassword = localStorage.getItem("lext_password");

      if (storedUsername === username && storedPassword === password) {
        localStorage.setItem("lext_logged_in", "true");
        toast.success("Login successful! Welcome back to LEXT.");
        navigate("/dashboard");
      } else {
        toast.error("Invalid credentials. Please check your username and password.");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleGoogleSignIn = () => {
    // Placeholder for Google sign-in
    toast.info("Google sign-in will be available once Firebase is configured.");
    // For demo purposes, simulate successful login
    localStorage.setItem("lext_logged_in", "true");
    localStorage.setItem("lext_username", "Google User");
    navigate("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-white/90 dark:text-slate-200 mb-2">
          Username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-3 bg-white/10 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600 rounded-xl text-white dark:text-slate-100 placeholder-white/50 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white/30 dark:focus:ring-slate-500 transition-all duration-300"
          placeholder="Enter your username"
          required
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-white/90 dark:text-slate-200 mb-2">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 bg-white/10 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600 rounded-xl text-white dark:text-slate-100 placeholder-white/50 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white/30 dark:focus:ring-slate-500 transition-all duration-300"
          placeholder="Enter your password"
          required
        />
      </div>
      
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-[#43CEA2] to-[#185A9D] hover:from-[#39B896] hover:to-[#1A4C87] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/20"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-transparent text-white/70">or</span>
        </div>
      </div>
      
      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span>Continue with Google</span>
      </button>
    </form>
  );
};

export default LoginForm;
