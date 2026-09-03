import React, { useState, useEffect } from 'react';
import {
  Files,
  HardDrive,
  Users2,
  UploadCloud,
  FolderPlus,
  ArrowRight,
  Cloud,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { DocumentItem, FolderItem, AuditLog, StorageAnalytics } from '../types';
import { formatBytes, formatRelativeTime } from '../utils/formatters';
import { DocumentCard } from '../components/documents/DocumentCard';
import { NavTab } from '../components/layout/Sidebar';

interface DashboardViewProps {
  onNavigateTab: (tab: NavTab) => void;
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
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateTab,
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
}) => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [analytics, setAnalytics] = useState<StorageAnalytics | null>(null);
  const [recentLogs, setRecentLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [docsData, foldersData, analyticsData, activityData] = await Promise.all([
        api.getDocuments({ limit: 6 } as any),
        api.getFolders(),
        api.getStorageAnalytics(),
        api.getActivity(undefined, 5),
      ]);
      setDocuments(docsData);
      setFolders(foldersData);
      setAnalytics(analyticsData);
      setRecentLogs(activityData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const storagePercent = analytics
    ? Math.min(100, Math.round((analytics.usedBytes / analytics.quotaBytes) * 100))
    : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner - Natural Tones Earthy Forest Canvas */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#4A5D4E] via-[#556855] to-[#394838] p-6 md:p-8 text-[#FAF9F6] shadow-xl shadow-[#4A5D4E]/15 border border-[#6B806F]">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-[#EDEBE4] mb-3 border border-white/10">
            <Cloud className="w-3.5 h-3.5 text-[#D5E1D3]" />
            <span>AWS S3 Document Storage • AES-256 Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Welcome back, {user?.name || 'Explorer'}
          </h1>
          <p className="mt-2 text-sm text-[#E2ECE0]/90 leading-relaxed">
            Secure cloud repository for projects, research papers, datasets, and collaborative workspace documents.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={onOpenUpload}
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#FAF9F6] text-[#364635] hover:bg-white active:scale-95 rounded-xl text-xs font-bold shadow-md transition"
            >
              <UploadCloud className="w-4 h-4 text-[#556855]" />
              <span>Upload Documents</span>
            </button>
            <button
              onClick={onOpenCreateFolder}
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#3B4C3D]/60 hover:bg-[#3B4C3D] text-white rounded-xl text-xs font-semibold border border-white/20 transition"
            >
              <FolderPlus className="w-4 h-4 text-[#D5E1D3]" />
              <span>New Folder</span>
            </button>
          </div>
        </div>

        {/* Decorative background blob */}
        <div className="absolute right-0 top-0 -bottom-10 w-96 bg-gradient-to-l from-[#6E8572]/30 to-transparent pointer-events-none rounded-full blur-2xl" />
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Docs */}
        <div
          onClick={() => onNavigateTab('documents')}
          className="p-5 rounded-2xl bg-[#FFFFFF] dark:bg-[#222520] border border-[#E5E2D9] dark:border-[#2F342B] shadow-2xs hover:border-[#556855] dark:hover:border-[#7D947B] cursor-pointer transition group"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-[#EEF3ED] dark:bg-[#283226] text-[#556855] dark:text-[#A7C2A4] group-hover:scale-105 transition">
              <Files className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-[#556855] dark:text-[#A7C2A4] flex items-center space-x-0.5">
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-[#3A3A32] dark:text-[#EDEBE4]">
              {analytics?.totalDocuments || documents.length}
            </p>
            <p className="text-xs text-[#7B806F] dark:text-[#8E9484] mt-0.5">Total Cloud Documents</p>
          </div>
        </div>

        {/* Storage Used */}
        <div
          onClick={() => onNavigateTab('storage')}
          className="p-5 rounded-2xl bg-[#FFFFFF] dark:bg-[#222520] border border-[#E5E2D9] dark:border-[#2F342B] shadow-2xs hover:border-[#47703D] dark:hover:border-[#8DBB81] cursor-pointer transition group"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-[#EEF4EC] dark:bg-[#202E1E] text-[#47703D] dark:text-[#8DBB81] group-hover:scale-105 transition">
              <HardDrive className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 bg-[#E1ECE0] dark:bg-[#283726] text-[#3B6132] dark:text-[#A7C89F] rounded-full">
              {storagePercent}% Used
            </span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-[#3A3A32] dark:text-[#EDEBE4]">
              {analytics ? formatBytes(analytics.usedBytes) : '2.8 GB'}
            </p>
            <p className="text-xs text-[#7B806F] dark:text-[#8E9484] mt-0.5">
              of {analytics ? formatBytes(analytics.quotaBytes) : '15 GB'} AWS Quota
            </p>
          </div>
        </div>

        {/* Folders */}
        <div
          onClick={() => onNavigateTab('folders')}
          className="p-5 rounded-2xl bg-[#FFFFFF] dark:bg-[#222520] border border-[#E5E2D9] dark:border-[#2F342B] shadow-2xs hover:border-[#B5825D] dark:hover:border-[#DDA15E] cursor-pointer transition group"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-[#FAF2EB] dark:bg-[#34271B] text-[#B5825D] dark:text-[#DDA15E] group-hover:scale-105 transition">
              <FolderPlus className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-[#B5825D] dark:text-[#DDA15E] flex items-center space-x-0.5">
              <span>Browse</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-[#3A3A32] dark:text-[#EDEBE4]">{folders.length}</p>
            <p className="text-xs text-[#7B806F] dark:text-[#8E9484] mt-0.5">Organized Folders</p>
          </div>
        </div>

        {/* Collaborations / Shared */}
        <div
          onClick={() => onNavigateTab('shared')}
          className="p-5 rounded-2xl bg-[#FFFFFF] dark:bg-[#222520] border border-[#E5E2D9] dark:border-[#2F342B] shadow-2xs hover:border-[#5A6B5C] dark:hover:border-[#8E9F90] cursor-pointer transition group"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-[#F0F4F1] dark:bg-[#232B25] text-[#4F6452] dark:text-[#9FB5A2] group-hover:scale-105 transition">
              <Users2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-[#4F6452] dark:text-[#9FB5A2] flex items-center space-x-0.5">
              <span>Shared</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-[#3A3A32] dark:text-[#EDEBE4]">
              {documents.filter((d) => d.shares && d.shares.length > 0).length}
            </p>
            <p className="text-xs text-[#7B806F] dark:text-[#8E9484] mt-0.5">Shared Collaborations</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Recent Documents + Quick Folders + Storage Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Documents (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#3A3A32] dark:text-[#EDEBE4]">
                Recent Documents
              </h2>
              <p className="text-xs text-[#7B806F] dark:text-[#8E9484]">Quick access to your active files in S3</p>
            </div>
            <button
              onClick={() => onNavigateTab('documents')}
              className="text-xs font-semibold text-[#556855] dark:text-[#A7C2A4] hover:underline flex items-center space-x-1"
            >
              <span>View all files</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {documents.slice(0, 4).map((doc) => (
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

          {/* Quick Folders Strip */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-[#626657] dark:text-[#A4A99C] uppercase tracking-wider">
                Quick Folders
              </h3>
              <button
                onClick={() => onNavigateTab('folders')}
                className="text-xs text-[#556855] dark:text-[#A7C2A4] hover:underline"
              >
                All folders
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {folders.slice(0, 3).map((f) => (
                <div
                  key={f.id}
                  onClick={() => onNavigateTab('documents')}
                  className="p-3.5 rounded-xl bg-[#FFFFFF] dark:bg-[#222520] border border-[#E5E2D9] dark:border-[#2F342B] hover:border-[#B5825D] dark:hover:border-[#DDA15E] cursor-pointer transition flex items-center space-x-3"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs"
                    style={{ backgroundColor: f.color || '#556855' }}
                  >
                    📁
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-[#3A3A32] dark:text-[#EDEBE4] truncate">{f.name}</p>
                    <p className="text-[10px] text-[#7B806F] dark:text-[#8E9484]">{f.documentCount || 0} files</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Storage Analytics Gauge & Live Activity Feed (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Storage Meter Widget */}
          <div className="p-5 rounded-2xl bg-[#FFFFFF] dark:bg-[#222520] border border-[#E5E2D9] dark:border-[#2F342B] shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#3A3A32] dark:text-[#EDEBE4] flex items-center space-x-2">
                <HardDrive className="w-4 h-4 text-[#556855] dark:text-[#889E86]" />
                <span>Storage Breakdown</span>
              </h3>
              <button
                onClick={() => onNavigateTab('storage')}
                className="text-xs text-[#556855] dark:text-[#889E86] hover:underline font-medium"
              >
                Details
              </button>
            </div>

            {/* Storage Bar with earthy natural tone color accents */}
            <div className="w-full h-3 bg-[#EAE6DC] dark:bg-[#2D3128] rounded-full overflow-hidden flex">
              <div className="h-full bg-[#B84A39]" style={{ width: '38%' }} title="PDF Documents (38%)" />
              <div className="h-full bg-[#3E6585]" style={{ width: '24%' }} title="Office & Word (24%)" />
              <div className="h-full bg-[#47703D]" style={{ width: '18%' }} title="Spreadsheets (18%)" />
              <div className="h-full bg-[#6F4E85]" style={{ width: '12%' }} title="Source Code (12%)" />
              <div className="h-full bg-[#B06325]" style={{ width: '8%' }} title="Archives & Others (8%)" />
            </div>

            <p className="text-xs text-[#7B806F] dark:text-[#8E9484] mt-2 flex justify-between">
              <span>{analytics ? formatBytes(analytics.usedBytes) : '2.8 GB'} used</span>
              <span>{analytics ? formatBytes(analytics.quotaBytes) : '15 GB'} limit</span>
            </p>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] text-[#626657] dark:text-[#A4A99C] pt-3 border-t border-[#EBE7DC] dark:border-[#2F342B]">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B84A39]" />
                <span>PDFs (38%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3E6585]" />
                <span>DOCX (24%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#47703D]" />
                <span>Sheets (18%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#6F4E85]" />
                <span>Code (12%)</span>
              </div>
            </div>
          </div>

          {/* Audit Activity Stream */}
          <div className="p-5 rounded-2xl bg-[#FFFFFF] dark:bg-[#222520] border border-[#E5E2D9] dark:border-[#2F342B] shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#3A3A32] dark:text-[#EDEBE4] flex items-center space-x-2">
                <Clock className="w-4 h-4 text-[#556855] dark:text-[#889E86]" />
                <span>Recent Audit Trail</span>
              </h3>
              <button
                onClick={() => onNavigateTab('activity')}
                className="text-xs text-[#556855] dark:text-[#889E86] hover:underline font-medium"
              >
                All Logs
              </button>
            </div>

            <div className="space-y-3">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-start space-x-3 text-xs">
                  <div className="w-6 h-6 rounded-lg bg-[#F3F1EA] dark:bg-[#2A2E27] flex items-center justify-center text-[10px] font-bold text-[#556855] dark:text-[#A7C2A4] shrink-0 mt-0.5">
                    {log.action === 'UPLOAD' ? 'UP' : log.action === 'DOWNLOAD' ? 'DL' : log.action === 'SHARE' ? 'SH' : 'LOG'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[#3A3A32] dark:text-[#EDEBE4] truncate">
                      <strong className="font-semibold">{log.userName}</strong> {log.action.toLowerCase()}ed <span className="text-[#6B705C] dark:text-[#A8ACA0]">{log.documentName || 'a file'}</span>
                    </p>
                    <p className="text-[10px] text-[#8C907F] dark:text-[#787D70]">{formatRelativeTime(log.createdAt)} • IP: {log.ipAddress}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
