
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("lext_logged_in");
    if (isLoggedIn !== "true") {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("lext_logged_in");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#43CEA2] via-[#185A9D] to-[#6A1B9A] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 dark:border-slate-700/50">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white dark:text-slate-100">
              LEXT Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-white rounded-lg transition-all duration-300"
            >
              Logout
            </button>
          </div>
          
          <div className="text-center py-16">
            <h2 className="text-2xl text-white/90 dark:text-slate-200 mb-4">
              Welcome to your Dashboard!
            </h2>
            <p className="text-white/70 dark:text-slate-300">
              Document extraction features coming soon...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
