
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem("lext_theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("lext_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("lext_theme", "light");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-3 rounded-xl bg-white/10 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600 text-white dark:text-slate-100 hover:bg-white/20 dark:hover:bg-slate-600/50 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/30 dark:focus:ring-slate-500"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default ThemeToggle;
