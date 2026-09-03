import React from 'react';
import {
  LayoutDashboard,
  Files,
  FolderOpen,
  Users2,
  Clock,
  Star,
  Trash2,
  Activity,
  HardDrive,
  Settings,
  ShieldAlert,
  Cloud,
  Code2,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatBytes } from '../../utils/formatters';

export type NavTab =
  | 'dashboard'
  | 'documents'
  | 'folders'
  | 'shared'
  | 'recent'
  | 'favorites'
  | 'trash'
  | 'activity'
  | 'storage'
  | 'settings'
  | 'admin';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenArchitecture: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  onOpenArchitecture,
}) => {
  const { user } = useAuth();

  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'documents' as NavTab, label: 'My Documents', icon: Files },
    { id: 'folders' as NavTab, label: 'Folders', icon: FolderOpen },
    { id: 'shared' as NavTab, label: 'Shared With Me', icon: Users2 },
    { id: 'recent' as NavTab, label: 'Recent Files', icon: Clock },
    { id: 'favorites' as NavTab, label: 'Favorites', icon: Star },
    { id: 'trash' as NavTab, label: 'Trash', icon: Trash2 },
    { id: 'activity' as NavTab, label: 'Activity Logs', icon: Activity },
    { id: 'storage' as NavTab, label: 'Storage Analytics', icon: HardDrive },
    { id: 'settings' as NavTab, label: 'Settings', icon: Settings },
  ];

  const quotaPercent = user ? Math.min(100, Math.round((user.storageUsedBytes / user.storageQuotaBytes) * 100)) : 0;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-[#2D3028]/60 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#FFFFFF] dark:bg-[#222520] border-r border-[#E5E2D9] dark:border-[#2F342B] flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo & Brand Header */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-[#EBE7DC] dark:border-[#2F342B]">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#556855] to-[#6E826E] flex items-center justify-center text-white shadow-md shadow-[#556855]/20">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-base tracking-tight text-[#3A3A32] dark:text-[#EDEBE4]">
                  CloudDocs
                </span>
                <span className="block text-[10px] text-[#7B806F] dark:text-[#8E9484] font-medium -mt-0.5">
                  AWS S3 + Spring Boot
                </span>
              </div>
            </div>
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 text-[#7B806F] hover:text-[#3A3A32] dark:hover:text-[#EDEBE4] rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="px-3 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)]">
            <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[#8C907F] dark:text-[#7A8070]">
              Workspace
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? 'bg-[#EEF3ED] dark:bg-[#283226] text-[#364635] dark:text-[#A7C2A4] font-semibold shadow-2xs border border-[#D5E1D3] dark:border-[#384835]'
                      : 'text-[#626657] dark:text-[#A4A99C] hover:bg-[#F4F2EB] dark:hover:bg-[#2B2F27] hover:text-[#2E3027] dark:hover:text-[#EDEBE4]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#556855] dark:text-[#A7C2A4]' : 'text-[#8E9383] dark:text-[#787D70]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Admin Panel Link */}
            {user?.role === 'ADMIN' && (
              <div className="pt-3">
                <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[#B5825D] dark:text-[#DDA15E]">
                  Administration
                </div>
                <button
                  onClick={() => {
                    onSelectTab('admin');
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                    currentTab === 'admin'
                      ? 'bg-[#FAF2EB] dark:bg-[#34271B] text-[#9E5F2E] dark:text-[#E8AF7A] font-semibold shadow-2xs border border-[#EDD9C7] dark:border-[#523A25]'
                      : 'text-[#626657] dark:text-[#A4A99C] hover:bg-[#F4F2EB] dark:hover:bg-[#2B2F27] hover:text-[#2E3027] dark:hover:text-[#EDEBE4]'
                  }`}
                >
                  <ShieldAlert className={`w-4 h-4 ${currentTab === 'admin' ? 'text-[#B5825D] dark:text-[#DDA15E]' : 'text-[#B5825D]'}`} />
                  <span>Admin Panel</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer Area with Storage Quota and Spring Boot Code trigger */}
        <div className="p-3 border-t border-[#EBE7DC] dark:border-[#2F342B] space-y-2">
          {/* Spring Boot / S3 Code Inspector Button */}
          <button
            onClick={onOpenArchitecture}
            className="w-full flex items-center justify-between px-3 py-2 bg-[#F3F6F2] dark:bg-[#263124] border border-[#D5E1D3] dark:border-[#3A4B37] hover:border-[#556855] text-[#3B4C3A] dark:text-[#B1C8AF] rounded-xl transition text-xs font-semibold group"
          >
            <div className="flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-[#556855] dark:text-[#90A98E]" />
              <span>Spring Boot Code</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 bg-[#E1ECE0] dark:bg-[#344431] text-[#334232] dark:text-[#CFE2CD] rounded font-mono">
              Java+S3
            </span>
          </button>

          {/* S3 Storage Quota Widget */}
          <div className="p-3 bg-[#F6F4EE] dark:bg-[#292D25] rounded-xl border border-[#E5E1D5] dark:border-[#353A2F] text-xs">
            <div className="flex items-center justify-between mb-1.5 font-medium">
              <span className="text-[#646859] dark:text-[#A4A89C] flex items-center space-x-1">
                <Cloud className="w-3.5 h-3.5 text-[#556855] dark:text-[#889E86]" />
                <span>AWS S3 Storage</span>
              </span>
              <span className="text-[#3A3A32] dark:text-[#EDEBE4] font-semibold">{quotaPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#E2DEC9] dark:bg-[#3B4034] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  quotaPercent > 85 ? 'bg-[#B84A39]' : quotaPercent > 60 ? 'bg-[#C48B5E]' : 'bg-[#556855] dark:bg-[#7D947B]'
                }`}
                style={{ width: `${quotaPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-[#7B806F] dark:text-[#909586] mt-1.5 flex justify-between">
              <span>{user ? formatBytes(user.storageUsedBytes) : '0 GB'}</span>
              <span>of {user ? formatBytes(user.storageQuotaBytes) : '5 GB'}</span>
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
