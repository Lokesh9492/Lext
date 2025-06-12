import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { parseOCRText } from "@/utils/textParser";
import { useAuth } from "@/contexts/AuthContext";
import { saveDocument } from "@/firebase/documents";
import DocumentPreview from "@/components/DocumentPreview";

interface ExtractedData {
  [key: string]: string;
}

const DOCUMENT_TYPES = [
  "Aadhar Card",
  "PAN Card",
  "Passport",
  "Driving License",
  "Voter ID",
  "Other"
];

const ExtractionPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [ocrText, setOcrText] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [extractedData, setExtractedData] = useState<ExtractedData>({});
  const [isSaving, setIsSaving] = useState(false);
  const [documentType, setDocumentType] = useState<string>("");
  const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    // Get OCR text from localStorage
    const storedText = localStorage.getItem("lext_ocr_text");
    const storedPreviewUrl = localStorage.getItem("lext_preview_url");
    
    if (!storedText) {
      toast({
        title: "No Document",
        description: "Please upload and process a document first",
        variant: "destructive",
      });
      navigate("/dashboard");
      return;
    }

    setOcrText(storedText);
    if (storedPreviewUrl) {
      setPreviewUrl(storedPreviewUrl);
    }

    // Parse the OCR text
    try {
      const parsedData = parseOCRText(storedText);
      setExtractedData(parsedData);
      // Initialize editing state for each field
      const initialEditingState = Object.keys(parsedData).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {} as { [key: string]: boolean });
      setIsEditing(initialEditingState);
    } catch (error) {
      console.error("Error parsing OCR text:", error);
      toast({
        title: "Error",
        description: "Failed to parse document data",
        variant: "destructive",
      });
    }
  }, [navigate, toast]);

  const handleSave = async () => {
    if (!user || !extractedData) return;

    setIsSaving(true);
    try {
      await saveDocument({
        userId: user.uid,
        ...extractedData,
        documentType,
        ocrText,
        previewUrl,
        createdAt: new Date().toISOString(),
      });

      toast({
        title: "Success",
        description: "Document saved successfully",
      });
      navigate("/documents");
    } catch (error) {
      console.error("Error saving document:", error);
      toast({
        title: "Error",
        description: "Failed to save document",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFieldEdit = (key: string) => {
    setIsEditing(prev => ({ ...prev, [key]: true }));
  };

  const handleFieldChange = (key: string, value: string) => {
    setExtractedData(prev => ({ ...prev, [key]: value }));
  };

  const handleFieldSave = (key: string) => {
    setIsEditing(prev => ({ ...prev, [key]: false }));
  };

  const addNewField = () => {
    const newKey = `field_${Object.keys(extractedData).length + 1}`;
    setExtractedData(prev => ({ ...prev, [newKey]: "" }));
    setIsEditing(prev => ({ ...prev, [newKey]: true }));
  };

  if (!extractedData) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-[#43CEA2] via-[#185A9D] to-[#6A1B9A] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Navbar />
        <div className="max-w-7xl mx-auto p-4 pt-8">
          <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 dark:border-slate-700/50">
            <p className="text-white/80 dark:text-slate-300 text-center">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#43CEA2] via-[#185A9D] to-[#6A1B9A] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-4 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Document Preview */}
          <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 dark:border-slate-700/50">
            <h2 className="text-2xl font-bold text-white dark:text-slate-100 mb-6">Document Preview</h2>
            {previewUrl ? (
              <div className="aspect-[3/4] relative rounded-xl overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Document preview"
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="aspect-[3/4] flex items-center justify-center bg-white/5 rounded-xl">
                <p className="text-white/60">No preview available</p>
              </div>
            )}
          </div>

          {/* Extracted Information */}
          <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 dark:border-slate-700/50">
            <h2 className="text-2xl font-bold text-white dark:text-slate-100 mb-6">Extracted Information</h2>
            
            {/* Document Type Selector */}
            <div className="mb-6">
              <label className="block text-white/90 dark:text-slate-200 mb-2">Document Type</label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#43CEA2]"
              >
                <option value="">Select Document Type</option>
                {DOCUMENT_TYPES.map((type) => (
                  <option key={type} value={type} className="bg-slate-800">
                    {type}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-6">
              {Object.entries(extractedData).map(([key, value]) => (
                <div key={key} className="bg-white/5 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-white/90 dark:text-slate-200">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </h3>
                    {!isEditing[key] && (
                      <button
                        onClick={() => handleFieldEdit(key)}
                        className="text-[#43CEA2] hover:text-[#39B896] text-sm"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  {isEditing[key] ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleFieldChange(key, e.target.value)}
                        className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#43CEA2]"
                      />
                      <button
                        onClick={() => handleFieldSave(key)}
                        className="px-3 py-2 bg-[#43CEA2] hover:bg-[#39B896] text-white rounded-lg"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <p className="text-white/80 dark:text-slate-300">
                      {value || "Not specified"}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Add New Field Button */}
            <button
              onClick={addNewField}
              className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all duration-300"
            >
              + Add New Field
            </button>

            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all duration-300"
              >
                Back
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || !documentType}
                className="px-6 py-3 bg-gradient-to-r from-[#43CEA2] to-[#185A9D] hover:from-[#39B896] hover:to-[#1A4C87] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all duration-300"
              >
                {isSaving ? "Saving..." : "Save Document"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtractionPage;
