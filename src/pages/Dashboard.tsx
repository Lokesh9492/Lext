
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import FileUploadBox from "@/components/FileUploadBox";
import DocumentPreview from "@/components/DocumentPreview";
import OCRResultViewer from "@/components/OCRResultViewer";
import SpeakerButton from "@/components/SpeakerButton";
import Tesseract from "tesseract.js";

const Dashboard = () => {
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrText, setOcrText] = useState<string>("");
  const [showOcrResult, setShowOcrResult] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("lext_logged_in");
    if (isLoggedIn !== "true") {
      navigate("/login");
    }
  }, [navigate]);

  const username = localStorage.getItem("lext_username") || "User";
  const welcomeText = `Welcome, ${username}! Upload your document to extract key information with LEXT.`;

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setShowOcrResult(false);
    setOcrText("");
    
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleStartOCR = async () => {
    if (!uploadedFile) return;

    setIsProcessing(true);
    try {
      const result = await Tesseract.recognize(uploadedFile, 'eng', {
        logger: m => console.log(m),
      });
      
      setOcrText(result.data.text);
      setShowOcrResult(true);
      
      // Store OCR text in localStorage for the extraction page
      localStorage.setItem("lext_ocr_text", result.data.text);
    } catch (error) {
      console.error("OCR Error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinueToExtraction = () => {
    navigate("/extract");
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#43CEA2] via-[#185A9D] to-[#6A1B9A] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-4 pt-8">
        {/* Greeting Section */}
        <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 mb-8 shadow-2xl border border-white/20 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white dark:text-slate-100 mb-4">
                Welcome, {username}! 👋
              </h1>
              <p className="text-white/80 dark:text-slate-300 text-lg">
                Upload your document to extract key information with LEXT.
              </p>
            </div>
            <SpeakerButton text={welcomeText} className="text-white hover:text-yellow-300" />
          </div>
        </div>

        {/* Upload Section */}
        {!uploadedFile && (
          <FileUploadBox onFileSelect={handleFileUpload} />
        )}

        {/* Document Preview and OCR Section */}
        {uploadedFile && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <DocumentPreview 
              file={uploadedFile} 
            />
            
            <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/20 dark:border-slate-700/50">
              <h3 className="text-xl font-semibold text-white mb-4">OCR Processing</h3>
              
              {!showOcrResult && (
                <div className="text-center">
                  <button
                    onClick={handleStartOCR}
                    disabled={isProcessing}
                    className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    {isProcessing ? "Processing..." : "Start OCR"}
                  </button>
                  
                  {isProcessing && (
                    <div className="mt-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                      <p className="text-white/70 mt-2">Extracting text...</p>
                    </div>
                  )}
                </div>
              )}

              {showOcrResult && (
                <OCRResultViewer 
                  text={ocrText}
                  onContinue={handleContinueToExtraction}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
