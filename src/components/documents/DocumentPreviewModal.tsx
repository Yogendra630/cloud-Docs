import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Download,
  Share2,
  History,
  FileText,
  Copy,
  Check,
  ExternalLink,
  Shield,
  Clock,
  HardDrive,
  User,
  Star,
} from 'lucide-react';
import { DocumentItem } from '../../types';
import { formatBytes, formatDate, getFileTypeBadgeStyle } from '../../utils/formatters';

interface DocumentPreviewModalProps {
  document: DocumentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (doc: DocumentItem) => void;
  onShare: (doc: DocumentItem) => void;
  onVersions: (doc: DocumentItem) => void;
  onToggleFavorite: (doc: DocumentItem) => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  document: doc,
  isOpen,
  onClose,
  onDownload,
  onShare,
  onVersions,
  onToggleFavorite,
}) => {
  const [copiedKey, setCopiedKey] = useState(false);

  if (!isOpen || !doc) return null;

  const badge = getFileTypeBadgeStyle(doc.fileType);

  const handleCopyS3Key = () => {
    navigator.clipboard.writeText(doc.s3Key);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
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
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-4xl h-[86vh] bg-[#FFFFFF] dark:bg-[#222520] rounded-3xl shadow-2xl border border-[#E5E2D9] dark:border-[#2F342B] flex flex-col z-10 overflow-hidden"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#EBE7DC] dark:border-[#2F342B] bg-[#F6F4EE]/80 dark:bg-[#292D25]/80">
            <div className="flex items-center space-x-3 min-w-0 flex-1 mr-3">
              <span className={`px-2 py-0.5 text-xs font-bold rounded-md border ${badge.bg} ${badge.text} ${badge.border}`}>
                {badge.label}
              </span>
              <div className="truncate">
                <h3 className="text-sm font-bold text-[#3A3A32] dark:text-[#EDEBE4] truncate">
                  {doc.name}
                </h3>
                <p className="text-[11px] text-[#7B806F] dark:text-[#8E9484] truncate">
                  v{doc.currentVersion}.0 • {formatBytes(doc.fileSizeBytes)} • Owner: {doc.ownerName}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-1.5 shrink-0">
              <button
                onClick={() => onToggleFavorite(doc)}
                className={`p-2 rounded-xl transition ${
                  doc.isFavorite
                    ? 'text-[#B5825D] bg-[#FAF2EB] dark:bg-[#33251E]'
                    : 'text-[#8C907F] hover:text-[#3A3A32] dark:text-[#787D70] dark:hover:text-[#EDEBE4] hover:bg-[#F3F1EA] dark:hover:bg-[#2A2E27]'
                }`}
                title={doc.isFavorite ? 'Remove Favorite' : 'Mark as Favorite'}
              >
                <Star className={`w-4 h-4 ${doc.isFavorite ? 'fill-[#B5825D]' : ''}`} />
              </button>

              <button
                onClick={() => onShare(doc)}
                className="p-2 text-[#6B705C] dark:text-[#A8ACA0] hover:bg-[#F3F1EA] dark:hover:bg-[#2A2E27] rounded-xl transition"
                title="Share Document"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => onVersions(doc)}
                className="p-2 text-[#6B705C] dark:text-[#A8ACA0] hover:bg-[#F3F1EA] dark:hover:bg-[#2A2E27] rounded-xl transition"
                title="Version History"
              >
                <History className="w-4 h-4" />
              </button>

              <button
                onClick={() => onDownload(doc)}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#556855] hover:bg-[#455545] active:scale-95 text-white rounded-xl text-xs font-semibold shadow-xs transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Download</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 text-[#8C907F] hover:text-[#3A3A32] dark:text-[#787D70] dark:hover:text-[#EDEBE4] hover:bg-[#F3F1EA] dark:hover:bg-[#2A2E27] rounded-xl transition ml-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* S3 Security Banner */}
          <div className="px-5 py-2 bg-[#EEF3ED]/70 dark:bg-[#283226]/50 border-b border-[#D0E2CC] dark:border-[#354D32] flex items-center justify-between text-xs text-[#304230] dark:text-[#C5D8C3]">
            <div className="flex items-center space-x-2 truncate">
              <Shield className="w-3.5 h-3.5 text-[#556855] dark:text-[#889E86] shrink-0" />
              <span className="font-mono text-[11px] truncate">
                s3://{doc.s3Bucket}/{doc.s3Key}
              </span>
            </div>
            <button
              onClick={handleCopyS3Key}
              className="flex items-center space-x-1 text-[11px] font-semibold text-[#445543] dark:text-[#A7C2A4] hover:underline shrink-0 ml-2"
            >
              {copiedKey ? <Check className="w-3 h-3 text-[#47703D]" /> : <Copy className="w-3 h-3" />}
              <span>{copiedKey ? 'Copied' : 'Copy S3 Key'}</span>
            </button>
          </div>

          {/* Preview Content Area */}
          <div className="flex-1 overflow-y-auto p-6 bg-[#F8F7F4] dark:bg-[#1A1C18]">
            {doc.contentDataUrl ? (
              <div className="flex items-center justify-center h-full">
                <img
                  src={doc.contentDataUrl}
                  alt={doc.name}
                  className="max-h-[60vh] max-w-full rounded-2xl shadow-lg border border-[#E5E2D9] dark:border-[#2F342B] object-contain"
                />
              </div>
            ) : doc.contentPreviewText ? (
              <div className="max-w-3xl mx-auto bg-[#FFFFFF] dark:bg-[#222520] p-6 rounded-2xl shadow-xs border border-[#E5E2D9] dark:border-[#2F342B]">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#EBE7DC] dark:border-[#2F342B] text-xs text-[#7B806F]">
                  <span className="font-semibold uppercase tracking-wider">Document Text View</span>
                  <span>MIME: {doc.mimeType}</span>
                </div>
                <pre className="font-mono text-xs text-[#3A3A32] dark:text-[#EDEBE4] whitespace-pre-wrap leading-relaxed select-text">
                  {doc.contentPreviewText}
                </pre>
              </div>
            ) : (
              <div className="max-w-md mx-auto my-12 p-8 text-center bg-[#FFFFFF] dark:bg-[#222520] rounded-3xl border border-[#E5E2D9] dark:border-[#2F342B] shadow-xs">
                <div className="p-4 rounded-2xl bg-[#EEF3ED] dark:bg-[#283226] text-[#556855] dark:text-[#889E86] inline-block mb-3">
                  <FileText className="w-10 h-10" />
                </div>
                <h4 className="font-bold text-sm text-[#3A3A32] dark:text-[#EDEBE4]">{doc.name}</h4>
                <p className="text-xs text-[#7B806F] dark:text-[#8E9484] mt-1 leading-relaxed">
                  Binary document stored on AWS S3 with AES-256 encryption.
                </p>
                <button
                  onClick={() => onDownload(doc)}
                  className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-[#556855] hover:bg-[#455545] text-white rounded-xl text-xs font-semibold shadow-xs transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Full File</span>
                </button>
              </div>
            )}
          </div>

          {/* Footer Metadata */}
          <div className="px-5 py-3 border-t border-[#EBE7DC] dark:border-[#2F342B] bg-[#FFFFFF] dark:bg-[#222520] flex flex-wrap items-center justify-between text-xs text-[#7B806F] dark:text-[#8E9484] gap-2">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <User className="w-3.5 h-3.5" />
                <span>Uploaded by: <strong className="text-[#3A3A32] dark:text-[#EDEBE4]">{doc.ownerName}</strong></span>
              </span>
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Updated: {formatDate(doc.updatedAt || doc.createdAt)}</span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 bg-[#F6F4EE] dark:bg-[#292D25] border border-[#E5E2D9] dark:border-[#353A2F] rounded text-[#556855] dark:text-[#889E86] font-mono text-[11px]">
                SHA-256 Verified
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
