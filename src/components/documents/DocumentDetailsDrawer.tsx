import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  HardDrive,
  Cloud,
  Shield,
  FileText,
  Clock,
  User,
  Users,
  Copy,
  Download,
  Share2,
  History,
  Tag,
  Hash,
} from 'lucide-react';
import { DocumentItem } from '../../types';
import { formatBytes, formatDate, getFileTypeBadgeStyle } from '../../utils/formatters';

interface DocumentDetailsDrawerProps {
  document: DocumentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (doc: DocumentItem) => void;
  onShare: (doc: DocumentItem) => void;
  onVersions: (doc: DocumentItem) => void;
}

export const DocumentDetailsDrawer: React.FC<DocumentDetailsDrawerProps> = ({
  document: doc,
  isOpen,
  onClose,
  onDownload,
  onShare,
  onVersions,
}) => {
  if (!isOpen || !doc) return null;

  const badge = getFileTypeBadgeStyle(doc.fileType);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs"
        />

        {/* Drawer panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-md bg-[#FFFFFF] dark:bg-[#222520] shadow-2xl border-l border-[#E5E2D9] dark:border-[#2F342B] flex flex-col z-10 h-full overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#EBE7DC] dark:border-[#2F342B] bg-[#F6F4EE]/80 dark:bg-[#292D25]/80">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-[#556855] dark:text-[#889E86]" />
              <h3 className="text-sm font-bold text-[#3A3A32] dark:text-[#EDEBE4]">Document S3 Properties</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#8C907F] hover:text-[#3A3A32] dark:text-[#787D70] dark:hover:text-[#EDEBE4] rounded-lg hover:bg-[#F3F1EA] dark:hover:bg-[#2A2E27]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
            {/* Main File Snapshot */}
            <div className="p-4 rounded-2xl bg-[#F6F4EE] dark:bg-[#292D25] border border-[#E5E2D9] dark:border-[#353A2F]">
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-0.5 text-xs font-bold rounded-md border ${badge.bg} ${badge.text} ${badge.border}`}>
                  {badge.label}
                </span>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-sm text-[#3A3A32] dark:text-[#EDEBE4] truncate">{doc.name}</h4>
                  <p className="text-[11px] text-[#7B806F] dark:text-[#8E9484] truncate">{doc.originalFileName}</p>
                </div>
              </div>
              {doc.description && (
                <p className="mt-3 text-[#4B4F42] dark:text-[#D1D4CA] leading-relaxed bg-[#FFFFFF] dark:bg-[#222520] p-2.5 rounded-xl border border-[#EBE7DC] dark:border-[#2F342B]">
                  {doc.description}
                </p>
              )}
            </div>

            {/* S3 Storage Specifications */}
            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#7B806F] dark:text-[#8E9484] mb-2 flex items-center space-x-1.5">
                <Cloud className="w-3.5 h-3.5 text-[#556855] dark:text-[#889E86]" />
                <span>AWS S3 Object Metadata</span>
              </h4>
              <div className="bg-[#FFFFFF] dark:bg-[#222520] rounded-2xl border border-[#E5E2D9] dark:border-[#2F342B] divide-y divide-[#EBE7DC] dark:divide-[#2F342B]">
                <div className="p-3 flex justify-between items-center">
                  <span className="text-[#7B806F] dark:text-[#8E9484]">S3 Bucket</span>
                  <span className="font-mono text-[#3A3A32] dark:text-[#EDEBE4] font-medium">{doc.s3Bucket}</span>
                </div>
                <div className="p-3">
                  <div className="flex justify-between items-center text-[#7B806F] dark:text-[#8E9484] mb-1">
                    <span>S3 Object Key</span>
                    <button
                      onClick={() => copyToClipboard(doc.s3Key)}
                      className="text-[#556855] dark:text-[#889E86] hover:underline flex items-center space-x-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>
                  </div>
                  <p className="font-mono text-[11px] text-[#4B4F42] dark:text-[#D1D4CA] break-all bg-[#F6F4EE] dark:bg-[#292D25] p-2 rounded-xl border border-[#E5E2D9] dark:border-[#353A2F]">
                    {doc.s3Key}
                  </p>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <span className="text-[#7B806F] dark:text-[#8E9484]">Storage Class</span>
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#EEF4EC] dark:bg-[#202E1E] text-[#47703D] dark:text-[#8DBB81] rounded">
                    S3 STANDARD (AES-256)
                  </span>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <span className="text-[#7B806F] dark:text-[#8E9484]">MIME Type</span>
                  <span className="font-mono text-[#4B4F42] dark:text-[#D1D4CA]">{doc.mimeType}</span>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <span className="text-[#7B806F] dark:text-[#8E9484]">File Size</span>
                  <span className="font-medium text-[#3A3A32] dark:text-[#EDEBE4]">{formatBytes(doc.fileSizeBytes)}</span>
                </div>
              </div>
            </div>

            {/* Ownership & Collaboration */}
            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#7B806F] dark:text-[#8E9484] mb-2 flex items-center space-x-1.5">
                <Users className="w-3.5 h-3.5 text-[#556855]" />
                <span>Ownership & Permissions</span>
              </h4>
              <div className="bg-[#FFFFFF] dark:bg-[#222520] rounded-2xl border border-[#E5E2D9] dark:border-[#2F342B] p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[#7B806F] dark:text-[#8E9484]">Document Owner</span>
                  <span className="font-semibold text-[#3A3A32] dark:text-[#EDEBE4]">{doc.ownerName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#7B806F] dark:text-[#8E9484]">Active Collaborators</span>
                  <span className="font-medium text-[#556855] dark:text-[#889E86]">
                    {doc.shares ? `${doc.shares.length} shared users` : 'Private'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#7B806F] dark:text-[#8E9484]">Current Version</span>
                  <span className="px-2 py-0.5 bg-[#FAF2EB] dark:bg-[#33251E] text-[#B5825D] dark:text-[#DDA15E] rounded font-semibold text-[10px]">
                    v{doc.currentVersion}.0 ({doc.versionCount} total)
                  </span>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#7B806F] dark:text-[#8E9484] mb-2 flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-[#7B806F]" />
                <span>Audit Timestamps</span>
              </h4>
              <div className="bg-[#FFFFFF] dark:bg-[#222520] rounded-2xl border border-[#E5E2D9] dark:border-[#2F342B] p-3 space-y-2 text-[#7B806F] dark:text-[#8E9484]">
                <div className="flex justify-between">
                  <span>Created At:</span>
                  <span className="font-medium text-[#3A3A32] dark:text-[#EDEBE4]">{formatDate(doc.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Modified:</span>
                  <span className="font-medium text-[#3A3A32] dark:text-[#EDEBE4]">{formatDate(doc.updatedAt || doc.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Drawer Actions */}
          <div className="p-4 border-t border-[#EBE7DC] dark:border-[#2F342B] bg-[#F6F4EE]/60 dark:bg-[#292D25]/60 flex items-center space-x-2">
            <button
              onClick={() => onDownload(doc)}
              className="flex-1 inline-flex items-center justify-center space-x-2 py-2.5 px-3 bg-[#556855] hover:bg-[#455545] active:scale-95 text-white rounded-xl text-xs font-semibold shadow-xs transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
            <button
              onClick={() => onShare(doc)}
              className="inline-flex items-center space-x-1.5 py-2.5 px-3 bg-[#EBE7DC] dark:bg-[#343930] hover:bg-[#E2DEC9] text-[#3A3A32] dark:text-[#EDEBE4] rounded-xl text-xs font-semibold transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
            <button
              onClick={() => onVersions(doc)}
              className="inline-flex items-center space-x-1.5 py-2.5 px-3 bg-[#EBE7DC] dark:bg-[#343930] hover:bg-[#E2DEC9] text-[#3A3A32] dark:text-[#EDEBE4] rounded-xl text-xs font-semibold transition"
            >
              <History className="w-3.5 h-3.5" />
              <span>Versions</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
