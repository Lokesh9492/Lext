
import { useState } from "react";
import { toast } from "sonner";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate loading delay
    setTimeout(() => {
      // Check if username already exists
      const existingUsername = localStorage.getItem("lext_username");
      if (existingUsername === username) {
        toast.error("Username already exists. Please choose a different one.");
        setIsLoading(false);
        return;
      }

      // Store credentials
      localStorage.setItem("lext_username", username);
      localStorage.setItem("lext_password", password);
      
      toast.success("Account created successfully! You can now log in.");
      
      // Reset form
      setUsername("");
      setPassword("");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="new-username" className="block text-sm font-medium text-white/90 dark:text-slate-200 mb-2">
          Username
        </label>
        <input
          type="text"
          id="new-username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-3 bg-white/10 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600 rounded-xl text-white dark:text-slate-100 placeholder-white/50 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white/30 dark:focus:ring-slate-500 transition-all duration-300"
          placeholder="Choose a username"
          required
          minLength={3}
        />
      </div>
      
      <div>
        <label htmlFor="new-password" className="block text-sm font-medium text-white/90 dark:text-slate-200 mb-2">
          Password
        </label>
        <input
          type="password"
          id="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 bg-white/10 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600 rounded-xl text-white dark:text-slate-100 placeholder-white/50 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white/30 dark:focus:ring-slate-500 transition-all duration-300"
          placeholder="Create a password"
          required
          minLength={6}
        />
      </div>
      
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-[#6A1B9A] to-[#43CEA2] hover:from-[#5A1585] hover:to-[#39B896] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
};

export default RegisterForm;
