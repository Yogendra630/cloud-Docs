import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FolderInput, X, Folder, Check } from 'lucide-react';
import { DocumentItem, FolderItem } from '../../types';
import { api } from '../../services/api';

interface MoveToFolderDialogProps {
  document: DocumentItem | null;
  isOpen: boolean;
  onClose: () => void;
  folders: FolderItem[];
  onMoved: () => void;
}

export const MoveToFolderDialog: React.FC<MoveToFolderDialogProps> = ({
  document: doc,
  isOpen,
  onClose,
  folders,
  onMoved,
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(doc?.folderId || null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !doc) return null;

  const handleMove = async () => {
    setIsLoading(true);
    try {
      await api.updateDocument(doc.id, { folderId: selectedFolderId });
      onMoved();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative w-full max-w-md bg-[#FFFFFF] dark:bg-[#222520] rounded-3xl shadow-2xl border border-[#E5E2D9] dark:border-[#2F342B] flex flex-col z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#EBE7DC] dark:border-[#2F342B] bg-[#F6F4EE]/80 dark:bg-[#292D25]/80">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-[#FAF2EB] dark:bg-[#33251E] text-[#B5825D] dark:text-[#DDA15E]">
                <FolderInput className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#3A3A32] dark:text-[#EDEBE4]">
                  Move Document
                </h3>
                <p className="text-xs text-[#7B806F] dark:text-[#8E9484] truncate max-w-xs">{doc.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#8C907F] hover:text-[#3A3A32] dark:text-[#787D70] dark:hover:text-[#EDEBE4] rounded-lg hover:bg-[#F3F1EA] dark:hover:bg-[#2A2E27]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Folder List */}
          <div className="p-4 space-y-1.5 max-h-72 overflow-y-auto text-xs">
            <button
              type="button"
              onClick={() => setSelectedFolderId(null)}
              className={`w-full p-3 rounded-xl flex items-center justify-between transition ${
                selectedFolderId === null
                  ? 'bg-[#EEF3ED] dark:bg-[#283226] text-[#445543] dark:text-[#B1C8AF] font-semibold border border-[#D0E2CC] dark:border-[#354D32]'
                  : 'hover:bg-[#F3F1EA] dark:hover:bg-[#2A2E27] text-[#4B4F42] dark:text-[#D1D4CA] border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Folder className="w-4 h-4 text-[#556855] dark:text-[#889E86]" />
                <span>My Documents (Root)</span>
              </div>
              {selectedFolderId === null && <Check className="w-4 h-4 text-[#556855] dark:text-[#889E86]" />}
            </button>

            {folders.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedFolderId(f.id)}
                className={`w-full p-3 rounded-xl flex items-center justify-between transition ${
                  selectedFolderId === f.id
                    ? 'bg-[#EEF3ED] dark:bg-[#283226] text-[#445543] dark:text-[#B1C8AF] font-semibold border border-[#D0E2CC] dark:border-[#354D32]'
                    : 'hover:bg-[#F3F1EA] dark:hover:bg-[#2A2E27] text-[#4B4F42] dark:text-[#D1D4CA] border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Folder className="w-4 h-4 text-[#B5825D] dark:text-[#DDA15E]" />
                  <span>{f.name}</span>
                </div>
                {selectedFolderId === f.id && <Check className="w-4 h-4 text-[#556855] dark:text-[#889E86]" />}
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#EBE7DC] dark:border-[#2F342B] bg-[#F6F4EE]/60 dark:bg-[#292D25]/60 flex items-center justify-end space-x-3 text-xs">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-[#6B705C] dark:text-[#A8ACA0] hover:bg-[#F3F1EA] dark:hover:bg-[#2A2E27] rounded-xl transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleMove}
              disabled={isLoading}
              className="px-5 py-2.5 bg-[#556855] hover:bg-[#455545] active:scale-95 disabled:opacity-50 text-white font-semibold rounded-xl shadow-xs transition"
            >
              {isLoading ? 'Moving...' : 'Move Here'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
