import React, { useState, useEffect } from 'react';
import { Users2, Shield } from 'lucide-react';
import { DocumentItem } from '../types';
import { api } from '../services/api';
import { DocumentCard } from '../components/documents/DocumentCard';
import { EmptyState } from '../components/common/EmptyState';

interface SharedWithMeViewProps {
  onPreviewDoc: (doc: DocumentItem) => void;
  onDetailsDoc: (doc: DocumentItem) => void;
  onDownloadDoc: (doc: DocumentItem) => void;
  onShareDoc: (doc: DocumentItem) => void;
  onVersionsDoc: (doc: DocumentItem) => void;
  onMoveDoc: (doc: DocumentItem) => void;
  onRenameDoc: (doc: DocumentItem) => void;
  onToggleFavorite: (doc: DocumentItem) => void;
  onDeleteDoc: (doc: DocumentItem) => void;
}

export const SharedWithMeView: React.FC<SharedWithMeViewProps> = ({
  onPreviewDoc,
  onDetailsDoc,
  onDownloadDoc,
  onShareDoc,
  onVersionsDoc,
  onMoveDoc,
  onRenameDoc,
  onToggleFavorite,
  onDeleteDoc,
}) => {
  const [sharedDocs, setSharedDocs] = useState<DocumentItem[]>([]);
  const [, setIsLoading] = useState(true);

  const loadShared = async () => {
    setIsLoading(true);
    try {
      const data = await api.getDocuments({ shared: true });
      setSharedDocs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadShared();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#3A3A32] dark:text-[#EDEBE4] flex items-center space-x-2.5">
            <Users2 className="w-6 h-6 text-[#556855] dark:text-[#889E86]" />
            <span>Shared With Me</span>
          </h1>
          <p className="text-xs text-[#7B806F] dark:text-[#8E9484]">
            Documents and resources shared by team members, professors, or students
          </p>
        </div>
      </div>

      {/* RBAC Info Banner */}
      <div className="p-4 rounded-2xl bg-[#EEF3ED] dark:bg-[#283226] border border-[#DCE5DC] dark:border-[#384635] text-xs text-[#344033] dark:text-[#D1E0D0] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-[#556855] dark:text-[#889E86] shrink-0" />
          <span>
            Permission levels: <strong>VIEWER</strong> (Read & Download only) or <strong>EDITOR</strong> (Can upload revisions & edit metadata).
          </span>
        </div>
      </div>

      {sharedDocs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sharedDocs.map((doc) => (
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
        <EmptyState
          icon="inbox"
          title="No shared documents yet"
          description="When other teammates or admins share files with your email, they will appear here with designated permission rights."
        />
      )}
    </div>
  );
};
