import React, { useState } from 'react';
import {
  FileText,
  FileCode,
  FileSpreadsheet,
  FileImage,
  FileArchive,
  File,
  Star,
  MoreVertical,
  Download,
  Share2,
  Trash2,
  Eye,
  History,
  FolderInput,
  Edit2,
  Users,
} from 'lucide-react';
import { DocumentItem } from '../../types';
import { formatBytes, formatRelativeTime, getFileTypeBadgeStyle } from '../../utils/formatters';

interface DocumentCardProps {
  document: DocumentItem;
  onPreview: (doc: DocumentItem) => void;
  onDetails: (doc: DocumentItem) => void;
  onDownload: (doc: DocumentItem) => void;
  onShare: (doc: DocumentItem) => void;
  onVersions: (doc: DocumentItem) => void;
  onMove: (doc: DocumentItem) => void;
  onRename: (doc: DocumentItem) => void;
  onToggleFavorite: (doc: DocumentItem) => void;
  onDelete: (doc: DocumentItem) => void;
  onRestore?: (doc: DocumentItem) => void;
  isTrashView?: boolean;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document: doc,
  onPreview,
  onDetails,
  onDownload,
  onShare,
  onVersions,
  onMove,
  onRename,
  onToggleFavorite,
  onDelete,
  onRestore,
  isTrashView = false,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const badge = getFileTypeBadgeStyle(doc.fileType);

  const renderFileIcon = () => {
    switch (doc.fileType) {
      case 'PDF':
        return <FileText className="w-6 h-6 text-[#B84A39] dark:text-[#E88C7D]" />;
      case 'DOC':
      case 'DOCX':
        return <FileText className="w-6 h-6 text-[#3E6585] dark:text-[#8CB4D6]" />;
      case 'XLS':
      case 'XLSX':
        return <FileSpreadsheet className="w-6 h-6 text-[#47703D] dark:text-[#8DBB81]" />;
      case 'PPT':
      case 'PPTX':
        return <FileText className="w-6 h-6 text-[#B06325] dark:text-[#E5A069]" />;
      case 'TXT':
      case 'CODE':
        return <FileCode className="w-6 h-6 text-[#6F4E85] dark:text-[#C5A3DE]" />;
      case 'JPG':
      case 'JPEG':
      case 'PNG':
        return <FileImage className="w-6 h-6 text-[#9A4666] dark:text-[#DD88A7]" />;
      case 'ZIP':
        return <FileArchive className="w-6 h-6 text-[#8A6F27] dark:text-[#DFC478]" />;
      default:
        return <File className="w-6 h-6 text-[#6B705C]" />;
    }
  };

