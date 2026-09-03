import React from 'react';
import {
  FileText,
  FileCode,
  FileSpreadsheet,
  FileImage,
  FileArchive,
  File,
  Star,
  Download,
  Share2,
  Trash2,
  Eye,
  History,
} from 'lucide-react';
import { DocumentItem } from '../../types';
import { formatBytes, formatRelativeTime, getFileTypeBadgeStyle } from '../../utils/formatters';

interface DocumentTableProps {
  documents: DocumentItem[];
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
  sortField?: string;
  onSort?: (field: string) => void;
}

export const DocumentTable: React.FC<DocumentTableProps> = ({
  documents,
  onPreview,
  onDownload,
  onShare,
  onVersions,
  onToggleFavorite,
  onDelete,
  onRestore,
  isTrashView = false,
}) => {
  const renderFileIcon = (type: string) => {
    switch (type) {
      case 'PDF':
        return <FileText className="w-4 h-4 text-[#B84A39] dark:text-[#E88C7D]" />;
      case 'DOC':
      case 'DOCX':
        return <FileText className="w-4 h-4 text-[#3E6585] dark:text-[#8CB4D6]" />;
      case 'XLS':
      case 'XLSX':
        return <FileSpreadsheet className="w-4 h-4 text-[#47703D] dark:text-[#8DBB81]" />;
      case 'PPT':
      case 'PPTX':
        return <FileText className="w-4 h-4 text-[#B06325] dark:text-[#E5A069]" />;
      case 'TXT':
      case 'CODE':
        return <FileCode className="w-4 h-4 text-[#6F4E85] dark:text-[#C5A3DE]" />;
      case 'JPG':
      case 'JPEG':
      case 'PNG':
        return <FileImage className="w-4 h-4 text-[#9A4666] dark:text-[#DD88A7]" />;
      case 'ZIP':
        return <FileArchive className="w-4 h-4 text-[#8A6F27] dark:text-[#DFC478]" />;
      default:
        return <File className="w-4 h-4 text-[#6B705C]" />;
    }
  };

  return (
    <div className="w-full bg-[#FFFFFF] dark:bg-[#222520] rounded-2xl border border-[#E5E2D9] dark:border-[#2F342B] shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F6F4EE] dark:bg-[#292D25] border-b border-[#E5E2D9] dark:border-[#2F342B] text-[#6B705C] dark:text-[#A8ACA0] uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3.5 pl-4 pr-2 w-10"></th>
              <th className="py-3.5 px-3">Name</th>
              <th className="py-3.5 px-3">Type</th>
              <th className="py-3.5 px-3">Size</th>
              <th className="py-3.5 px-3">Version</th>
              <th className="py-3.5 px-3">Owner</th>
              <th className="py-3.5 px-3">Modified</th>
              <th className="py-3.5 pr-4 pl-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EBE7DC] dark:divide-[#2F342B]/80">
            {documents.map((doc) => {
              const badge = getFileTypeBadgeStyle(doc.fileType);
              return (
                <tr
                  key={doc.id}
                  onClick={() => onPreview(doc)}
                  className="hover:bg-[#F7F5EE] dark:hover:bg-[#292D25] cursor-pointer transition group"
                >
                  {/* Favorite column */}
                  <td className="py-3 pl-4 pr-2" onClick={(e) => e.stopPropagation()}>
                    {!isTrashView && (
                      <button
                        onClick={() => onToggleFavorite(doc)}
                        className={`p-1 rounded-md transition ${
                          doc.isFavorite
                            ? 'text-[#C48B5E]'
                            : 'text-[#D0CBBF] dark:text-[#52574A] hover:text-[#7B806F] opacity-0 group-hover:opacity-100'
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${doc.isFavorite ? 'fill-[#C48B5E] text-[#C48B5E]' : ''}`} />
                      </button>
                    )}
                  </td>

                  {/* Name column */}
                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-2.5 min-w-[200px]">
                      <div className="p-1.5 rounded-lg bg-[#F6F4EE] dark:bg-[#292D25] shrink-0">
                        {renderFileIcon(doc.fileType)}
                      </div>
                      <div className="truncate">
                        <span className="font-semibold text-[#3A3A32] dark:text-[#EDEBE4] group-hover:text-[#556855] dark:group-hover:text-[#A7C2A4] block truncate">
                          {doc.name}
                        </span>
                        {doc.description && (
                          <span className="text-[10px] text-[#7B806F] dark:text-[#8E9484] truncate block">
                            {doc.description}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* File Type */}
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${badge.bg} ${badge.text} ${badge.border}`}>
                      {badge.label}
                    </span>
                  </td>

                  {/* Size */}
                  <td className="py-3 px-3 text-[#626657] dark:text-[#A4A99C] font-mono">
                    {formatBytes(doc.fileSizeBytes)}
                  </td>

                  {/* Version */}
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#EEF3ED] dark:bg-[#283226] text-[#445543] dark:text-[#B1C8AF] rounded-md">
                      v{doc.currentVersion}.0
                    </span>
                  </td>

                  {/* Owner */}
                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[#4B4F42] dark:text-[#D1D4CA] font-medium truncate max-w-[120px]">
                        {doc.ownerName}
                      </span>
                      {doc.shares && doc.shares.length > 0 && (
                        <span className="px-1.5 py-0.5 text-[10px] bg-[#EEF3ED] dark:bg-[#283226] text-[#445543] dark:text-[#B1C8AF] rounded font-medium" title="Shared">
                          +{doc.shares.length}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Modified */}
                  <td className="py-3 px-3 text-[#7B806F] dark:text-[#8E9484]">
                    {formatRelativeTime(doc.updatedAt || doc.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="py-3 pr-4 pl-2 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end space-x-1">
                      <button
                        onClick={() => onPreview(doc)}
                        title="Preview"
                        className="p-1.5 text-[#8C907F] hover:text-[#556855] hover:bg-[#F3F1EA] dark:hover:bg-[#2A2E27] rounded-lg transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      {!isTrashView && (
                        <>
                          <button
                            onClick={() => onDownload(doc)}
                            title="Download"
                            className="p-1.5 text-[#8C907F] hover:text-[#47703D] hover:bg-[#F3F1EA] dark:hover:bg-[#2A2E27] rounded-lg transition"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onShare(doc)}
                            title="Share"
                            className="p-1.5 text-[#8C907F] hover:text-[#556855] hover:bg-[#F3F1EA] dark:hover:bg-[#2A2E27] rounded-lg transition"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onVersions(doc)}
                            title="Version History"
                            className="p-1.5 text-[#8C907F] hover:text-[#6F4E85] hover:bg-[#F3F1EA] dark:hover:bg-[#2A2E27] rounded-lg transition"
                          >
                            <History className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                      {isTrashView && onRestore && (
                        <button
                          onClick={() => onRestore(doc)}
                          title="Restore"
                          className="p-1.5 text-[#47703D] hover:bg-[#EEF4EC] dark:hover:bg-[#202E1E] rounded-lg transition font-medium text-xs flex items-center space-x-1"
                        >
                          <History className="w-3.5 h-3.5" />
                          <span>Restore</span>
                        </button>
                      )}
                      <button
                        onClick={() => onDelete(doc)}
                        title={isTrashView ? 'Permanent Delete' : 'Move to Trash'}
                        className="p-1.5 text-[#8C907F] hover:text-[#B84A39] hover:bg-[#FAF0ED] dark:hover:bg-[#341F1B] rounded-lg transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
