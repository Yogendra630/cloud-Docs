import React, { useState, useEffect } from 'react';
import { FolderPlus, Trash2, Files, ChevronRight } from 'lucide-react';
import { FolderItem } from '../types';
import { api } from '../services/api';
import { EmptyState } from '../components/common/EmptyState';

interface FoldersViewProps {
  onOpenCreateFolder: () => void;
  onOpenFolder: (folderId: string) => void;
}

export const FoldersView: React.FC<FoldersViewProps> = ({
  onOpenCreateFolder,
  onOpenFolder,
}) => {
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [, setIsLoading] = useState(true);

  const loadFolders = async () => {
    setIsLoading(true);
    try {
      const data = await api.getFolders();
      setFolders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFolders();
  }, []);

  const handleDeleteFolder = async (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this folder?')) {
      await api.deleteFolder(folderId);
      loadFolders();
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#3A3A32] dark:text-[#EDEBE4]">
            Folders & Directories
          </h1>
          <p className="text-xs text-[#7B806F] dark:text-[#8E9484]">Organize your cloud files into logical hierarchies</p>
        </div>

        <button
          onClick={onOpenCreateFolder}
          className="inline-flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-white bg-[#556855] hover:bg-[#455545] active:scale-95 rounded-xl shadow-xs transition"
        >
          <FolderPlus className="w-3.5 h-3.5" />
          <span>New Folder</span>
        </button>
      </div>

      {folders.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {folders.map((f) => (
            <div
              key={f.id}
              onClick={() => onOpenFolder(f.id)}
              className="p-5 rounded-2xl bg-[#FFFFFF] dark:bg-[#222520] border border-[#E5E2D9] dark:border-[#2F342B] hover:border-[#556855] dark:hover:border-[#7D947B] hover:shadow-md cursor-pointer transition flex flex-col justify-between group"
            >
              <div className="flex items-start justify-between">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl shadow-xs group-hover:scale-105 transition"
                  style={{ backgroundColor: f.color || '#556855' }}
                >
                  📁
                </div>
                <button
                  onClick={(e) => handleDeleteFolder(f.id, e)}
                  className="p-1.5 text-[#D0CBBF] hover:text-[#B84A39] rounded-lg opacity-0 group-hover:opacity-100 transition"
                  title="Delete Folder"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-bold text-[#3A3A32] dark:text-[#EDEBE4] truncate group-hover:text-[#556855] dark:group-hover:text-[#A7C2A4] transition">
                  {f.name}
                </h3>
                <p className="text-xs text-[#7B806F] dark:text-[#8E9484] mt-1 flex items-center space-x-1.5">
                  <Files className="w-3.5 h-3.5" />
                  <span>{f.documentCount || 0} documents</span>
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#EBE7DC] dark:border-[#2F342B] flex items-center justify-between text-xs text-[#556855] dark:text-[#A7C2A4] font-semibold">
                <span>Browse Folder</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="folder"
          title="No folders created yet"
          description="Create folders to group course notes, project specs, and organizational files."
          actionLabel="Create First Folder"
          onAction={onOpenCreateFolder}
        />
      )}
    </div>
  );
};
