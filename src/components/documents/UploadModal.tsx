import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  UploadCloud,
  X,
  FileText,
  Folder,
  Tag,
  CheckCircle2,
  AlertCircle,
  HardDrive,
  Shield,
  Cloud,
} from 'lucide-react';
import { FolderItem } from '../../types';
import { api } from '../../services/api';
import { formatBytes } from '../../utils/formatters';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFolderId: string | null;
  folders: FolderItem[];
  onUploadSuccess: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  currentFolderId,
  folders,
  onUploadSuccess,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [docName, setDocName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(currentFolderId);
  const [tags, setTags] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setFile(null);
      setDocName('');
      setDescription('');
      setSelectedFolderId(currentFolderId);
      setTags('');
      setIsDragging(false);
      setIsUploading(false);
      setUploadProgress(0);
      setError(null);
    }
  }, [isOpen, currentFolderId]);

  if (!isOpen) return null;

  const handleFileSelect = (selected: File) => {
    setFile(selected);
    if (!docName) {
      // Strip extension for friendly name
      const nameWithoutExt = selected.name.replace(/\.[^/.]+$/, '');
      setDocName(nameWithoutExt);
    }
    setError(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0 && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select or drag a file to upload');
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', docName.trim() || file.name);
      if (description.trim()) formData.append('description', description.trim());
      if (selectedFolderId) formData.append('folderId', selectedFolderId);
      if (tags.trim()) formData.append('tags', tags.trim());

      setUploadProgress(65);
      await api.uploadDocument(formData);
      setUploadProgress(100);

      setTimeout(() => {
        onUploadSuccess();
        onClose();
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Upload failed. Please check S3 connection.');
      setIsUploading(false);
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
          className="relative w-full max-w-xl bg-[#FFFFFF] dark:bg-[#222520] rounded-3xl shadow-2xl border border-[#E5E2D9] dark:border-[#2F342B] flex flex-col z-10 max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#EBE7DC] dark:border-[#2F342B] bg-[#F6F4EE]/80 dark:bg-[#292D25]/80">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-[#EEF3ED] dark:bg-[#283226] text-[#556855] dark:text-[#889E86]">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#3A3A32] dark:text-[#EDEBE4]">
                  Upload Document to Cloud
                </h3>
                <p className="text-xs text-[#7B806F] dark:text-[#8E9484]">
                  Target S3 Bucket: <span className="font-mono text-[#556855] dark:text-[#889E86]">clouddocs-storage</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#8C907F] hover:text-[#3A3A32] dark:text-[#787D70] dark:hover:text-[#EDEBE4] rounded-lg hover:bg-[#F3F1EA] dark:hover:bg-[#2A2E27]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Upload Form */}
          <form onSubmit={handleUpload} className="p-6 space-y-4 text-xs overflow-y-auto">
            {error && (
              <div className="p-3 rounded-xl bg-[#FAF0ED] dark:bg-[#341F1B] border border-[#F2D0C7] dark:border-[#522922] text-[#B84A39] dark:text-[#E88C7D] flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Drag and Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-[#556855] bg-[#EEF3ED]/60 dark:bg-[#283226]/60'
                  : file
                  ? 'border-[#8DBB81] bg-[#EEF4EC]/40 dark:bg-[#202E1E]/40'
                  : 'border-[#E5E1D5] dark:border-[#353A2F] hover:border-[#556855] bg-[#F6F4EE]/60 dark:bg-[#292D25]/60'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFileSelect(f);
                }}
                className="hidden"
              />

              {file ? (
                <div className="flex flex-col items-center">
                  <div className="p-3 rounded-2xl bg-[#EEF4EC] dark:bg-[#202E1E] text-[#47703D] dark:text-[#8DBB81] mb-2">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <p className="font-bold text-sm text-[#3A3A32] dark:text-[#EDEBE4] truncate max-w-sm">
                    {file.name}
                  </p>
                  <p className="text-[#7B806F] dark:text-[#8E9484] mt-0.5">
                    {formatBytes(file.size)} • Click to change file
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="p-3 rounded-2xl bg-[#EEF3ED] dark:bg-[#283226] text-[#556855] dark:text-[#889E86] mb-2">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <p className="font-semibold text-sm text-[#3A3A32] dark:text-[#EDEBE4]">
                    Drop your document here, or <span className="text-[#556855] dark:text-[#889E86] underline">browse</span>
                  </p>
                  <p className="text-[#8C907F] text-[11px] mt-1">
                    Supports PDF, DOCX, XLSX, PPTX, Images, ZIP, Source Code (Max 50MB)
                  </p>
                </div>
              )}
            </div>

            {/* Document Title Input */}
            <div>
              <label className="block font-semibold text-[#4B4F42] dark:text-[#D1D4CA] mb-1">
                Document Title
              </label>
              <input
                type="text"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                placeholder="e.g. AWS Cloud Architecture Report 2026"
                className="w-full px-3.5 py-2.5 bg-[#FDFCFA] dark:bg-[#282C24] border border-[#E2DEC9] dark:border-[#383E33] rounded-xl outline-hidden focus:border-[#556855] text-[#3A3A32] dark:text-[#EDEBE4]"
              />
            </div>

            {/* Folder Destination & Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#4B4F42] dark:text-[#D1D4CA] mb-1 flex items-center space-x-1">
                  <Folder className="w-3.5 h-3.5 text-[#B5825D]" />
                  <span>Target Folder</span>
                </label>
                <select
                  value={selectedFolderId || ''}
                  onChange={(e) => setSelectedFolderId(e.target.value || null)}
                  className="w-full px-3.5 py-2.5 bg-[#FDFCFA] dark:bg-[#282C24] border border-[#E2DEC9] dark:border-[#383E33] rounded-xl outline-hidden text-[#3A3A32] dark:text-[#EDEBE4]"
                >
                  <option value="">(Root Folder)</option>
                  {folders.map((f) => (
                    <option key={f.id} value={f.id}>
                      📁 {f.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#4B4F42] dark:text-[#D1D4CA] mb-1 flex items-center space-x-1">
                  <Tag className="w-3.5 h-3.5 text-[#556855]" />
                  <span>Tags (Comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="cloud, aws, research"
                  className="w-full px-3.5 py-2.5 bg-[#FDFCFA] dark:bg-[#282C24] border border-[#E2DEC9] dark:border-[#383E33] rounded-xl outline-hidden focus:border-[#556855] text-[#3A3A32] dark:text-[#EDEBE4]"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block font-semibold text-[#4B4F42] dark:text-[#D1D4CA] mb-1">
                Description / Notes (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Brief summary of this document's purpose..."
                className="w-full px-3.5 py-2.5 bg-[#FDFCFA] dark:bg-[#282C24] border border-[#E2DEC9] dark:border-[#383E33] rounded-xl outline-hidden focus:border-[#556855] text-[#3A3A32] dark:text-[#EDEBE4] resize-none"
              />
            </div>

            {/* Upload Progress Bar */}
            {isUploading && (
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[11px] font-medium text-[#7B806F]">
                  <span>Encrypting & streaming to S3...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-[#EBE7DC] dark:bg-[#343930] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#556855] rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#EBE7DC] dark:border-[#2F342B]">
              <button
                type="button"
                onClick={onClose}
                disabled={isUploading}
                className="px-4 py-2.5 text-[#6B705C] dark:text-[#A8ACA0] hover:bg-[#F3F1EA] dark:hover:bg-[#2A2E27] rounded-xl transition font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!file || isUploading}
                className="px-5 py-2.5 bg-[#556855] hover:bg-[#455545] active:scale-95 disabled:opacity-50 text-white font-semibold rounded-xl shadow-xs transition flex items-center space-x-2"
              >
                <UploadCloud className="w-4 h-4" />
                <span>{isUploading ? 'Uploading to S3...' : 'Upload Document'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
