import { Link, useNavigate } from "react-router-dom";
import { LogOut, Settings } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { logoutUser } from "@/firebase/auth";
import { toast } from "sonner";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  return (
    <nav className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-lg border-b border-white/20 dark:border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="text-2xl font-bold text-white dark:text-slate-100">
              LEXT
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link
                to="/dashboard"
                className="text-white/90 dark:text-slate-200 hover:text-white dark:hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/documents"
                className="text-white/90 dark:text-slate-200 hover:text-white dark:hover:text-white transition-colors"
              >
                My Documents
              </Link>
              <Link
                to="/settings"
                className="text-white/90 dark:text-slate-200 hover:text-white dark:hover:text-white transition-colors"
              >
                Settings
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link
              to="/settings"
              className="p-3 rounded-xl bg-white/10 dark:bg-slate-700/50 border border-white/20 dark:border-slate-600 text-white dark:text-slate-100 hover:bg-white/20 dark:hover:bg-slate-600/50 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/30 dark:focus:ring-slate-500"
              title="Settings"
            >
              <Settings size={20} />
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-white rounded-lg transition-all duration-300"
            >
              <LogOut size={18} />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
