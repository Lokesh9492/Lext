
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SpeakerButton from "@/components/SpeakerButton";
import ExtractedFieldsForm from "@/components/extraction/ExtractedFieldsForm";
import DocumentDisplay from "@/components/extraction/DocumentDisplay";
import { parseOCRText, ExtractedData } from "@/utils/textParser";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ExtractionPage = () => {
  const navigate = useNavigate();
  const [extractedData, setExtractedData] = useState<ExtractedData>({
    fullName: "",
    dateOfBirth: "",
    aadharNumber: "",
    gender: "",
    address: "",
    documentNumber: ""
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("lext_logged_in");
    if (isLoggedIn !== "true") {
      navigate("/login");
      return;
    }

    // Get OCR text from localStorage
    const ocrText = localStorage.getItem("lext_ocr_text");
    if (ocrText) {
      const parsed = parseOCRText(ocrText);
      setExtractedData(parsed);
    }

    // Try to get the uploaded file info (this is a limitation since we can't store File objects in localStorage)
    // In a real app, you'd store the file in a proper state management solution
  }, [navigate]);

  const handleSave = (data: ExtractedData) => {
    const username = localStorage.getItem("lext_username") || "user";
    const timestamp = new Date().toISOString();
    const id = Date.now().toString();

    const documentEntry = {
      id,
      ...data,
      timestamp,
      title: `${data.aadharNumber ? 'Aadhar' : 'Document'} - ${new Date().toLocaleDateString()}`
    };

    // Get existing documents
    const existingDocs = JSON.parse(localStorage.getItem(`lext_documents_${username}`) || "[]");
    existingDocs.push(documentEntry);
    
    // Save updated list
    localStorage.setItem(`lext_documents_${username}`, JSON.stringify(existingDocs));

    // Clear the OCR text
    localStorage.removeItem("lext_ocr_text");
  };

  const summaryText = `Extracted information: Name: ${extractedData.fullName || 'Not found'}, Aadhar: ${extractedData.aadharNumber || 'Not found'}, Date of Birth: ${extractedData.dateOfBirth || 'Not found'}`;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#43CEA2] via-[#185A9D] to-[#6A1B9A] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-4 pt-8">
        {/* Header Section */}
        <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 mb-8 shadow-2xl border border-white/20 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate("/dashboard")}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white">Extract & Edit Information</h1>
                <p className="text-white/80">Review and edit the extracted fields below</p>
              </div>
            </div>
            <SpeakerButton text={summaryText} className="text-white hover:text-yellow-300" />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Document Preview */}
          <DocumentDisplay file={uploadedFile} />
          
          {/* Extracted Fields Form */}
          <ExtractedFieldsForm 
            initialData={extractedData}
            onSave={handleSave}
          />
        </div>

        {/* Navigation Footer */}
        <div className="mt-8 text-center">
          <Button
            onClick={() => navigate("/documents")}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
          >
            View Saved Documents
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExtractionPage;
