import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  History,
  X,
  Upload,
  Download,
  CheckCircle2,
  FileText,
  Clock,
  User,
  Shield,
  ArrowUpRight,
  AlertCircle,
} from 'lucide-react';
import { DocumentItem, DocumentVersion } from '../../types';
import { api } from '../../services/api';
import { formatBytes, formatDate } from '../../utils/formatters';

interface VersionHistoryModalProps {
  document: DocumentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onVersionUploaded: () => void;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  document: doc,
  isOpen,
  onClose,
  onVersionUploaded,
}) => {
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [changeLog, setChangeLog] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadVersions = async () => {
    if (!doc) return;
    setIsLoading(true);
    try {
      const list = await api.getVersions(doc.id);
      setVersions(list);
    } catch (err: any) {
      setError(err.message || 'Failed to load versions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && doc) {
      loadVersions();
      setSelectedFile(null);
      setChangeLog('');
      setError(null);
    }
  }, [isOpen, doc]);

  if (!isOpen || !doc) return null;

  const handleUploadNewVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file to upload as the new version');
      return;
    }

    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      if (changeLog.trim()) formData.append('changeLog', changeLog);

      await api.uploadVersion(doc.id, formData);
      setSelectedFile(null);
      setChangeLog('');
      await loadVersions();
      onVersionUploaded();
    } catch (err: any) {
      setError(err.message || 'Failed to upload new version');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadVersion = async (ver: DocumentVersion) => {
    await api.downloadDocumentBlob(doc.id, ver.fileName, ver.versionNumber);
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
          className="relative w-full max-w-2xl bg-[#FFFFFF] dark:bg-[#222520] rounded-3xl shadow-2xl border border-[#E5E2D9] dark:border-[#2F342B] flex flex-col z-10 max-h-[88vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#EBE7DC] dark:border-[#2F342B] bg-[#F6F4EE]/80 dark:bg-[#292D25]/80">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-[#EEF3ED] dark:bg-[#283226] text-[#556855] dark:text-[#889E86]">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#3A3A32] dark:text-[#EDEBE4]">
                  Version History & Rollback
                </h3>
                <p className="text-xs text-[#7B806F] dark:text-[#8E9484] truncate max-w-sm">
                  {doc.name} (Current: v{doc.currentVersion}.0)
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

          {/* Modal Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {error && (
              <div className="p-3.5 rounded-xl bg-[#FAF0ED] dark:bg-[#341F1B] border border-[#F2D0C7] dark:border-[#522922] text-[#B84A39] dark:text-[#E88C7D] text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Upload Next Version Form */}
            <form onSubmit={handleUploadNewVersion} className="p-4 rounded-2xl bg-[#F6F4EE] dark:bg-[#292D25] border border-[#E5E2D9] dark:border-[#353A2F] text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#3A3A32] dark:text-[#EDEBE4] flex items-center space-x-1.5">
                  <Upload className="w-3.5 h-3.5 text-[#556855] dark:text-[#889E86]" />
                  <span>Upload Next Revision (v{doc.currentVersion + 1}.0)</span>
                </span>
                <span className="text-[11px] text-[#556855] dark:text-[#889E86] font-medium">
                  Auto-partitions to S3
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      setSelectedFile(f || null);
                    }}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2.5 px-3 border border-[#E2DEC9] dark:border-[#383E33] bg-[#FFFFFF] dark:bg-[#222520] rounded-xl text-left font-medium text-[#3A3A32] dark:text-[#EDEBE4] truncate hover:border-[#556855] transition"
                  >
                    {selectedFile ? selectedFile.name : 'Select file revision...'}
                  </button>
                </div>

                <div>
                  <input
                    type="text"
                    value={changeLog}
                    onChange={(e) => setChangeLog(e.target.value)}
                    placeholder="e.g. Added section 4 & updated charts"
                    className="w-full py-2.5 px-3 border border-[#E2DEC9] dark:border-[#383E33] bg-[#FFFFFF] dark:bg-[#222520] rounded-xl text-[#3A3A32] dark:text-[#EDEBE4] placeholder-[#8C907F] outline-hidden focus:border-[#556855]"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!selectedFile || isUploading}
                  className="px-4 py-2.5 bg-[#556855] hover:bg-[#455545] disabled:opacity-50 text-white font-semibold rounded-xl transition shadow-xs flex items-center space-x-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploading ? 'Uploading to S3...' : `Commit v${doc.currentVersion + 1}.0 Revision`}</span>
                </button>
              </div>
            </form>

            {/* Version List Timeline */}
            <div>
              <h4 className="text-xs font-semibold text-[#7B806F] dark:text-[#8E9484] uppercase tracking-wider mb-3">
                Revision History ({versions.length})
              </h4>

              {isLoading ? (
                <div className="text-center py-8 text-xs text-[#8C907F]">Loading version log...</div>
              ) : (
                <div className="space-y-3">
                  {versions.map((ver) => {
                    const isLatest = ver.versionNumber === doc.currentVersion;
                    return (
                      <div
                        key={ver.id}
                        className={`p-4 rounded-2xl border transition ${
                          isLatest
                            ? 'bg-[#EEF3ED]/60 dark:bg-[#283226]/50 border-[#D0E2CC] dark:border-[#354D32]'
                            : 'bg-[#FFFFFF] dark:bg-[#222520] border-[#E5E2D9] dark:border-[#2F342B]'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="mt-0.5">
                              <span className={`px-2 py-0.5 text-[11px] font-bold rounded-md ${
                                isLatest
                                  ? 'bg-[#556855] text-white'
                                  : 'bg-[#F6F4EE] dark:bg-[#292D25] text-[#4B4F42] dark:text-[#D1D4CA]'
                              }`}>
                                v{ver.versionNumber}.0
                              </span>
                            </div>

                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold text-xs text-[#3A3A32] dark:text-[#EDEBE4]">
                                  {ver.fileName}
                                </span>
                                {isLatest && (
                                  <span className="px-1.5 py-0.5 bg-[#EEF4EC] dark:bg-[#202E1E] text-[#47703D] dark:text-[#8DBB81] text-[10px] font-bold rounded">
                                    Current Active
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-[#7B806F] dark:text-[#8E9484] mt-0.5">
                                {ver.changeLog || 'Standard version update'}
                              </p>
                              <div className="flex flex-wrap items-center gap-3 mt-2 text-[10px] text-[#8C907F]">
                                <span className="flex items-center space-x-1">
                                  <User className="w-3 h-3" />
                                  <span>{ver.uploaderName}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{formatDate(ver.createdAt)}</span>
                                </span>
                                <span>{formatBytes(ver.fileSizeBytes)}</span>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDownloadVersion(ver)}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-[#F6F4EE] hover:bg-[#EBE7DC] dark:bg-[#292D25] dark:hover:bg-[#343930] text-[#3A3A32] dark:text-[#EDEBE4] border border-[#E5E2D9] dark:border-[#353A2F] rounded-xl text-xs font-medium transition shrink-0"
                            title="Download this specific historical version"
                          >
                            <Download className="w-3 h-3" />
                            <span>v{ver.versionNumber}.0</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
