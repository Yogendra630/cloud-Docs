import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  Files,
  HardDrive,
  Activity,
  Trash2,
  Search,
  UserCheck,
  UserX,
  Download,
} from 'lucide-react';
import { User, DocumentItem, AuditLog, AdminStats } from '../types';
import { api } from '../services/api';
import { formatBytes, formatDate } from '../utils/formatters';

interface AdminViewProps {
  onPreviewDoc: (doc: DocumentItem) => void;
  onDownloadDoc: (doc: DocumentItem) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ onPreviewDoc, onDownloadDoc }) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<(User & { documentCount: number })[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'documents' | 'logs'>('users');
  const [userSearch, setUserSearch] = useState('');
  const [, setIsLoading] = useState(true);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [statsData, usersData, docsData, logsData] = await Promise.all([
        api.getAdminOverview(),
        api.getAdminUsers(),
        api.getAdminDocuments(),
        api.getAdminAuditLogs(),
      ]);
      setStats(statsData);
      setUsers(usersData);
      setDocuments(docsData);
      setAuditLogs(logsData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleToggleStatus = async (user: User) => {
    const nextStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    if (confirm(`Change status of ${user.name} to ${nextStatus}?`)) {
      await api.setAdminUserStatus(user.id, nextStatus);
      loadAdminData();
    }
  };

  const handleToggleRole = async (user: User) => {
    const nextRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    if (confirm(`Change role of ${user.name} to ${nextRole}?`)) {
      await api.setAdminUserRole(user.id, nextRole);
      loadAdminData();
    }
  };

  const handleDeleteDoc = async (doc: DocumentItem) => {
    if (confirm(`ADMIN ACTION: Permanently remove document "${doc.name}" from AWS S3 storage?`)) {
      await api.adminDeleteDocument(doc.id);
      loadAdminData();
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.department && u.department.toLowerCase().includes(userSearch.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#3A3A32] dark:text-[#EDEBE4] flex items-center space-x-2.5">
            <ShieldAlert className="w-6 h-6 text-[#B5825D]" />
            <span>Administrator Control Center</span>
          </h1>
          <p className="text-xs text-[#7B806F] dark:text-[#8E9484]">
            Tenant management, user RBAC permissions, cloud quota monitoring, and global audit oversight
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-[#F3F1EA] dark:bg-[#2A2E27] p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3.5 py-1.5 rounded-lg transition ${
              activeTab === 'users'
                ? 'bg-[#FFFFFF] dark:bg-[#34392F] text-[#3A3A32] dark:text-[#EDEBE4] shadow-xs'
                : 'text-[#7B806F] dark:text-[#8E9484] hover:text-[#3A3A32]'
            }`}
          >
            User Directory ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-3.5 py-1.5 rounded-lg transition ${
              activeTab === 'documents'
                ? 'bg-[#FFFFFF] dark:bg-[#34392F] text-[#3A3A32] dark:text-[#EDEBE4] shadow-xs'
                : 'text-[#7B806F] dark:text-[#8E9484] hover:text-[#3A3A32]'
            }`}
          >
            Global S3 Documents ({documents.length})
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3.5 py-1.5 rounded-lg transition ${
              activeTab === 'logs'
                ? 'bg-[#FFFFFF] dark:bg-[#34392F] text-[#3A3A32] dark:text-[#EDEBE4] shadow-xs'
                : 'text-[#7B806F] dark:text-[#8E9484] hover:text-[#3A3A32]'
            }`}
          >
            System Audit Trail ({auditLogs.length})
          </button>
        </div>
      </div>

      {/* 4 Admin Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#FFFFFF] dark:bg-[#222520] border border-[#E5E2D9] dark:border-[#2F342B] shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-[#EEF3ED] dark:bg-[#283226] text-[#556855] dark:text-[#889E86]">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 bg-[#EEF4EC] dark:bg-[#202E1E] text-[#47703D] dark:text-[#8DBB81] rounded-full">
              {users.filter((u) => u.status === 'ACTIVE').length} Active
            </span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-[#3A3A32] dark:text-[#EDEBE4]">{stats?.totalUsers || users.length}</p>
            <p className="text-xs text-[#7B806F] dark:text-[#8E9484]">Registered Accounts</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#FFFFFF] dark:bg-[#222520] border border-[#E5E2D9] dark:border-[#2F342B] shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-[#EEF4EC] dark:bg-[#202E1E] text-[#47703D] dark:text-[#8DBB81]">
              <HardDrive className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 bg-[#EEF4EC] dark:bg-[#202E1E] text-[#47703D] dark:text-[#8DBB81] rounded-full">
              AWS S3 Standard
            </span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-[#3A3A32] dark:text-[#EDEBE4]">{stats ? formatBytes(stats.totalStorageUsedBytes) : '4.2 GB'}</p>
            <p className="text-xs text-[#7B806F] dark:text-[#8E9484]">Total S3 Volume Stored</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#FFFFFF] dark:bg-[#222520] border border-[#E5E2D9] dark:border-[#2F342B] shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-[#F4EFF7] dark:bg-[#2A232E] text-[#6F4E85] dark:text-[#C5A3DE]">
              <Files className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 bg-[#F4EFF7] dark:bg-[#2A232E] text-[#6F4E85] dark:text-[#C5A3DE] rounded-full">
              Multi-Versioned
            </span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-[#3A3A32] dark:text-[#EDEBE4]">{stats?.totalDocuments || documents.length}</p>
            <p className="text-xs text-[#7B806F] dark:text-[#8E9484]">Managed Documents</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#FFFFFF] dark:bg-[#222520] border border-[#E5E2D9] dark:border-[#2F342B] shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-[#FAF2EB] dark:bg-[#34271B] text-[#B5825D] dark:text-[#DDA15E]">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 bg-[#FAF2EB] dark:bg-[#34271B] text-[#B5825D] dark:text-[#DDA15E] rounded-full">
              Audited
            </span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-[#3A3A32] dark:text-[#EDEBE4]">{stats?.totalAuditLogs || auditLogs.length}</p>
            <p className="text-xs text-[#7B806F] dark:text-[#8E9484]">Recorded Audit Events</p>
          </div>
        </div>
      </div>

      {/* Tab: Users Management */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-72">
              <Search className="w-4 h-4 text-[#8C907F] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search user name, email, department..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FFFFFF] dark:bg-[#222520] border border-[#E5E2D9] dark:border-[#2F342B] rounded-xl outline-hidden focus:border-[#556855] text-[#3A3A32] dark:text-[#EDEBE4]"
              />
            </div>
          </div>

          <div className="w-full bg-[#FFFFFF] dark:bg-[#222520] rounded-2xl border border-[#E5E2D9] dark:border-[#2F342B] shadow-2xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F6F4EE] dark:bg-[#292D25] border-b border-[#E5E2D9] dark:border-[#2F342B] text-[#6B705C] dark:text-[#A8ACA0] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-3">Role</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-3">Department</th>
                  <th className="py-3.5 px-3">Storage Used</th>
                  <th className="py-3.5 px-3">Files</th>
                  <th className="py-3.5 pr-4 pl-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBE7DC] dark:divide-[#2F342B]/80">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#F7F5EE] dark:hover:bg-[#292D25] transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={u.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.name}`}
                          alt={u.name}
                          className="w-7 h-7 rounded-lg bg-[#F3F1EA] dark:bg-[#2A2E27] object-cover"
                        />
                        <div>
                          <p className="font-semibold text-[#3A3A32] dark:text-[#EDEBE4]">{u.name}</p>
                          <p className="text-[10px] text-[#8C907F]">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => handleToggleRole(u)}
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition ${
                          u.role === 'ADMIN'
                            ? 'bg-[#FAF2EB] text-[#B5825D]'
                            : 'bg-[#EEF3ED] text-[#445543]'
                        }`}
                        title="Click to toggle Role"
                      >
                        {u.role}
                      </button>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                        u.status === 'ACTIVE'
                          ? 'bg-[#EEF4EC] dark:bg-[#202E1E] text-[#47703D] dark:text-[#8DBB81]'
                          : 'bg-[#FAF0ED] dark:bg-[#341F1B] text-[#B84A39] dark:text-[#E88C7D]'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#6B705C] dark:text-[#A8ACA0]">
                      {u.department || 'General'}
                    </td>
                    <td className="py-3 px-3 font-mono text-[#626657] dark:text-[#A4A99C]">
                      {formatBytes(u.storageUsedBytes)}
                    </td>
                    <td className="py-3 px-3 text-[#3A3A32] dark:text-[#EDEBE4] font-semibold">
                      {u.documentCount || 0}
                    </td>
                    <td className="py-3 pr-4 pl-2 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => handleToggleStatus(u)}
                          className={`p-1.5 rounded-lg transition text-xs font-semibold flex items-center space-x-1 ${
                            u.status === 'ACTIVE'
                              ? 'text-[#B84A39] hover:bg-[#FAF0ED] dark:hover:bg-[#341F1B]'
                              : 'text-[#47703D] hover:bg-[#EEF4EC] dark:hover:bg-[#202E1E]'
                          }`}
                          title={u.status === 'ACTIVE' ? 'Deactivate Account' : 'Activate Account'}
                        >
                          {u.status === 'ACTIVE' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                          <span>{u.status === 'ACTIVE' ? 'Disable' : 'Enable'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Global S3 Documents */}
      {activeTab === 'documents' && (
        <div className="w-full bg-[#FFFFFF] dark:bg-[#222520] rounded-2xl border border-[#E5E2D9] dark:border-[#2F342B] shadow-2xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F6F4EE] dark:bg-[#292D25] border-b border-[#E5E2D9] dark:border-[#2F342B] text-[#6B705C] dark:text-[#A8ACA0] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Document</th>
                <th className="py-3.5 px-3">Owner</th>
                <th className="py-3.5 px-3">S3 Object Key</th>
                <th className="py-3.5 px-3">Size</th>
                <th className="py-3.5 px-3">Version</th>
                <th className="py-3.5 px-3">Created</th>
                <th className="py-3.5 pr-4 pl-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE7DC] dark:divide-[#2F342B]/80">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-[#F7F5EE] dark:hover:bg-[#292D25] transition">
                  <td className="py-3 px-4">
                    <span className="font-semibold text-[#3A3A32] dark:text-[#EDEBE4] block truncate max-w-xs">{doc.name}</span>
                    <span className="text-[10px] text-[#7B806F] dark:text-[#8E9484]">{doc.fileType} • {doc.originalFileName}</span>
                  </td>
                  <td className="py-3 px-3 text-[#4B4F42] dark:text-[#D1D4CA] font-medium">
                    {doc.ownerName}
                  </td>
                  <td className="py-3 px-3 font-mono text-[10px] text-[#7B806F] dark:text-[#8E9484] truncate max-w-[200px]" title={doc.s3Key}>
                    {doc.s3Key}
                  </td>
                  <td className="py-3 px-3 font-mono text-[#626657] dark:text-[#A4A99C]">
                    {formatBytes(doc.fileSizeBytes)}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 bg-[#EEF3ED] dark:bg-[#283226] text-[#445543] dark:text-[#B1C8AF] rounded font-semibold text-[10px]">
                      v{doc.currentVersion}.0
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[#7B806F] dark:text-[#8E9484]">
                    {formatDate(doc.createdAt)}
                  </td>
                  <td className="py-3 pr-4 pl-2 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <button
                        onClick={() => onPreviewDoc(doc)}
                        className="px-2 py-1 text-xs text-[#556855] dark:text-[#889E86] hover:bg-[#F3F1EA] dark:hover:bg-[#2A2E27] rounded-lg transition"
                        title="Preview"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => onDownloadDoc(doc)}
                        className="p-1.5 text-[#8C907F] hover:text-[#47703D] hover:bg-[#F3F1EA] dark:hover:bg-[#2A2E27] rounded-lg transition"
                        title="Download"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteDoc(doc)}
                        className="p-1.5 text-[#8C907F] hover:text-[#B84A39] hover:bg-[#FAF0ED] dark:hover:bg-[#341F1B] rounded-lg transition"
                        title="Admin Purge from S3"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: System Audit Trail */}
      {activeTab === 'logs' && (
        <div className="w-full bg-[#FFFFFF] dark:bg-[#222520] rounded-2xl border border-[#E5E2D9] dark:border-[#2F342B] shadow-2xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F6F4EE] dark:bg-[#292D25] border-b border-[#E5E2D9] dark:border-[#2F342B] text-[#6B705C] dark:text-[#A8ACA0] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-3">Actor / User</th>
                <th className="py-3.5 px-3">Document Target</th>
                <th className="py-3.5 px-3">Details</th>
                <th className="py-3.5 px-3">IP Address</th>
                <th className="py-3.5 pr-4 pl-2 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE7DC] dark:divide-[#2F342B]/80">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#F7F5EE] dark:hover:bg-[#292D25] transition">
                  <td className="py-3 px-4 font-bold text-[#556855] dark:text-[#889E86]">{log.action}</td>
                  <td className="py-3 px-3 font-semibold text-[#3A3A32] dark:text-[#EDEBE4]">{log.userName}</td>
                  <td className="py-3 px-3 text-[#3A3A32] dark:text-[#EDEBE4] truncate max-w-xs">{log.documentName || '—'}</td>
                  <td className="py-3 px-3 text-[#7B806F] dark:text-[#8E9484]">{log.details}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-[#8C907F]">{log.ipAddress}</td>
                  <td className="py-3 pr-4 pl-2 text-right text-[#8C907F]">{formatDate(log.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
