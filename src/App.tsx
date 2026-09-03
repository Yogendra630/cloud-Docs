import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { ArchitectureModal } from './components/common/ArchitectureModal';
import { UploadModal } from './components/documents/UploadModal';
import { CreateFolderModal } from './components/documents/CreateFolderModal';
import { MoveToFolderDialog } from './components/documents/MoveToFolderDialog';
import { DocumentPreviewModal } from './components/documents/DocumentPreviewModal';
import { DocumentDetailsDrawer } from './components/documents/DocumentDetailsDrawer';
import { VersionHistoryModal } from './components/documents/VersionHistoryModal';
import { ShareDialog } from './components/documents/ShareDialog';
import { ConfirmDialog } from './components/common/ConfirmDialog';

import { DashboardView } from './views/DashboardView';
import { DocumentsView } from './views/DocumentsView';
import { FoldersView } from './views/FoldersView';
import { SharedWithMeView } from './views/SharedWithMeView';
import { RecentView, FavoritesView, TrashView } from './views/RecentView';
import { ActivityView } from './views/ActivityView';
import { StorageAnalyticsView } from './views/StorageAnalyticsView';
import { SettingsView } from './views/SettingsView';
import { AdminView } from './views/AdminView';
import { AuthView } from './views/AuthView';

import { DocumentItem, FolderItem } from './types';
import { api } from './services/api';

