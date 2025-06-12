
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2, AlertCircle } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type: "warning" | "danger";
}

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  type 
}: ConfirmationModalProps) => {
  const getIcon = () => {
    switch (type) {
      case "danger":
        return <Trash2 className="w-6 h-6 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-6 h-6 text-orange-500" />;
      default:
        return <AlertCircle className="w-6 h-6 text-blue-500" />;
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case "danger":
        return "bg-red-600 hover:bg-red-700";
      case "warning":
        return "bg-orange-600 hover:bg-orange-700";
      default:
        return "bg-blue-600 hover:bg-blue-700";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {getIcon()}
            <span>{title}</span>
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="space-x-2">
          <Button
            onClick={onClose}
            variant="outline"
            className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className={`text-white ${getButtonColor()}`}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
