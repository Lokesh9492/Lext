
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SpeakerButton from "@/components/SpeakerButton";
import ThemeSelector from "@/components/settings/ThemeSelector";
import VoiceSelector from "@/components/settings/VoiceSelector";
import ConfirmationModal from "@/components/settings/ConfirmationModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Settings, Trash2, RotateCcw, LogOut } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [currentTheme, setCurrentTheme] = useState("light");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showClearDataModal, setShowClearDataModal] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("lext_logged_in");
    if (isLoggedIn !== "true") {
      navigate("/login");
      return;
    }

    // Load user data
    const storedUsername = localStorage.getItem("lext_username") || "User";
    setUsername(storedUsername);

    // Count total documents
    const documents = JSON.parse(localStorage.getItem(`lext_documents_${storedUsername}`) || "[]");
    setTotalDocuments(documents.length);

    // Get current theme
    const theme = localStorage.getItem("lext_theme") || "light";
    setCurrentTheme(theme);
  }, [navigate]);

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleResetTheme = () => {
    localStorage.setItem("lext_theme", "light");
    setCurrentTheme("light");
    document.documentElement.classList.remove("dark");
    toast({
      title: "Theme Reset",
      description: "Theme has been reset to default (Light Mode)",
    });
  };

  const handleClearAllData = () => {
    const documents = JSON.parse(localStorage.getItem(`lext_documents_${username}`) || "[]");
    if (documents.length === 0) {
      toast({
        title: "No Data",
        description: "No extracted documents found to clear.",
      });
      return;
    }
    setShowClearDataModal(true);
  };

  const confirmClearData = () => {
    localStorage.removeItem(`lext_documents_${username}`);
    localStorage.removeItem("lext_ocr_text");
    setTotalDocuments(0);
    setShowClearDataModal(false);
    toast({
      title: "Data Cleared",
      description: "All extracted documents have been deleted.",
    });
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = () => {
    // Clear all user data
    localStorage.removeItem("lext_logged_in");
    localStorage.removeItem("lext_username");
    localStorage.removeItem(`lext_documents_${username}`);
    localStorage.removeItem("lext_ocr_text");
    localStorage.removeItem("lext_theme");
    localStorage.removeItem("lext_voice");
    
    toast({
      title: "Account Deleted",
      description: "Your account and all data have been removed.",
    });

    // Redirect to login
    navigate("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("lext_logged_in");
    localStorage.removeItem("lext_username");
    navigate("/login");
  };

  const profileSummary = `Settings for ${username}. You have ${totalDocuments} saved documents and are using ${currentTheme} theme.`;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#43CEA2] via-[#185A9D] to-[#6A1B9A] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />
      
      <div className="max-w-4xl mx-auto p-4 pt-8">
        {/* Header */}
        <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 mb-8 shadow-2xl border border-white/20 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Settings className="w-8 h-8 text-white" />
              <div>
                <h1 className="text-3xl font-bold text-white">Settings & Profile</h1>
                <p className="text-white/80">Manage your preferences and account</p>
              </div>
            </div>
            <SpeakerButton text={profileSummary} className="text-white hover:text-yellow-300" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Info */}
          <Card className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-lg border-white/20 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>My Profile</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-bold">
                    {getUserInitials(username)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold text-white">{username}</h3>
                  <p className="text-white/70">LEXT User</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-white/70 text-sm">Documents Saved</p>
                  <p className="text-white text-2xl font-bold">{totalDocuments}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-white/70 text-sm">Current Theme</p>
                  <p className="text-white text-lg font-semibold capitalize">{currentTheme}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Theme Selection */}
          <ThemeSelector currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
        </div>

        {/* Voice Selector */}
        <div className="mt-8">
          <VoiceSelector />
        </div>

        {/* Account Actions */}
        <Card className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-lg border-white/20 dark:border-slate-700/50 mt-8">
          <CardHeader>
            <CardTitle className="text-white">Account Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                onClick={handleResetTheme}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Theme</span>
              </Button>

              <Button
                onClick={handleClearAllData}
                variant="outline"
                className="bg-orange-500/20 border-orange-400/40 text-orange-200 hover:bg-orange-500/30 flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear Data</span>
              </Button>

              <Button
                onClick={handleDeleteAccount}
                variant="outline"
                className="bg-red-500/20 border-red-400/40 text-red-200 hover:bg-red-500/30 flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Account</span>
              </Button>

              <Button
                onClick={handleLogout}
                variant="outline"
                className="bg-gray-500/20 border-gray-400/40 text-gray-200 hover:bg-gray-500/30 flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showClearDataModal}
        onClose={() => setShowClearDataModal(false)}
        onConfirm={confirmClearData}
        title="Clear All Data"
        message="Are you sure you want to delete all extracted documents? This action cannot be undone."
        type="warning"
      />

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteAccount}
        title="Delete Account"
        message="Are you sure you want to delete your account? All your data will be permanently removed and cannot be recovered."
        type="danger"
      />
    </div>
  );
};

export default SettingsPage;
