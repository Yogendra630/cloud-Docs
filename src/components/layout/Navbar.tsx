import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  Search,
  Upload,
  FolderPlus,
  Bell,
  Sun,
  Moon,
  LogOut,
  UserCheck,
  Check,
  ChevronDown,
  Shield,
  FileText,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';
import { NotificationItem, DocumentItem } from '../../types';
import { formatRelativeTime } from '../../utils/formatters';

interface NavbarProps {
  onOpenMobileSidebar: () => void;
  onOpenUpload: () => void;
  onOpenCreateFolder: () => void;
  onSelectDocument: (doc: DocumentItem) => void;
  onNavigateToTab: (tab: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMobileSidebar,
  onOpenUpload,
  onOpenCreateFolder,
  onSelectDocument,
  onNavigateToTab,
}) => {
  const { user, logout, switchAccount } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DocumentItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifs, setShowNotifs] = useState(false);

  // User menu & Switch account menu
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSwitchMenu, setShowSwitchMenu] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Load notifications
  const loadNotifs = async () => {
    try {
      const res = await api.getNotifications();
      setNotifications(res.data);
      setUnreadCount(res.unreadCount);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadNotifs();
    const interval = setInterval(loadNotifs, 15000);
    return () => clearInterval(interval);
  }, []);

  // Handle Search Debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await api.search(searchQuery);
        setSearchResults(results.slice(0, 6));
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifs(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
        setShowSwitchMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllNotifsRead = async () => {
    await api.markAllNotificationsRead();
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleSwitchAccount = async (email: string) => {
    await switchAccount(email);
    setShowSwitchMenu(false);
    setShowUserMenu(false);
    loadNotifs();
  };

  const demoAccounts = [
    { name: 'Yogendra Pratap', email: 'yogendra@clouddocs.io', role: 'ADMIN', desc: 'Lead Developer & Admin' },
    { name: 'Priya Sharma', email: 'priya.sharma@clouddocs.io', role: 'USER', desc: 'Project Lead (Collaborator)' },
    { name: 'Rahul Verma', email: 'rahul.verma@clouddocs.io', role: 'USER', desc: 'Student / Developer' },
    { name: 'Dr. Ananya Patel', email: 'ananya.patel@clouddocs.io', role: 'USER', desc: 'Research Supervisor' },
    { name: 'System Administrator', email: 'admin@clouddocs.io', role: 'ADMIN', desc: 'Platform Super Admin' },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#FFFFFF]/95 dark:bg-[#222520]/95 backdrop-blur-md border-b border-[#E5E2D9] dark:border-[#2F342B] px-4 md:px-6 flex items-center justify-between">
      {/* Left section: mobile hamburger & search */}
      <div className="flex items-center space-x-3 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 text-[#6B705C] hover:text-[#3A3A32] dark:text-[#A8ACA0] dark:hover:text-[#EDEBE4] rounded-xl hover:bg-[#F3F1EA] dark:hover:bg-[#2A2E27]"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div ref={searchRef} className="relative w-full max-w-md">
          <div className="relative">
            <Search className="w-4 h-4 text-[#8C907F] dark:text-[#787D70] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              placeholder="Search documents, tags, S3 keys..."
              className="w-full pl-9.5 pr-4 py-2 text-sm bg-[#F3F1EA] dark:bg-[#2A2E27] border border-[#E2DEC9] dark:border-[#383E33] focus:border-[#556855] dark:focus:border-[#7D947B] focus:bg-[#FFFFFF] dark:focus:bg-[#222520] rounded-xl outline-hidden transition text-[#3A3A32] dark:text-[#EDEBE4] placeholder-[#8C907F] dark:placeholder-[#787D70]"
            />
          </div>

          {/* Search Dropdown Results */}
          {showSearchDropdown && searchQuery.trim().length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-[#FFFFFF] dark:bg-[#222520] rounded-2xl shadow-xl border border-[#E5E2D9] dark:border-[#2F342B] p-2 z-50 divide-y divide-[#EBE7DC] dark:divide-[#2F342B] max-h-80 overflow-y-auto">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-[#8C907F] dark:text-[#787D70] uppercase tracking-wider flex justify-between">
                <span>Matching Documents</span>
                <span>{searchResults.length} found</span>
              </div>
              {searchResults.length > 0 ? (
                searchResults.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => {
                      onSelectDocument(doc);
                      setShowSearchDropdown(false);
                      setSearchQuery('');
                    }}
                    className="w-full text-left p-2.5 hover:bg-[#F3F1EA] dark:hover:bg-[#2A2E27] rounded-xl flex items-center space-x-3 transition group"
                  >
                    <div className="p-2 rounded-lg bg-[#EEF3ED] dark:bg-[#283226] text-[#556855] dark:text-[#A7C2A4] shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#3A3A32] dark:text-[#EDEBE4] truncate group-hover:text-[#556855] dark:group-hover:text-[#A7C2A4]">
                        {doc.name}
                      </p>
                      <p className="text-[11px] text-[#7B806F] dark:text-[#8E9484] truncate">
                        {doc.fileType} • {doc.ownerName} • v{doc.currentVersion}.0
                      </p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-[#7B806F] dark:text-[#8E9484]">
                  No documents matching "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right section: Action buttons, Switcher, Theme, Notifs, Profile */}
      <div className="flex items-center space-x-2 md:space-x-3">
        {/* Quick Upload Button */}
        <button
          onClick={onOpenUpload}
          className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#556855] hover:bg-[#455545] active:scale-95 rounded-xl shadow-xs transition"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload</span>
        </button>

        {/* Quick Create Folder Button */}
        <button
          onClick={onOpenCreateFolder}
          className="hidden md:inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-medium text-[#4B4F42] dark:text-[#D1D4CA] bg-[#EFECE3] hover:bg-[#E5E1D5] dark:bg-[#2A2E27] dark:hover:bg-[#343930] rounded-xl transition"
        >
          <FolderPlus className="w-3.5 h-3.5 text-[#556855] dark:text-[#889E86]" />
          <span>New Folder</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          className="p-2 text-[#6B705C] hover:text-[#3A3A32] dark:text-[#A8ACA0] dark:hover:text-[#EDEBE4] hover:bg-[#F3F1EA] dark:hover:bg-[#2A2E27] rounded-xl transition"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-[#DDA15E]" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Popover */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 text-[#6B705C] hover:text-[#3A3A32] dark:text-[#A8ACA0] dark:hover:text-[#EDEBE4] hover:bg-[#F3F1EA] dark:hover:bg-[#2A2E27] rounded-xl transition"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#B84A39] rounded-full animate-pulse" />
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#FFFFFF] dark:bg-[#222520] rounded-2xl shadow-2xl border border-[#E5E2D9] dark:border-[#2F342B] p-4 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-[#EBE7DC] dark:border-[#2F342B]">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-[#556855] dark:text-[#889E86]" />
                  <span className="text-sm font-bold text-[#3A3A32] dark:text-[#EDEBE4]">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-[#EEF3ED] dark:bg-[#283226] text-[#445543] dark:text-[#B1C8AF] rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllNotifsRead}
                    className="text-xs text-[#556855] dark:text-[#889E86] hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="mt-3 space-y-2 max-h-72 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 rounded-xl text-xs transition border ${
                        n.read
                          ? 'bg-[#FAF9F5] dark:bg-[#262923] border-transparent text-[#6B705C] dark:text-[#8E9484]'
                          : 'bg-[#EEF3ED]/80 dark:bg-[#283226]/80 border-[#D5E1D3] dark:border-[#3A4B37] text-[#3A3A32] dark:text-[#EDEBE4] font-medium'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#3A3A32] dark:text-[#EDEBE4]">{n.title}</span>
                        <span className="text-[10px] text-[#8C907F] dark:text-[#787D70]">{formatRelativeTime(n.createdAt)}</span>
                      </div>
                      <p className="mt-1 leading-relaxed text-[#626657] dark:text-[#A4A99C]">{n.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-xs text-[#8C907F] dark:text-[#787D70]">No notifications yet</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Account & Role Switcher */}
        <div ref={userRef} className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2.5 p-1.5 pl-2 hover:bg-[#F3F1EA] dark:hover:bg-[#2A2E27] rounded-xl transition border border-transparent hover:border-[#E2DEC9] dark:hover:border-[#383E33]"
          >
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.name || 'User'}`}
              alt={user?.name}
              className="w-7 h-7 rounded-lg bg-[#E2DEC9] dark:bg-[#2F342B] object-cover"
            />
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-[#3A3A32] dark:text-[#EDEBE4] leading-tight flex items-center space-x-1">
                <span className="truncate max-w-[110px]">{user?.name}</span>
                {user?.role === 'ADMIN' && (
                  <Shield className="w-3 h-3 text-[#B5825D] dark:text-[#DDA15E] shrink-0" />
                )}
              </p>
              <p className="text-[10px] text-[#7B806F] dark:text-[#8E9484] capitalize">{user?.role?.toLowerCase()}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#8C907F] dark:text-[#787D70]" />
          </button>

          {/* User Popover Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-[#FFFFFF] dark:bg-[#222520] rounded-2xl shadow-2xl border border-[#E5E2D9] dark:border-[#2F342B] p-2 z-50 divide-y divide-[#EBE7DC] dark:divide-[#2F342B]">
              {/* Profile info header */}
              <div className="p-3">
                <p className="text-xs font-bold text-[#3A3A32] dark:text-[#EDEBE4]">{user?.name}</p>
                <p className="text-[11px] text-[#7B806F] dark:text-[#8E9484] truncate">{user?.email}</p>
                <div className="mt-2 flex items-center space-x-2">
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#EEF3ED] dark:bg-[#283226] text-[#445543] dark:text-[#B1C8AF] rounded-md">
                    {user?.department || 'Engineering'}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#F3F6F2] dark:bg-[#263124] text-[#556855] dark:text-[#90A98E] rounded-md">
                    {user?.role}
                  </span>
                </div>
              </div>

              {/* Quick Account Switcher (Crucial for testing Collaboration / RBAC!) */}
              <div className="py-2">
                <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#8C907F] dark:text-[#787D70] flex items-center justify-between">
                  <span>Switch Demo User / Role</span>
                  <Sparkles className="w-3 h-3 text-[#B5825D] dark:text-[#DDA15E]" />
                </div>
                <div className="mt-1 space-y-1">
                  {demoAccounts.map((acc) => (
                    <button
                      key={acc.email}
                      onClick={() => handleSwitchAccount(acc.email)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between transition ${
                        user?.email === acc.email
                          ? 'bg-[#EEF3ED] dark:bg-[#283226] text-[#364635] dark:text-[#A7C2A4] font-semibold'
                          : 'hover:bg-[#F3F1EA] dark:hover:bg-[#2A2E27] text-[#4B4F42] dark:text-[#D1D4CA]'
                      }`}
                    >
                      <div className="truncate">
                        <div className="font-medium truncate">{acc.name}</div>
                        <div className="text-[10px] text-[#7B806F] dark:text-[#8E9484] truncate">{acc.desc}</div>
                      </div>
                      {user?.email === acc.email && <Check className="w-3.5 h-3.5 text-[#556855] dark:text-[#A7C2A4] shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Settings & Logout */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    onNavigateToTab('settings');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-[#4B4F42] dark:text-[#D1D4CA] hover:bg-[#F3F1EA] dark:hover:bg-[#2A2E27] rounded-xl"
                >
                  Account Settings & Security
                </button>
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-[#B84A39] dark:text-[#E88C7D] hover:bg-[#FAF0ED] dark:hover:bg-[#341F1B] rounded-xl flex items-center space-x-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
