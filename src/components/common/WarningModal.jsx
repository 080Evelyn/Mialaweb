import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const WarningModal = ({ open, onClose, onConfirm, loading }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-red-600 text-lg text-center">
            Warning!
          </DialogTitle>
        </DialogHeader>

        <p className="mt-2 text-gray-600 text-sm text-center">
          Are you sure you want to delete this staff? All related records will
          be deleted. This action cannot be undone.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 cursor-pointer">
            No
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer">
            {loading ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WarningModal;
