import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FolderPlus, X, AlertCircle } from 'lucide-react';
import { FolderItem } from '../../types';
import { api } from '../../services/api';

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFolderId: string | null;
  onFolderCreated: () => void;
}

export const CreateFolderModal: React.FC<CreateFolderModalProps> = ({
  isOpen,
  onClose,
  currentFolderId,
  onFolderCreated,
}) => {
  const [folderName, setFolderName] = useState('');
  const [folderColor, setFolderColor] = useState('#3B82F6');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const colorPalette = [
    { name: 'Blue', hex: '#3B82F6' },
    { name: 'Emerald', hex: '#10B981' },
    { name: 'Amber', hex: '#F59E0B' },
    { name: 'Purple', hex: '#8B5CF6' },
    { name: 'Rose', hex: '#F43F5E' },
    { name: 'Indigo', hex: '#6366F1' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) {
      setError('Please enter a folder name');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await api.createFolder(folderName.trim(), currentFolderId, folderColor);
      setFolderName('');
      onFolderCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create folder');
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
                <FolderPlus className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#3A3A32] dark:text-[#EDEBE4]">
                Create New Folder
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#8C907F] hover:text-[#3A3A32] dark:text-[#787D70] dark:hover:text-[#EDEBE4] rounded-lg hover:bg-[#F3F1EA] dark:hover:bg-[#2A2E27]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {error && (
              <div className="p-3 rounded-xl bg-[#FAF0ED] dark:bg-[#341F1B] border border-[#F2D0C7] dark:border-[#522922] text-[#B84A39] dark:text-[#E88C7D] flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block font-semibold text-[#4B4F42] dark:text-[#D1D4CA] mb-1.5">
                Folder Name
              </label>
              <input
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="e.g. Project Deliverables"
                autoFocus
                className="w-full px-3.5 py-2.5 bg-[#FDFCFA] dark:bg-[#282C24] border border-[#E2DEC9] dark:border-[#383E33] rounded-xl outline-hidden focus:border-[#556855] text-[#3A3A32] dark:text-[#EDEBE4]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#4B4F42] dark:text-[#D1D4CA] mb-2">
                Folder Color Badge
              </label>
              <div className="flex items-center space-x-2.5">
                {colorPalette.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setFolderColor(c.hex)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-7 h-7 rounded-xl transition-all ${
                      folderColor === c.hex
                        ? 'ring-2 ring-offset-2 ring-[#556855] dark:ring-offset-[#222520] scale-110 shadow-sm'
                        : 'opacity-80 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#EBE7DC] dark:border-[#2F342B]">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2.5 text-[#6B705C] dark:text-[#A8ACA0] hover:bg-[#F3F1EA] dark:hover:bg-[#2A2E27] rounded-xl transition font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !folderName.trim()}
                className="px-5 py-2.5 bg-[#556855] hover:bg-[#455545] active:scale-95 disabled:opacity-50 text-white font-semibold rounded-xl shadow-xs transition"
              >
                {isLoading ? 'Creating...' : 'Create Folder'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
