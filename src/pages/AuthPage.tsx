
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import SpeakerButton from "@/components/SpeakerButton";
import ThemeToggle from "@/components/ThemeToggle";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const navigate = useNavigate();
  const speakerText = "Log in to LEXT or create a new account to begin extracting.";

  useEffect(() => {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem("lext_logged_in");
    if (isLoggedIn === "true") {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#43CEA2] via-[#185A9D] to-[#6A1B9A] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="max-w-md w-full">
        <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 dark:border-slate-700/50">
          <div className="flex justify-center items-center gap-3 mb-6">
            <h1 className="text-3xl font-bold text-white dark:text-slate-100">
              LEXT
            </h1>
            <SpeakerButton 
              text={speakerText} 
              className="text-white dark:text-slate-100 hover:text-yellow-300" 
            />
          </div>
          
          <div className="flex rounded-xl bg-white/10 dark:bg-slate-700/30 p-1 mb-6">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                activeTab === "login"
                  ? "bg-white/20 dark:bg-slate-600/50 text-white shadow-md"
                  : "text-white/70 dark:text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                activeTab === "register"
                  ? "bg-white/20 dark:bg-slate-600/50 text-white shadow-md"
                  : "text-white/70 dark:text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              Register
            </button>
          </div>
          
          <div className="min-h-[300px]">
            {activeTab === "login" ? <LoginForm /> : <RegisterForm />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
