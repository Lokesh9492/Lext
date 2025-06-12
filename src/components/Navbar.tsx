
import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("lext_logged_in");
    localStorage.removeItem("lext_username");
    navigate("/login");
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
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
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
