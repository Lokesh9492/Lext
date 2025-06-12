
import { useState, useRef } from "react";
import { Upload, File, Image } from "lucide-react";

interface FileUploadBoxProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

const FileUploadBox = ({ onFileSelect, isProcessing }: FileUploadBoxProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (isValidFile(file)) {
        onFileSelect(file);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (isValidFile(file)) {
        onFileSelect(file);
      }
    }
  };

  const isValidFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    return validTypes.includes(file.type);
  };

  const handleClick = () => {
    if (!isProcessing) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
          isDragOver
            ? "border-white/60 bg-white/10"
            : "border-white/30 hover:border-white/50 hover:bg-white/5"
        } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isProcessing}
        />
        
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-white/10 rounded-full">
            <Upload size={32} className="text-white" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Upload Your Document
            </h3>
            <p className="text-white/70 mb-4">
              Drag and drop or click to select
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-white/60">
              <div className="flex items-center space-x-1">
                <Image size={16} />
                <span>JPG, PNG</span>
              </div>
              <div className="flex items-center space-x-1">
                <File size={16} />
                <span>PDF</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadBox;
