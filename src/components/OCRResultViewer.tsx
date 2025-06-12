
import { useState } from "react";
import { Copy, Download } from "lucide-react";
import SpeakerButton from "./SpeakerButton";
import { useToast } from "@/hooks/use-toast";

interface OCRResultViewerProps {
  text: string;
  onContinue: () => void;
}

const OCRResultViewer = ({ text, onContinue }: OCRResultViewerProps) => {
  const { toast } = useToast();

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Success",
        description: "Text copied to clipboard!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy text to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleDownloadText = () => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `extracted-text-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-lg rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Extracted Text</h3>
        <SpeakerButton text={text} className="text-white hover:text-yellow-300" />
      </div>
      
      <div className="bg-black/20 rounded-lg p-4 mb-6 max-h-64 overflow-y-auto">
        <pre className="text-white/90 whitespace-pre-wrap text-sm font-mono">
          {text || "No text extracted"}
        </pre>
      </div>
      
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleCopyText}
          className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300"
        >
          <Copy size={16} />
          <span>Copy Text</span>
        </button>
        
        <button
          onClick={handleDownloadText}
          className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300"
        >
          <Download size={16} />
          <span>Download</span>
        </button>
        
        <button
          onClick={onContinue}
          className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105"
        >
          Continue to Extraction
        </button>
      </div>
    </div>
  );
};

export default OCRResultViewer;