  return (
    <div
      onClick={() => onPreview(doc)}
      className="group relative p-4 rounded-2xl bg-[#FFFFFF] dark:bg-[#222520] border border-[#E5E2D9] dark:border-[#2F342B] hover:border-[#556855] dark:hover:border-[#7D947B] hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      {/* Top row: Icon, Type Badge, Star & Menu */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2.5 rounded-xl bg-[#F6F4EE] dark:bg-[#292D25] border border-[#EBE7DC] dark:border-[#353A2F] group-hover:scale-105 transition">
            {renderFileIcon()}
          </div>
          <div>
            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md border ${badge.bg} ${badge.text} ${badge.border}`}>
              {badge.label}
            </span>
            {doc.versionCount > 1 && (
              <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-semibold bg-[#EEF3ED] dark:bg-[#283226] text-[#445543] dark:text-[#B1C8AF] rounded-md">
                v{doc.currentVersion}.0
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
          {!isTrashView && (
            <button
              onClick={() => onToggleFavorite(doc)}
              className={`p-1.5 rounded-lg transition ${
                doc.isFavorite
                  ? 'text-[#C48B5E] hover:text-[#A3704C]'
                  : 'text-[#D0CBBF] dark:text-[#52574A] hover:text-[#7B806F] dark:hover:text-[#A4A99C] opacity-0 group-hover:opacity-100'
              }`}
              title={doc.isFavorite ? 'Remove Favorite' : 'Mark as Favorite'}
            >
              <Star className={`w-4 h-4 ${doc.isFavorite ? 'fill-[#C48B5E] text-[#C48B5E]' : ''}`} />
            </button>
          )}

          {/* Context Action Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 text-[#8C907F] hover:text-[#3A3A32] dark:text-[#787D70] dark:hover:text-[#EDEBE4] hover:bg-[#F3F1EA] dark:hover:bg-[#2A2E27] rounded-lg transition"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-[#FFFFFF] dark:bg-[#222520] rounded-xl shadow-xl border border-[#E5E2D9] dark:border-[#2F342B] py-1.5 z-30 divide-y divide-[#EBE7DC] dark:divide-[#2F342B] text-xs">
                <div className="py-1">
                  <button
                    onClick={() => {
                      onPreview(doc);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#F3F1EA] dark:hover:bg-[#2A2E27] flex items-center space-x-2 text-[#4B4F42] dark:text-[#D1D4CA]"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#556855] dark:text-[#889E86]" />
                    <span>Quick Preview</span>
                  </button>
                  <button
                    onClick={() => {
                      onDetails(doc);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#F3F1EA] dark:hover:bg-[#2A2E27] flex items-center space-x-2 text-[#4B4F42] dark:text-[#D1D4CA]"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#3E6585] dark:text-[#8CB4D6]" />
                    <span>View S3 Details</span>
                  </button>
                  {!isTrashView && (
                    <button
                      onClick={() => {
                        onDownload(doc);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#F3F1EA] dark:hover:bg-[#2A2E27] flex items-center space-x-2 text-[#4B4F42] dark:text-[#D1D4CA]"
                    >
                      <Download className="w-3.5 h-3.5 text-[#47703D] dark:text-[#8DBB81]" />
                      <span>Download File</span>
                    </button>
                  )}
                </div>

                {!isTrashView && (
                  <div className="py-1">
                    <button
                      onClick={() => {
                        onShare(doc);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#F3F1EA] dark:hover:bg-[#2A2E27] flex items-center space-x-2 text-[#4B4F42] dark:text-[#D1D4CA]"
                    >
                      <Share2 className="w-3.5 h-3.5 text-[#556855] dark:text-[#889E86]" />
                      <span>Share & Permissions</span>
                    </button>
                    <button
                      onClick={() => {
                        onVersions(doc);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#F3F1EA] dark:hover:bg-[#2A2E27] flex items-center space-x-2 text-[#4B4F42] dark:text-[#D1D4CA]"
                    >
                      <History className="w-3.5 h-3.5 text-[#6F4E85] dark:text-[#C5A3DE]" />
                      <span>Version History</span>
                    </button>
                    <button
                      onClick={() => {
                        onMove(doc);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#F3F1EA] dark:hover:bg-[#2A2E27] flex items-center space-x-2 text-[#4B4F42] dark:text-[#D1D4CA]"
                    >
                      <FolderInput className="w-3.5 h-3.5 text-[#B5825D] dark:text-[#DDA15E]" />
                      <span>Move to Folder</span>
                    </button>
                    <button
                      onClick={() => {
                        onRename(doc);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#F3F1EA] dark:hover:bg-[#2A2E27] flex items-center space-x-2 text-[#4B4F42] dark:text-[#D1D4CA]"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-[#8C907F]" />
                      <span>Rename</span>
                    </button>
                  </div>
                )}

                <div className="py-1">
                  {isTrashView && onRestore ? (
                    <button
                      onClick={() => {
                        onRestore(doc);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-[#EEF3ED] dark:hover:bg-[#283226] flex items-center space-x-2 text-[#47703D] dark:text-[#8DBB81] font-semibold"
                    >
                      <History className="w-3.5 h-3.5" />
                      <span>Restore to Files</span>
                    </button>
                  ) : null}
                  <button
                    onClick={() => {
                      onDelete(doc);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#FAF0ED] dark:hover:bg-[#341F1B] flex items-center space-x-2 text-[#B84A39] dark:text-[#E88C7D] font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isTrashView ? 'Delete Permanently' : 'Move to Trash'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Center: File Title & Description */}
      <div className="mt-4 mb-2">
        <h4 className="font-semibold text-sm text-[#3A3A32] dark:text-[#EDEBE4] truncate group-hover:text-[#556855] dark:group-hover:text-[#A7C2A4] transition" title={doc.name}>
          {doc.name}
        </h4>
        <p className="text-[11px] text-[#7B806F] dark:text-[#8E9484] line-clamp-1 mt-0.5">
          {doc.description || doc.originalFileName}
        </p>
      </div>

      {/* Bottom info: Size, Date, Owner/Collaborators */}
      <div className="pt-3 border-t border-[#EBE7DC] dark:border-[#2F342B] flex items-center justify-between text-[11px] text-[#8C907F] dark:text-[#787D70]">
        <span>{formatBytes(doc.fileSizeBytes)}</span>
        <div className="flex items-center space-x-2">
          {doc.shares && doc.shares.length > 0 && (
            <span className="flex items-center space-x-1 text-[#556855] dark:text-[#889E86] font-medium" title={`Shared with ${doc.shares.length} users`}>
              <Users className="w-3 h-3" />
              <span>{doc.shares.length}</span>
            </span>
          )}
          <span>{formatRelativeTime(doc.updatedAt || doc.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};
