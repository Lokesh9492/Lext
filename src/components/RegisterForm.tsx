import { useState } from "react";
import { toast } from "sonner";
import { registerWithEmail } from "@/firebase/auth";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = await registerWithEmail(email, password);
      if (user) {
        toast.success("Account created successfully! You can now log in.");
        // Reset form
        setEmail("");
        setPassword("");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="new-email" className="block text-sm font-medium text-white/90 dark:text-slate-200 mb-2">
          Email
        </label>
        <input
          type="email"
          id="new-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 bg-white/10 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600 rounded-xl text-white dark:text-slate-100 placeholder-white/50 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white/30 dark:focus:ring-slate-500 transition-all duration-300"
          placeholder="Enter your email"
          required
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
