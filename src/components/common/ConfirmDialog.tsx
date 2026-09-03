import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-[#FFFFFF] dark:bg-[#222520] rounded-3xl shadow-2xl border border-[#E5E2D9] dark:border-[#2F342B] p-6 z-10"
        >
          <div className="flex items-start space-x-4">
            <div
              className={`p-3 rounded-2xl shrink-0 ${
                isDestructive
                  ? 'bg-[#FAF0ED] dark:bg-[#341F1B] text-[#B84A39] dark:text-[#E88C7D]'
                  : 'bg-[#FAF2EB] dark:bg-[#33251E] text-[#B5825D] dark:text-[#DDA15E]'
              }`}
            >
              {isDestructive ? <Trash2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-[#3A3A32] dark:text-[#EDEBE4]">{title}</h3>
              <p className="mt-2 text-xs text-[#7B806F] dark:text-[#8E9484] leading-relaxed">{message}</p>
            </div>
            <button
              onClick={onCancel}
              className="text-[#8C907F] hover:text-[#3A3A32] dark:text-[#787D70] dark:hover:text-[#EDEBE4] p-1 rounded-lg hover:bg-[#F3F1EA] dark:hover:bg-[#2A2E27]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-6 flex justify-end space-x-3 text-xs">
            <button
              onClick={onCancel}
              className="px-4 py-2.5 font-semibold text-[#6B705C] dark:text-[#A8ACA0] hover:bg-[#F3F1EA] dark:hover:bg-[#2A2E27] rounded-xl transition"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className={`px-5 py-2.5 font-semibold text-white rounded-xl shadow-xs transition active:scale-95 ${
                isDestructive
                  ? 'bg-[#B84A39] hover:bg-[#9E3F30]'
                  : 'bg-[#556855] hover:bg-[#455545]'
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
