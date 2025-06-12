import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import FileUploadBox from "@/components/FileUploadBox";
import DocumentPreview from "@/components/DocumentPreview";
import OCRResultViewer from "@/components/OCRResultViewer";
import SpeakerButton from "@/components/SpeakerButton";
import Tesseract from "tesseract.js";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrText, setOcrText] = useState<string>("");
  const [showOcrResult, setShowOcrResult] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // If no user is authenticated, redirect to login
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const displayName = user?.displayName || user?.email?.split('@')[0] || "User";
  const welcomeText = `Welcome, ${displayName}! Upload your document to extract key information with LEXT.`;

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setShowOcrResult(false);
    setOcrText("");
    
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    // Store the preview URL in localStorage
    localStorage.setItem("lext_preview_url", url);
  };

  const preprocessImage = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size to match image
        canvas.width = img.width;
        canvas.height = img.height;
        
        if (ctx) {
          // Draw original image
          ctx.drawImage(img, 0, 0);
          
          // Get image data
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          // Apply preprocessing
          for (let i = 0; i < data.length; i += 4) {
            // Convert to grayscale
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            
            // Increase contrast
            const threshold = 128;
            const newValue = avg > threshold ? 255 : 0;
            
            data[i] = newValue;     // R
            data[i + 1] = newValue; // G
            data[i + 2] = newValue; // B
          }
          
          // Put processed image data back
          ctx.putImageData(imageData, 0, 0);
          
          // Convert to base64
          resolve(canvas.toDataURL('image/png'));
        } else {
          resolve(URL.createObjectURL(file));
        }
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleStartOCR = async () => {
    if (!uploadedFile) return;

    setIsProcessing(true);
    setProgress(0);
    try {
      // Preprocess the image
      const processedImage = await preprocessImage(uploadedFile);
      
      // Configure Tesseract
      const result = await Tesseract.recognize(
        processedImage,
        'eng',
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              setProgress(m.progress * 100);
            }
          }
        }
      );
      
      // Clean up the OCR text
      const cleanedText = result.data.text
        .replace(/\r\n/g, '\n') // Normalize line endings
        .replace(/\r/g, '\n')   // Convert remaining \r to \n
        .replace(/\n{3,}/g, '\n\n') // Replace multiple line breaks with double line break
        .trim();

      // Process the text line by line
      const processedLines = cleanedText.split('\n').map(line => {
        // Clean each line while preserving important characters
        return line
          .replace(/[^\w\s/-:]/g, '') // Remove special characters except /-:
          .replace(/\s+/g, ' ') // Normalize spaces
          .trim();
      }).filter(line => line.length > 0); // Remove empty lines

      // Join the processed lines
      const processedText = processedLines.join('\n');
      
      if (processedText.trim().length === 0) {
        toast({
          title: "Warning",
          description: "No text was extracted from the document. Please try again with a clearer image.",
          variant: "destructive",
        });
        return;
      }

      setOcrText(processedText);
      setShowOcrResult(true);
      
      // Store OCR text in localStorage for the extraction page
      localStorage.setItem("lext_ocr_text", processedText);
      
      toast({
        title: "Success",
        description: "Document processed successfully",
      });
    } catch (error) {
      console.error("OCR Error:", error);
      toast({
        title: "Error",
        description: "Failed to process document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
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
                Welcome, {displayName}! 👋
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
          <FileUploadBox onFileSelect={handleFileUpload} isProcessing={isProcessing} />
        )}

        {/* Document Preview and OCR Section */}
        {uploadedFile && (
          <div className="space-y-8">
            <DocumentPreview file={uploadedFile} />
            
            {!showOcrResult && (
              <div className="flex flex-col items-center space-y-4">
                <button
                  onClick={handleStartOCR}
                  disabled={isProcessing}
                  className="bg-gradient-to-r from-[#43CEA2] to-[#185A9D] hover:from-[#39B896] hover:to-[#1A4C87] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-8 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  {isProcessing ? "Processing..." : "Start OCR"}
                </button>
                
                {isProcessing && (
                  <div className="w-full max-w-md">
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#43CEA2] to-[#185A9D] transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-white/70 text-sm text-center mt-2">
                      Processing document... {Math.round(progress)}%
                    </p>
                  </div>
                )}
              </div>
            )}

            {showOcrResult && (
              <div className="space-y-6">
                <OCRResultViewer text={ocrText} />
                <div className="flex justify-center">
                  <button
                    onClick={handleContinueToExtraction}
                    className="bg-gradient-to-r from-[#6A1B9A] to-[#43CEA2] hover:from-[#5A1585] hover:to-[#39B896] text-white py-3 px-8 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    Continue to Extraction
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
