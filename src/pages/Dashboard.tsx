
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createWorker } from "tesseract.js";
import Navbar from "@/components/Navbar";
import FileUploadBox from "@/components/FileUploadBox";
import DocumentPreview from "@/components/DocumentPreview";
import OCRResultViewer from "@/components/OCRResultViewer";
import SpeakerButton from "@/components/SpeakerButton";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [ocrText, setOcrText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("lext_logged_in");
    const storedUsername = localStorage.getItem("lext_username");
    
    if (isLoggedIn !== "true" || !storedUsername) {
      navigate("/login");
    } else {
      setUsername(storedUsername);
    }
  }, [navigate]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setOcrText(""); // Reset OCR text when new file is selected
  };

  const handleStartOCR = async (imageData: string) => {
    setIsProcessing(true);
    setOcrProgress(0);
    
    try {
      const worker = await createWorker('eng');
      
      // Set up progress tracking
      await worker.setParameters({
        tessedit_pageseg_mode: '1',
      });

      const { data: { text } } = await worker.recognize(imageData);
      
      setOcrText(text);
      await worker.terminate();
      
      toast({
        title: "Success!",
        description: "Text extraction completed successfully.",
      });
    } catch (error) {
      console.error('OCR Error:', error);
      toast({
        title: "Error",
        description: "Failed to extract text from the document.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setOcrProgress(0);
    }
  };

  const handleContinueToExtraction = () => {
    // Store the OCR text in localStorage for the extraction page
    localStorage.setItem("lext_ocr_text", ocrText);
    navigate("/extract");
  };

  const welcomeMessage = `Welcome ${username}! Upload your document to extract key information with LEXT.`;

  if (!username) {
    return null; // Show nothing while checking auth
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#43CEA2] via-[#185A9D] to-[#6A1B9A] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />
      
      <div className="max-w-6xl mx-auto p-4 pt-8">
        {/* Greeting Section */}
        <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 mb-8 shadow-2xl border border-white/20 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-white dark:text-slate-100">
              Welcome, {username}! 👋
            </h1>
            <SpeakerButton text={welcomeMessage} className="text-white hover:text-yellow-300" />
          </div>
          <p className="text-xl text-white/90 dark:text-slate-200">
            Upload your document to extract key information with LEXT.
          </p>
        </div>

        {/* Upload Section */}
        {!selectedFile && (
          <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 mb-8 shadow-2xl border border-white/20 dark:border-slate-700/50">
            <h2 className="text-2xl font-bold text-white dark:text-slate-100 mb-6">
              Document Upload
            </h2>
            <FileUploadBox onFileSelect={handleFileSelect} isProcessing={isProcessing} />
          </div>
        )}

        {/* Preview and OCR Section */}
        {selectedFile && !ocrText && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white dark:text-slate-100">
                Document Preview
              </h2>
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setOcrText("");
                }}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300"
              >
                Upload Different File
              </button>
            </div>
            <DocumentPreview
              file={selectedFile}
              onStartOCR={handleStartOCR}
              isProcessing={isProcessing}
            />
          </div>
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 mb-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-white mb-2">Processing Document...</h3>
            <p className="text-white/70">Extracting text using OCR technology</p>
          </div>
        )}

        {/* OCR Results */}
        {ocrText && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white dark:text-slate-100">
                Extraction Results
              </h2>
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setOcrText("");
                }}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300"
              >
                Process New Document
              </button>
            </div>
            <OCRResultViewer
              text={ocrText}
              onContinue={handleContinueToExtraction}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
