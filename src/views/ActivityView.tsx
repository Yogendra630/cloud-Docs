import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { AuditLog } from '../types';
import { api } from '../services/api';
import { formatDate, formatRelativeTime } from '../utils/formatters';

export const ActivityView: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [selectedAction, setSelectedAction] = useState<string>('ALL');
  const [, setIsLoading] = useState(true);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const data = await api.getActivity(selectedAction !== 'ALL' ? selectedAction : undefined, 100);
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [selectedAction]);

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'UPLOAD':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-[#EEF4EC] dark:bg-[#202E1E] text-[#47703D] dark:text-[#8DBB81]">UPLOAD</span>;
      case 'DOWNLOAD':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-[#EEF3ED] dark:bg-[#283226] text-[#445543] dark:text-[#B1C8AF]">DOWNLOAD</span>;
      case 'SHARE':
      case 'REVOKE_SHARE':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-[#EEF3F0] dark:bg-[#202E29] text-[#3E6585] dark:text-[#8CB4D6]">SHARE</span>;
      case 'DELETE':
      case 'PURGE':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-[#FAF0ED] dark:bg-[#341F1B] text-[#B84A39] dark:text-[#E88C7D]">DELETE</span>;
      case 'LOGIN':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-[#FAF2EB] dark:bg-[#34271B] text-[#B5825D] dark:text-[#DDA15E]">AUTH</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-[#F3F1EA] dark:bg-[#2A2E27] text-[#6B705C] dark:text-[#A8ACA0]">{action}</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#3A3A32] dark:text-[#EDEBE4] flex items-center space-x-2.5">
            <Activity className="w-6 h-6 text-[#556855] dark:text-[#889E86]" />
            <span>Audit Trail & Activity Logs</span>
          </h1>
          <p className="text-xs text-[#7B806F] dark:text-[#8E9484]">Immutable record of all file uploads, downloads, shares, and authorizations</p>
        </div>

        {/* Action Filter */}
        <div className="flex items-center space-x-2">
          {['ALL', 'UPLOAD', 'DOWNLOAD', 'SHARE', 'DELETE', 'LOGIN'].map((act) => (
            <button
              key={act}
              onClick={() => setSelectedAction(act)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedAction === act
                  ? 'bg-[#556855] text-white shadow-2xs'
                  : 'bg-[#FFFFFF] dark:bg-[#222520] text-[#6B705C] dark:text-[#A8ACA0] border border-[#E5E2D9] dark:border-[#2F342B] hover:bg-[#F3F1EA] dark:hover:bg-[#2A2E27]'
              }`}
            >
              {act}
            </button>
          ))}
        </div>
      </div>

      {/* Log Table */}
      <div className="w-full bg-[#FFFFFF] dark:bg-[#222520] rounded-2xl border border-[#E5E2D9] dark:border-[#2F342B] shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F6F4EE] dark:bg-[#292D25] border-b border-[#E5E2D9] dark:border-[#2F342B] text-[#6B705C] dark:text-[#A8ACA0] uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3.5 px-4">Action</th>
              <th className="py-3.5 px-3">Actor / User</th>
              <th className="py-3.5 px-3">Target Document</th>
              <th className="py-3.5 px-3">Details</th>
              <th className="py-3.5 px-3">IP Address</th>
              <th className="py-3.5 px-4 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EBE7DC] dark:divide-[#2F342B]/80">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-[#F7F5EE] dark:hover:bg-[#292D25] transition">
                <td className="py-3 px-4">{getActionBadge(log.action)}</td>
                <td className="py-3 px-3">
                  <div className="font-semibold text-[#3A3A32] dark:text-[#EDEBE4]">{log.userName}</div>
                  <div className="text-[10px] text-[#8C907F] font-mono">{log.userId}</div>
                </td>
                <td className="py-3 px-3">
                  <div className="font-medium text-[#3A3A32] dark:text-[#EDEBE4] truncate max-w-[180px]">
                    {log.documentName || '—'}
                  </div>
                  {log.documentId && (
                    <div className="text-[10px] text-[#8C907F] font-mono truncate max-w-[140px]">
                      {log.documentId}
                    </div>
                  )}
                </td>
                <td className="py-3 px-3 text-[#6B705C] dark:text-[#A8ACA0] max-w-xs truncate">
                  {log.details}
                </td>
                <td className="py-3 px-3 font-mono text-[11px] text-[#7B806F] dark:text-[#8E9484]">
                  {log.ipAddress}
                </td>
                <td className="py-3 px-4 text-right text-[#7B806F] dark:text-[#8E9484]">
                  <div>{formatDate(log.createdAt)}</div>
                  <div className="text-[10px] text-[#8C907F]">{formatRelativeTime(log.createdAt)}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
