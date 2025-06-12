
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface ExtractedData {
  fullName: string;
  dateOfBirth: string;
  aadharNumber: string;
  gender: string;
  address: string;
  documentNumber: string;
}

interface ExtractedFieldsFormProps {
  initialData: ExtractedData;
  onSave: (data: ExtractedData) => void;
}

const ExtractedFieldsForm = ({ initialData, onSave }: ExtractedFieldsFormProps) => {
  const [formData, setFormData] = useState<ExtractedData>(initialData);

  const handleChange = (field: keyof ExtractedData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    try {
      onSave(formData);
      toast({
        title: "Success",
        description: "Details saved successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save details. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/20 dark:border-slate-700/50">
      <h2 className="text-2xl font-bold text-white mb-6">Extracted Information</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-white/90 text-sm font-medium mb-2">Full Name</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 focus:border-transparent"
            placeholder="Enter full name"
          />
        </div>

        <div>
          <label className="block text-white/90 text-sm font-medium mb-2">Date of Birth</label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleChange('dateOfBirth', e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-white/90 text-sm font-medium mb-2">Aadhar Number</label>
          <input
            type="text"
            value={formData.aadharNumber}
            onChange={(e) => handleChange('aadharNumber', e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 focus:border-transparent"
            placeholder="XXXX XXXX XXXX"
            maxLength={14}
          />
        </div>

        <div>
          <label className="block text-white/90 text-sm font-medium mb-2">Gender</label>
          <select
            value={formData.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-white/30 focus:border-transparent"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-white/90 text-sm font-medium mb-2">Address</label>
          <textarea
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 focus:border-transparent"
            placeholder="Enter complete address"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-white/90 text-sm font-medium mb-2">Document Number (Optional)</label>
          <input
            type="text"
            value={formData.documentNumber}
            onChange={(e) => handleChange('documentNumber', e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 focus:border-transparent"
            placeholder="Visa/Passport number"
          />
        </div>

        <Button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
        >
          Save Details
        </Button>
      </div>
    </div>
  );
};

export default ExtractedFieldsForm;
