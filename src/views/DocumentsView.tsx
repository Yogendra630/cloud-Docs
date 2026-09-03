import React, { useState, useEffect } from 'react';
import {
  LayoutGrid,
  List,
  UploadCloud,
  FolderPlus,
} from 'lucide-react';
import { DocumentItem, FolderItem } from '../types';
import { api } from '../services/api';
import { DocumentCard } from '../components/documents/DocumentCard';
import { DocumentTable } from '../components/documents/DocumentTable';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { EmptyState } from '../components/common/EmptyState';
import { DocumentCardSkeleton } from '../components/common/SkeletonLoader';

interface DocumentsViewProps {
  onOpenUpload: () => void;
  onOpenCreateFolder: () => void;
  onPreviewDoc: (doc: DocumentItem) => void;
  onDetailsDoc: (doc: DocumentItem) => void;
  onDownloadDoc: (doc: DocumentItem) => void;
  onShareDoc: (doc: DocumentItem) => void;
  onVersionsDoc: (doc: DocumentItem) => void;
  onMoveDoc: (doc: DocumentItem) => void;
  onRenameDoc: (doc: DocumentItem) => void;
  onToggleFavorite: (doc: DocumentItem) => void;
  onDeleteDoc: (doc: DocumentItem) => void;
  activeFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  onOpenUpload,
  onOpenCreateFolder,
  onPreviewDoc,
  onDetailsDoc,
  onDownloadDoc,
  onShareDoc,
  onVersionsDoc,
  onMoveDoc,
  onRenameDoc,
  onToggleFavorite,
  onDeleteDoc,
  activeFolderId,
  onSelectFolder,
}) => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('updatedAt_desc');
  const [searchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [docsData, foldersData] = await Promise.all([
        api.getDocuments({
          folderId: activeFolderId !== null ? activeFolderId : undefined,
          type: selectedType !== 'ALL' ? selectedType : undefined,
          sort: sortBy,
          search: searchQuery.trim() || undefined,
        }),
        api.getFolders(),
      ]);
      setDocuments(docsData);
      setFolders(foldersData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeFolderId, selectedType, sortBy, searchQuery]);

  // Current folder calculation
  const currentFolder = folders.find((f) => f.id === activeFolderId) || null;
  const childFolders = folders.filter((f) => (activeFolderId ? f.parentId === activeFolderId : !f.parentId));

  const breadcrumbs = currentFolder
    ? [{ id: currentFolder.id, name: currentFolder.name }]
    : [];

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#3A3A32] dark:text-[#EDEBE4]">
            {currentFolder ? currentFolder.name : 'My Documents'}
          </h1>
          <Breadcrumbs items={breadcrumbs} onSelect={onSelectFolder} />
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={onOpenCreateFolder}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-[#4B4F42] dark:text-[#D1D4CA] bg-[#FFFFFF] dark:bg-[#222520] border border-[#E5E2D9] dark:border-[#2F342B] hover:bg-[#F3F1EA] dark:hover:bg-[#2A2E27] rounded-xl transition shadow-2xs"
          >
            <FolderPlus className="w-3.5 h-3.5 text-[#B5825D]" />
            <span>New Folder</span>
          </button>
          <button
            onClick={onOpenUpload}
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#556855] hover:bg-[#455545] active:scale-95 rounded-xl shadow-xs transition"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload File</span>
          </button>
        </div>
      </div>

      {/* Filter and View Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#FFFFFF] dark:bg-[#222520] rounded-2xl border border-[#E5E2D9] dark:border-[#2F342B] shadow-2xs text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* File Type Filter Pills */}
          {['ALL', 'PDF', 'DOCX', 'XLSX', 'PPTX', 'CODE', 'JPG', 'ZIP'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-xl font-medium transition ${
                selectedType === type
                  ? 'bg-[#556855] text-white shadow-2xs'
                  : 'bg-[#F3F1EA] dark:bg-[#2A2E27] text-[#6B705C] dark:text-[#A8ACA0] hover:bg-[#EBE7DC] dark:hover:bg-[#34392F]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 bg-[#F3F1EA] dark:bg-[#2A2E27] border border-[#E2DEC9] dark:border-[#383E33] rounded-xl text-[#3A3A32] dark:text-[#EDEBE4] font-medium outline-hidden"
          >
            <option value="updatedAt_desc">Latest Modified</option>
            <option value="name_asc">Name (A-Z)</option>
            <option value="fileSizeBytes_desc">Size (Largest)</option>
            <option value="fileSizeBytes_asc">Size (Smallest)</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex bg-[#F3F1EA] dark:bg-[#2A2E27] p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'grid'
                  ? 'bg-[#FFFFFF] dark:bg-[#34392F] text-[#556855] dark:text-[#A7C2A4] shadow-2xs'
                  : 'text-[#8C907F] hover:text-[#3A3A32]'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'table'
                  ? 'bg-[#FFFFFF] dark:bg-[#34392F] text-[#556855] dark:text-[#A7C2A4] shadow-2xs'
                  : 'text-[#8C907F] hover:text-[#3A3A32]'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Subfolder Cards (if in folder view or root has folders) */}
      {childFolders.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-[#7B806F] dark:text-[#8E9484] uppercase tracking-wider mb-3">
            Folders ({childFolders.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {childFolders.map((f) => (
              <div
                key={f.id}
                onClick={() => onSelectFolder(f.id)}
                className="p-3 rounded-xl bg-[#FFFFFF] dark:bg-[#222520] border border-[#E5E2D9] dark:border-[#2F342B] hover:border-[#556855] dark:hover:border-[#7D947B] cursor-pointer transition flex items-center space-x-2.5 group"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs shrink-0 shadow-2xs"
                  style={{ backgroundColor: f.color || '#556855' }}
                >
                  📁
                </div>
                <div className="truncate">
                  <p className="text-xs font-semibold text-[#3A3A32] dark:text-[#EDEBE4] truncate group-hover:text-[#556855] dark:group-hover:text-[#A7C2A4]">
                    {f.name}
                  </p>
                  <p className="text-[10px] text-[#7B806F] dark:text-[#8E9484]">{f.documentCount || 0} files</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Documents Grid / Table / Empty */}
      <div>
        <h3 className="text-xs font-bold text-[#7B806F] dark:text-[#8E9484] uppercase tracking-wider mb-3">
          Files ({documents.length})
        </h3>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <DocumentCardSkeleton key={n} />
            ))}
          </div>
        ) : documents.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {documents.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  onPreview={onPreviewDoc}
                  onDetails={onDetailsDoc}
                  onDownload={onDownloadDoc}
                  onShare={onShareDoc}
                  onVersions={onVersionsDoc}
                  onMove={onMoveDoc}
                  onRename={onRenameDoc}
                  onToggleFavorite={onToggleFavorite}
                  onDelete={onDeleteDoc}
                />
              ))}
            </div>
          ) : (
            <DocumentTable
              documents={documents}
              onPreview={onPreviewDoc}
              onDetails={onDetailsDoc}
              onDownload={onDownloadDoc}
              onShare={onShareDoc}
              onVersions={onVersionsDoc}
              onMove={onMoveDoc}
              onRename={onRenameDoc}
              onToggleFavorite={onToggleFavorite}
              onDelete={onDeleteDoc}
            />
          )
        ) : (
          <EmptyState
            icon="upload"
            title="No documents in this folder"
            description="Upload PDF, DOCX, Code, or image files to store them securely in AWS S3."
            actionLabel="Upload First Document"
            onAction={onOpenUpload}
          />
        )}
      </div>
    </div>
  );
};
