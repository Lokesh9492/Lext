
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
    </form>
  );
};

export default LoginForm;
