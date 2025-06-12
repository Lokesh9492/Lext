
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SpeakerButton from "@/components/SpeakerButton";
import { useToast } from "@/hooks/use-toast";

const ExtractionPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [extractedData, setExtractedData] = useState({
    fullName: "",
    dateOfBirth: "",
    aadharNumber: "",
    gender: "",
    address: "",
    documentNumber: ""
  });
  const [originalImage, setOriginalImage] = useState("");

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("lext_logged_in");
    if (isLoggedIn !== "true") {
      navigate("/login");
      return;
    }

    // Get OCR text from localStorage
    const ocrText = localStorage.getItem("lext_ocr_text");
    if (!ocrText) {
      navigate("/dashboard");
      return;
    }

    // Parse the OCR text automatically
    parseOCRText(ocrText);
  }, [navigate]);

  const parseOCRText = (text: string) => {
    const parsed = {
      fullName: extractFullName(text),
      dateOfBirth: extractDateOfBirth(text),
      aadharNumber: extractAadharNumber(text),
      gender: extractGender(text),
      address: extractAddress(text),
      documentNumber: extractDocumentNumber(text)
    };
    
    setExtractedData(parsed);
  };

  const extractFullName = (text: string) => {
    // Look for patterns like "Name:" followed by text
    const namePatterns = [
      /(?:Name|NAME|name)\s*:?\s*([A-Za-z\s]+)/i,
      /^([A-Z][a-z]+\s+[A-Z][a-z]+)/m
    ];
    
    for (const pattern of namePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    return "";
  };

  const extractDateOfBirth = (text: string) => {
    // Look for date patterns
    const datePatterns = [
      /(?:DOB|Date of Birth|dob)\s*:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})/i,
      /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})/
    ];
    
    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return "";
  };

  const extractAadharNumber = (text: string) => {
    // Look for 12-digit Aadhar number pattern
    const aadharPattern = /(\d{4}\s?\d{4}\s?\d{4})/;
    const match = text.match(aadharPattern);
    return match ? match[1] : "";
  };

  const extractGender = (text: string) => {
    // Look for gender indicators
    const genderPattern = /(?:Gender|GENDER|Sex)\s*:?\s*(Male|Female|M|F|male|female)/i;
    const match = text.match(genderPattern);
    if (match && match[1]) {
      const gender = match[1].toLowerCase();
      if (gender === 'm' || gender === 'male') return 'Male';
      if (gender === 'f' || gender === 'female') return 'Female';
    }
    return "";
  };

  const extractAddress = (text: string) => {
    // Look for address patterns
    const addressPattern = /(?:Address|ADDRESS|address)\s*:?\s*([^\n]+(?:\n[^\n]+)*)/i;
    const match = text.match(addressPattern);
    return match ? match[1].trim() : "";
  };

  const extractDocumentNumber = (text: string) => {
    // Look for various document number patterns
    const docPatterns = [
      /(?:Visa|VISA|visa)\s*(?:No|Number|no|number)\s*:?\s*([A-Z0-9]+)/i,
      /(?:Document|DOCUMENT|document)\s*(?:No|Number|no|number)\s*:?\s*([A-Z0-9]+)/i
    ];
    
    for (const pattern of docPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return "";
  };

  const handleInputChange = (field: string, value: string) => {
    setExtractedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    const username = localStorage.getItem("lext_username");
    const docId = Date.now();
    const saveKey = `extractedData-${username}-${docId}`;
    
    // Save to localStorage
    const savedData = {
      ...extractedData,
      timestamp: new Date().toISOString(),
      id: docId
    };
    
    localStorage.setItem(saveKey, JSON.stringify(savedData));
    
    toast({
      title: "Success!",
      description: "Details saved successfully",
    });
  };

  const speakerText = "Extracted fields from your document. Please review and edit the information as needed.";

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#43CEA2] via-[#185A9D] to-[#6A1B9A] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-4 pt-8">
        <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 mb-8 shadow-2xl border border-white/20 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-white dark:text-slate-100">
              Extract Information
            </h1>
            <SpeakerButton text={speakerText} className="text-white hover:text-yellow-300" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Document Preview */}
            <div className="bg-white/10 dark:bg-slate-700/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Document Preview</h3>
              <div className="bg-black/20 rounded-lg p-4 text-center">
                <p className="text-white/70">Document preview will appear here</p>
              </div>
            </div>
            
            {/* Extracted Fields Form */}
            <div className="bg-white/10 dark:bg-slate-700/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Extracted Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={extractedData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                    placeholder="Enter full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">Date of Birth</label>
                  <input
                    type="text"
                    value={extractedData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                    placeholder="DD/MM/YYYY"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">Aadhar Number</label>
                  <input
                    type="text"
                    value={extractedData.aadharNumber}
                    onChange={(e) => handleInputChange('aadharNumber', e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                    placeholder="1234 5678 9012"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">Gender</label>
                  <select
                    value={extractedData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">Address</label>
                  <textarea
                    value={extractedData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 min-h-[80px]"
                    placeholder="Enter address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">Document Number</label>
                  <input
                    type="text"
                    value={extractedData.documentNumber}
                    onChange={(e) => handleInputChange('documentNumber', e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                    placeholder="Visa/Document number"
                  />
                </div>
              </div>
              
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300"
                >
                  Back to Dashboard
                </button>
                
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105"
                >
                  Save Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtractionPage;