const AppContent: React.FC = () => {
  const { user, isLoading, refreshUser } = useAuth();

  // Navigation State
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Data cache for modal selectors
  const [folders, setFolders] = useState<FolderItem[]>([]);

  // Modals & Drawers state
  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = () => setRefreshKey((k) => k + 1);

  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);
  const [detailsDoc, setDetailsDoc] = useState<DocumentItem | null>(null);
  const [versionsDoc, setVersionsDoc] = useState<DocumentItem | null>(null);
  const [shareDoc, setShareDoc] = useState<DocumentItem | null>(null);
  const [moveDoc, setMoveDoc] = useState<DocumentItem | null>(null);

  // Confirm Dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Reload folders for dropdowns
  const refreshFolders = async () => {
    try {
      const data = await api.getFolders();
      setFolders(data);
    } catch {
      // ignore
    }
  };

  React.useEffect(() => {
    if (user) {
      refreshFolders();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F7F4] dark:bg-[#181A16]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#556855] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-[#6B705C] dark:text-[#A8ACA0]">Initializing CloudDocs Environment...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthView />;
  }

  // Document action handlers
  const handleDownload = async (doc: DocumentItem) => {
    try {
      await api.downloadDocumentBlob(doc.id, doc.originalFileName, doc.currentVersion);
      addToast('success', 'Download Started', `Saved ${doc.name} from S3.`);
    } catch (err: any) {
      addToast('error', 'Download Failed', err.message || 'Could not download from S3.');
    }
  };

  const handleToggleFavorite = async (doc: DocumentItem) => {
    try {
      const res = await api.toggleFavorite(doc.id);
      addToast('info', res.isFavorite ? 'Added to Favorites' : 'Removed from Favorites', doc.name);
      triggerRefresh();
    } catch (err: any) {
      addToast('error', 'Action Failed', err.message);
    }
  };

  const handleDeleteDoc = (doc: DocumentItem) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Move to Trash?',
      message: `"${doc.name}" will be moved to the recycle bin. You can restore it or permanently delete it later.`,
      onConfirm: async () => {
        try {
          await api.moveToTrash(doc.id);
          addToast('success', 'Moved to Trash', doc.name);
          refreshUser();
          triggerRefresh();
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        } catch (err: any) {
          addToast('error', 'Delete Failed', err.message);
        }
      },
    });
  };

  const handleRenameDoc = (doc: DocumentItem) => {
    const newName = prompt('Enter new document name:', doc.name);
    if (newName && newName.trim() && newName !== doc.name) {
      api.updateDocument(doc.id, { name: newName.trim() }).then(() => {
        addToast('success', 'Document Renamed', newName.trim());
        triggerRefresh();
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] dark:bg-[#181A16] text-[#3A3A32] dark:text-[#EDEBE4] flex flex-col font-sans antialiased selection:bg-[#556855]/20">
      {/* Navigation Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'documents') setActiveFolderId(null);
        }}
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
      />

      {/* Main Content Area (Offset by 64 lg:pl-64 for fixed sidebar) */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        <Navbar
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onOpenUpload={() => setIsUploadOpen(true)}
          onOpenCreateFolder={() => setIsCreateFolderOpen(true)}
          onSelectDocument={(doc) => setPreviewDoc(doc)}
          onNavigateToTab={(tab) => setCurrentTab(tab)}
        />

        {/* View Switcher */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardView
              key={`dash_${refreshKey}`}
              onNavigateTab={(t) => setCurrentTab(t)}
              onOpenUpload={() => setIsUploadOpen(true)}
              onOpenCreateFolder={() => setIsCreateFolderOpen(true)}
              onPreviewDoc={(d) => setPreviewDoc(d)}
              onDetailsDoc={(d) => setDetailsDoc(d)}
              onDownloadDoc={handleDownload}
              onShareDoc={(d) => setShareDoc(d)}
              onVersionsDoc={(d) => setVersionsDoc(d)}
              onMoveDoc={(d) => setMoveDoc(d)}
              onRenameDoc={handleRenameDoc}
              onToggleFavorite={handleToggleFavorite}
              onDeleteDoc={handleDeleteDoc}
            />
          )}

          {currentTab === 'documents' && (
            <DocumentsView
              key={`docs_${refreshKey}_${activeFolderId || 'root'}`}
              onOpenUpload={() => setIsUploadOpen(true)}
              onOpenCreateFolder={() => setIsCreateFolderOpen(true)}
              onPreviewDoc={(d) => setPreviewDoc(d)}
              onDetailsDoc={(d) => setDetailsDoc(d)}
              onDownloadDoc={handleDownload}
              onShareDoc={(d) => setShareDoc(d)}
              onVersionsDoc={(d) => setVersionsDoc(d)}
              onMoveDoc={(d) => setMoveDoc(d)}
              onRenameDoc={handleRenameDoc}
              onToggleFavorite={handleToggleFavorite}
              onDeleteDoc={handleDeleteDoc}
              activeFolderId={activeFolderId}
              onSelectFolder={(fId) => setActiveFolderId(fId)}
            />
          )}

          {currentTab === 'folders' && (
            <FoldersView
              key={`folders_${refreshKey}`}
              onOpenCreateFolder={() => setIsCreateFolderOpen(true)}
              onOpenFolder={(fId) => {
                setActiveFolderId(fId);
                setCurrentTab('documents');
              }}
            />
          )}

          {currentTab === 'shared' && (
            <SharedWithMeView
              key={`shared_${refreshKey}`}
              onPreviewDoc={(d) => setPreviewDoc(d)}
              onDetailsDoc={(d) => setDetailsDoc(d)}
              onDownloadDoc={handleDownload}
              onShareDoc={(d) => setShareDoc(d)}
              onVersionsDoc={(d) => setVersionsDoc(d)}
              onMoveDoc={(d) => setMoveDoc(d)}
              onRenameDoc={handleRenameDoc}
              onToggleFavorite={handleToggleFavorite}
              onDeleteDoc={handleDeleteDoc}
            />
          )}

          {currentTab === 'recent' && (
            <RecentView
              key={`recent_${refreshKey}`}
              onPreviewDoc={(d) => setPreviewDoc(d)}
              onDetailsDoc={(d) => setDetailsDoc(d)}
              onDownloadDoc={handleDownload}
              onShareDoc={(d) => setShareDoc(d)}
              onVersionsDoc={(d) => setVersionsDoc(d)}
              onMoveDoc={(d) => setMoveDoc(d)}
              onRenameDoc={handleRenameDoc}
              onToggleFavorite={handleToggleFavorite}
              onDeleteDoc={handleDeleteDoc}
            />
          )}

          {currentTab === 'favorites' && (
            <FavoritesView
              key={`favs_${refreshKey}`}
              onPreviewDoc={(d) => setPreviewDoc(d)}
              onDetailsDoc={(d) => setDetailsDoc(d)}
              onDownloadDoc={handleDownload}
              onShareDoc={(d) => setShareDoc(d)}
              onVersionsDoc={(d) => setVersionsDoc(d)}
              onMoveDoc={(d) => setMoveDoc(d)}
              onRenameDoc={handleRenameDoc}
              onToggleFavorite={handleToggleFavorite}
              onDeleteDoc={handleDeleteDoc}
            />
          )}

          {currentTab === 'trash' && (
            <TrashView
              key={`trash_${refreshKey}`}
              onPreviewDoc={(d) => setPreviewDoc(d)}
              onDetailsDoc={(d) => setDetailsDoc(d)}
              onDownloadDoc={handleDownload}
              onShareDoc={(d) => setShareDoc(d)}
              onVersionsDoc={(d) => setVersionsDoc(d)}
              onMoveDoc={(d) => setMoveDoc(d)}
              onRenameDoc={handleRenameDoc}
              onToggleFavorite={handleToggleFavorite}
              onDeleteDoc={handleDeleteDoc}
            />
          )}

          {currentTab === 'activity' && <ActivityView key={`act_${refreshKey}`} />}

          {currentTab === 'storage' && <StorageAnalyticsView key={`storage_${refreshKey}`} />}

          {currentTab === 'settings' && <SettingsView />}

          {currentTab === 'admin' && (
            <AdminView
              key={`admin_${refreshKey}`}
              onPreviewDoc={(d) => setPreviewDoc(d)}
              onDownloadDoc={handleDownload}
            />
          )}
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        currentFolderId={activeFolderId}
        folders={folders}
        onUploadSuccess={() => {
          addToast('success', 'Upload Complete', 'Document saved to S3 and indexed in MySQL.');
          refreshFolders();
          refreshUser();
          triggerRefresh();
        }}
      />

      <CreateFolderModal
        isOpen={isCreateFolderOpen}
        onClose={() => setIsCreateFolderOpen(false)}
        currentFolderId={activeFolderId}
        onFolderCreated={() => {
          addToast('success', 'Folder Created');
          refreshFolders();
          triggerRefresh();
        }}
      />

      <MoveToFolderDialog
        document={moveDoc}
        isOpen={!!moveDoc}
        onClose={() => setMoveDoc(null)}
        folders={folders}
        onMoved={() => {
          addToast('success', 'Document Relocated');
          refreshFolders();
          triggerRefresh();
        }}
      />

      <DocumentPreviewModal
        document={previewDoc}
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        onDownload={handleDownload}
        onShare={(d) => setShareDoc(d)}
        onVersions={(d) => setVersionsDoc(d)}
        onToggleFavorite={handleToggleFavorite}
      />

      <DocumentDetailsDrawer
        document={detailsDoc}
        isOpen={!!detailsDoc}
        onClose={() => setDetailsDoc(null)}
        onDownload={handleDownload}
        onShare={(d) => setShareDoc(d)}
        onVersions={(d) => setVersionsDoc(d)}
      />

      <VersionHistoryModal
        document={versionsDoc}
        isOpen={!!versionsDoc}
        onClose={() => setVersionsDoc(null)}
        onVersionUploaded={() => {
          addToast('success', 'Version Committed', 'New revision uploaded to AWS S3.');
          refreshUser();
          triggerRefresh();
        }}
      />

      <ShareDialog
        document={shareDoc}
        isOpen={!!shareDoc}
        onClose={() => setShareDoc(null)}
        onSharedUpdated={() => {
          addToast('success', 'Permissions Updated');
        }}
      />

      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />

      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
