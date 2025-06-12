
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SpeakerButton from "@/components/SpeakerButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2, FileText } from "lucide-react";

interface ExtractedData {
  id: number;
  fullName: string;
  dateOfBirth: string;
  aadharNumber: string;
  gender: string;
  address: string;
  documentNumber: string;
  timestamp: string;
}

const DocumentsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<ExtractedData[]>([]);
  const [editingDoc, setEditingDoc] = useState<ExtractedData | null>(null);
  const [editFormData, setEditFormData] = useState<ExtractedData | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("lext_logged_in");
    if (isLoggedIn !== "true") {
      navigate("/login");
      return;
    }

    loadDocuments();
  }, [navigate]);

  const loadDocuments = () => {
    const username = localStorage.getItem("lext_username");
    const savedDocs = [];
    
    // Load all saved documents for this user
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(`extractedData-${username}`)) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '');
          savedDocs.push(data);
        } catch (error) {
          console.error('Error parsing saved document:', error);
        }
      }
    }
    
    // Sort by timestamp (newest first)
    savedDocs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setDocuments(savedDocs);
  };

  const handleDelete = (docId: number) => {
    const username = localStorage.getItem("lext_username");
    const key = `extractedData-${username}-${docId}`;
    
    localStorage.removeItem(key);
    loadDocuments();
    
    toast({
      title: "Success",
      description: "Document deleted successfully",
    });
  };

  const handleEdit = (doc: ExtractedData) => {
    setEditingDoc(doc);
    setEditFormData({ ...doc });
  };

  const handleSaveEdit = () => {
    if (!editFormData) return;
    
    const username = localStorage.getItem("lext_username");
    const key = `extractedData-${username}-${editFormData.id}`;
    
    localStorage.setItem(key, JSON.stringify(editFormData));
    loadDocuments();
    setEditingDoc(null);
    setEditFormData(null);
    
    toast({
      title: "Success",
      description: "Document updated successfully",
    });
  };

  const handleInputChange = (field: keyof ExtractedData, value: string) => {
    if (!editFormData) return;
    
    setEditFormData({
      ...editFormData,
      [field]: value
    });
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDocumentTitle = (doc: ExtractedData) => {
    const docType = doc.aadharNumber ? "Aadhar" : doc.documentNumber ? "Visa" : "Document";
    const date = formatDate(doc.timestamp);
    return `${docType} - ${date}`;
  };

  const getSpeakerText = (doc: ExtractedData) => {
    return `Name: ${doc.fullName || 'Not specified'}, ${doc.aadharNumber ? `Aadhar: ${doc.aadharNumber}` : `Document: ${doc.documentNumber || 'Not specified'}`}, Date of Birth: ${doc.dateOfBirth || 'Not specified'}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#43CEA2] via-[#185A9D] to-[#6A1B9A] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-4 pt-8">
        <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 mb-8 shadow-2xl border border-white/20 dark:border-slate-700/50">
          <h1 className="text-3xl font-bold text-white dark:text-slate-100 mb-6">
            My Documents
          </h1>
          
          {documents.length === 0 ? (
            <div className="text-center py-12">
              <FileText size={64} className="mx-auto text-white/50 mb-4" />
              <p className="text-white/70 text-lg mb-4">
                No saved documents yet. Upload and extract one first!
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-2 px-6 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                Go to Dashboard
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc) => (
                <Card key={doc.id} className="bg-white/10 border-white/20 text-white hover:scale-105 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      {getDocumentTitle(doc)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm"><strong>Name:</strong> {doc.fullName || 'N/A'}</p>
                      <p className="text-sm"><strong>DOB:</strong> {doc.dateOfBirth || 'N/A'}</p>
                      <p className="text-sm"><strong>Gender:</strong> {doc.gender || 'N/A'}</p>
                      {doc.aadharNumber && (
                        <p className="text-sm"><strong>Aadhar:</strong> {doc.aadharNumber}</p>
                      )}
                      {doc.documentNumber && (
                        <p className="text-sm"><strong>Doc No:</strong> {doc.documentNumber}</p>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <SpeakerButton 
                        text={getSpeakerText(doc)} 
                        className="text-white hover:text-yellow-300"
                      />
                      
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <button
                              onClick={() => handleEdit(doc)}
                              className="p-2 bg-blue-500/30 hover:bg-blue-500/50 rounded-lg transition-colors"
                            >
                              <Edit size={16} />
                            </button>
                          </DialogTrigger>
                          <DialogContent className="bg-slate-800 text-white border-slate-700">
                            <DialogHeader>
                              <DialogTitle>Edit Document</DialogTitle>
                            </DialogHeader>
                            {editFormData && (
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium mb-2">Full Name</label>
                                  <input
                                    type="text"
                                    value={editFormData.fullName}
                                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-2">Date of Birth</label>
                                  <input
                                    type="text"
                                    value={editFormData.dateOfBirth}
                                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-2">Aadhar Number</label>
                                  <input
                                    type="text"
                                    value={editFormData.aadharNumber}
                                    onChange={(e) => handleInputChange('aadharNumber', e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-2">Gender</label>
                                  <select
                                    value={editFormData.gender}
                                    onChange={(e) => handleInputChange('gender', e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                  >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-2">Address</label>
                                  <textarea
                                    value={editFormData.address}
                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white min-h-[80px]"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-2">Document Number</label>
                                  <input
                                    type="text"
                                    value={editFormData.documentNumber}
                                    onChange={(e) => handleInputChange('documentNumber', e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                                  />
                                </div>
                                <button
                                  onClick={handleSaveEdit}
                                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-300"
                                >
                                  Save Changes
                                </button>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this document?')) {
                              handleDelete(doc.id);
                            }
                          }}
                          className="p-2 bg-red-500/30 hover:bg-red-500/50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage;
