
import { useState, useEffect } from "react";

interface DocumentDisplayProps {
  file?: File;
}

const DocumentDisplay = ({ file }: DocumentDisplayProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  if (!file && !previewUrl) {
    return (
      <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/20 dark:border-slate-700/50">
        <div className="flex items-center justify-center h-96 border-2 border-dashed border-white/30 rounded-lg">
          <p className="text-white/70 text-lg">No document to display</p>
        </div>
      </div>
    );
  }

  const isImage = file?.type.startsWith('image/');
  const isPDF = file?.type === 'application/pdf';

  return (
    <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/20 dark:border-slate-700/50">
      <h2 className="text-2xl font-bold text-white mb-6">Document Preview</h2>
      
      <div className="bg-white rounded-lg p-4 max-h-96 overflow-auto">
        {isImage && (
          <img
            src={previewUrl}
            alt="Document preview"
            className="w-full h-auto object-contain"
          />
        )}
        
        {isPDF && (
          <div className="text-center">
            <p className="text-gray-600 mb-4">PDF Preview</p>
            <embed
              src={previewUrl}
              type="application/pdf"
              width="100%"
              height="300px"
              className="rounded"
            />
          </div>
        )}
        
        {!isImage && !isPDF && (
          <div className="text-center py-8">
            <p className="text-gray-600">Preview not available for this file type</p>
            <p className="text-sm text-gray-500 mt-2">{file?.name}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentDisplay;
