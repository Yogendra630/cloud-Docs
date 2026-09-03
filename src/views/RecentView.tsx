import React, { useState, useEffect } from 'react';
import { Clock, Star, Trash2 } from 'lucide-react';
import { DocumentItem } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { DocumentCard } from '../components/documents/DocumentCard';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

interface RecentViewProps {
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

export const RecentView: React.FC<RecentViewProps> = (props) => {
  const [docs, setDocs] = useState<DocumentItem[]>([]);
  const [, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await api.getDocuments({ sort: 'updatedAt_desc' });
      setDocs(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#3A3A32] dark:text-[#EDEBE4] flex items-center space-x-2.5">
          <Clock className="w-6 h-6 text-[#556855] dark:text-[#889E86]" />
          <span>Recent Documents</span>
        </h1>
        <p className="text-xs text-[#7B806F] dark:text-[#8E9484]">Sorted chronologically by last activity and upload timestamp</p>
      </div>

      {docs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {docs.map((doc) => (
            <DocumentCard key={doc.id} document={doc} {...props} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="folder"
          title="No recent files"
          description="Your recently opened or modified files will appear here."
        />
      )}
    </div>
  );
};

export const FavoritesView: React.FC<RecentViewProps> = (props) => {
  const [docs, setDocs] = useState<DocumentItem[]>([]);
  const [, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await api.getDocuments({ favorite: true });
      setDocs(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleFav = async (doc: DocumentItem) => {
    await props.onToggleFavorite(doc);
    loadData();
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#3A3A32] dark:text-[#EDEBE4] flex items-center space-x-2.5">
          <Star className="w-6 h-6 text-[#C48B5E] fill-[#C48B5E]" />
          <span>Starred & Favorites</span>
        </h1>
        <p className="text-xs text-[#7B806F] dark:text-[#8E9484]">High-priority documents marked for quick access</p>
      </div>

      {docs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {docs.map((doc) => (
            <DocumentCard key={doc.id} document={doc} {...props} onToggleFavorite={handleToggleFav} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="search"
          title="No favorite documents yet"
          description="Click the star icon on any document card to bookmark it here for instant access."
        />
      )}
    </div>
  );
};

export const TrashView: React.FC<RecentViewProps> = (props) => {
  const { refreshUser } = useAuth();
  const [docs, setDocs] = useState<DocumentItem[]>([]);
  const [, setIsLoading] = useState(true);
  const [showEmptyConfirm, setShowEmptyConfirm] = useState(false);
  const [docToDelete, setDocToDelete] = useState<DocumentItem | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await api.getDocuments({ trash: true });
      setDocs(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRestore = async (doc: DocumentItem) => {
    await api.restoreFromTrash(doc.id);
    await refreshUser();
    loadData();
  };

  const handlePermanentDelete = (doc: DocumentItem) => {
    setDocToDelete(doc);
  };

  const confirmPermanentDelete = async () => {
    if (!docToDelete) return;
    try {
      await api.permanentDelete(docToDelete.id);
      await refreshUser();
      setDocToDelete(null);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEmptyTrash = async () => {
    await api.emptyTrash();
    await refreshUser();
    setShowEmptyConfirm(false);
    loadData();
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#3A3A32] dark:text-[#EDEBE4] flex items-center space-x-2.5">
            <Trash2 className="w-6 h-6 text-[#B84A39] dark:text-[#E88C7D]" />
            <span>Recycle Bin & Trash</span>
          </h1>
          <p className="text-xs text-[#7B806F] dark:text-[#8E9484]">Deleted files are preserved before permanent purge from S3</p>
        </div>

        {docs.length > 0 && (
          <button
            onClick={() => setShowEmptyConfirm(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-[#B84A39] dark:text-[#E88C7D] bg-[#FAF0ED] dark:bg-[#341F1B] border border-[#F2D2C9] dark:border-[#522F29] hover:bg-[#F6E3DE] rounded-xl transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Empty Trash Bin</span>
          </button>
        )}
      </div>

      {docs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {docs.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              {...props}
              isTrashView={true}
              onRestore={handleRestore}
              onDelete={handlePermanentDelete}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="folder"
          title="Trash is clean"
          description="Items moved to trash will be held here before being permanently purged from AWS S3."
        />
      )}

      <ConfirmDialog
        isOpen={!!docToDelete}
        title="Permanently Delete File?"
        message={docToDelete ? `"${docToDelete.name}" will be permanently deleted from AWS S3 storage and all database records will be erased. This action cannot be undone.` : ''}
        confirmLabel="Delete Permanently"
        isDestructive={true}
        onConfirm={confirmPermanentDelete}
        onCancel={() => setDocToDelete(null)}
      />

      <ConfirmDialog
        isOpen={showEmptyConfirm}
        title="Empty Trash Bin?"
        message="This action will permanently delete all files in the trash bin from AWS S3 and remove their database records forever. Are you sure?"
        confirmLabel="Empty Trash Permanently"
        isDestructive={true}
        onConfirm={handleEmptyTrash}
        onCancel={() => setShowEmptyConfirm(false)}
      />
    </div>
  );
};
