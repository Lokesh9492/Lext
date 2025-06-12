import { useState, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";

// Set the worker source for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface DocumentPreviewProps {
  file: File;
}

const DocumentPreview = ({ file }: DocumentPreviewProps) => {
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generatePreview();
  }, [file]);

  const generatePreview = async () => {
    setLoading(true);
    
    if (file.type.startsWith('image/')) {
      // Handle image files
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } else if (file.type === 'application/pdf') {
      // Handle PDF files
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);
        
        const scale = 1.5;
        const viewport = page.getViewport({ scale });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        if (context) {
          await page.render({
            canvasContext: context,
            viewport: viewport
          }).promise;
          
          setPreview(canvas.toDataURL());
        }
        setLoading(false);
      } catch (error) {
        console.error('Error rendering PDF:', error);
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white/70">Loading preview...</p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-lg rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Document Preview</h3>
      
      <div className="mb-6">
        <img
          src={preview}
          alt="Document preview"
          className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
          style={{ maxHeight: '400px' }}
        />
      </div>
    </div>
  );
};

export default DocumentPreview;
