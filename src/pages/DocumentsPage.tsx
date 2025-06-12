import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SpeakerButton from "@/components/SpeakerButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2, FileText, Save } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { DocumentData, getUserDocuments, deleteDocument, updateDocument, saveDocument } from "@/firebase/documents";
import { parseOCRText } from "@/utils/textParser";

const DocumentsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [editingDoc, setEditingDoc] = useState<DocumentData | null>(null);
  const [editFormData, setEditFormData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadDocuments();
  }, [user, navigate]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const docs = await getUserDocuments(user!.uid);
      setDocuments(docs);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load documents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (docId: string) => {
    try {
      await deleteDocument(docId);
      await loadDocuments();
      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (doc: DocumentData) => {
    setEditingDoc(doc);
    setEditFormData({ ...doc });
  };

  const handleSaveEdit = async () => {
    if (!editFormData || !editFormData.id) return;
    
    try {
      await updateDocument(editFormData.id, editFormData);
      await loadDocuments();
      setEditingDoc(null);
      setEditFormData(null);
      
      toast({
        title: "Success",
        description: "Document updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update document",
        variant: "destructive",
      });
    }
  };

  const handleSaveNewDocument = async () => {
    if (!user) return;

    try {
      setSaving(true);
      const ocrText = localStorage.getItem("lext_ocr_text");
      if (!ocrText) {
        toast({
          title: "Error",
          description: "No document data to save",
          variant: "destructive",
        });
        return;
      }

      const parsedData = parseOCRText(ocrText);
      const documentData = {
        ...parsedData,
        userId: user.uid,
        timestamp: new Date().toISOString(),
        documentType: parsedData.aadharNumber ? "Aadhar Card" : parsedData.documentNumber ? "Other Document" : "Unknown",
        originalText: ocrText
      };

      await saveDocument(documentData);
      localStorage.removeItem("lext_ocr_text");
      
      toast({
        title: "Success",
        description: "Document saved successfully",
      });
      
      await loadDocuments();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save document",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof DocumentData, value: string) => {
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

  const getDocumentTitle = (doc: DocumentData) => {
    return `${doc.documentType} - ${formatDate(doc.timestamp)}`;
  };

  const getSpeakerText = (doc: DocumentData) => {
    return `Name: ${doc.fullName || 'Not specified'}, ${doc.aadharNumber ? `Aadhar: ${doc.aadharNumber}` : `Document: ${doc.documentNumber || 'Not specified'}`}, Date of Birth: ${doc.dateOfBirth || 'Not specified'}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-[#43CEA2] via-[#185A9D] to-[#6A1B9A] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Navbar />
        <div className="max-w-7xl mx-auto p-4 pt-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#43CEA2] via-[#185A9D] to-[#6A1B9A] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-4 pt-8">
        <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 mb-8 shadow-2xl border border-white/20 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">My Documents</h1>
              <p className="text-white/80">View and manage your processed documents</p>
            </div>
            {localStorage.getItem("lext_ocr_text") && (
              <button
                onClick={handleSaveNewDocument}
                disabled={saving}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white rounded-lg transition-all duration-300"
              >
                <Save size={18} />
                <span>{saving ? "Saving..." : "Save New Document"}</span>
              </button>
            )}
          </div>
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-white/50 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Documents Yet</h3>
            <p className="text-white/70">Process your first document to see it here</p>
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
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(doc)}
                        className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id!)}
                        className="p-2 text-white/70 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <SpeakerButton text={getSpeakerText(doc)} className="text-white/70 hover:text-yellow-300" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingDoc} onOpenChange={() => setEditingDoc(null)}>
        <DialogContent className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
          </DialogHeader>
          
          {editFormData && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  value={editFormData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={editFormData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select
                  value={editFormData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              {editFormData.aadharNumber && (
                <div>
                  <label className="block text-sm font-medium mb-1">Aadhar Number</label>
                  <input
                    type="text"
                    value={editFormData.aadharNumber}
                    onChange={(e) => handleInputChange('aadharNumber', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                </div>
              )}
              
              {editFormData.documentNumber && (
                <div>
                  <label className="block text-sm font-medium mb-1">Document Number</label>
                  <input
                    type="text"
                    value={editFormData.documentNumber}
                    onChange={(e) => handleInputChange('documentNumber', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                </div>
              )}
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setEditingDoc(null)}
                  className="px-4 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-300"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentsPage;
