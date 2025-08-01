import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Ban } from "lucide-react";

const RestrictionModal = ({ open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-green-600 text-lg">
            <Ban size={45} className="text-red-500 m-auto" />
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-center">
          You are not authorized to perform this action.
        </p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-red-600  text-white rounded hover:bg-red-700">
          Close
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default RestrictionModal;
