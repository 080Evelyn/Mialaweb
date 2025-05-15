// components/SuccessModal.jsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const SuccessModal = ({ open, onClose, message }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-green-600 text-lg">
            Success 🎉
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm">{message}</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Close
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;
