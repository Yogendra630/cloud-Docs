import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Share2,
  X,
  UserPlus,
  Trash2,
  Shield,
  Eye,
  Edit3,
  Check,
  AlertCircle,
  Copy,
  Users,
} from 'lucide-react';
import { DocumentItem, User } from '../../types';
import { api } from '../../services/api';

interface ShareDialogProps {
  document: DocumentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSharedUpdated: () => void;
}

export const ShareDialog: React.FC<ShareDialogProps> = ({
  document: doc,
  isOpen,
  onClose,
  onSharedUpdated,
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [permission, setPermission] = useState<'VIEWER' | 'EDITOR'>('VIEWER');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);

  useEffect(() => {
    if (isOpen) {
      setEmailInput('');
      setError(null);
      setSuccess(null);
      // Load user directory for quick suggestions
      api.searchUsers('').then(setSuggestedUsers).catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen || !doc) return null;

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setError('Please enter or select an email address');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await api.shareDocument(doc.id, emailInput.trim(), permission);
      setSuccess(`Successfully granted ${permission} permission to ${emailInput}`);
      setEmailInput('');
      onSharedUpdated();
    } catch (err: any) {
      setError(err.message || 'Failed to share document');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevoke = async (shareId: string) => {
    try {
      await api.revokeShare(doc.id, shareId);
      onSharedUpdated();
    } catch (err: any) {
      setError(err.message || 'Failed to revoke permission');
    }
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/#doc=${doc.id}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative w-full max-w-lg bg-[#FFFFFF] dark:bg-[#222520] rounded-3xl shadow-2xl border border-[#E5E2D9] dark:border-[#2F342B] flex flex-col z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#EBE7DC] dark:border-[#2F342B] bg-[#F6F4EE]/80 dark:bg-[#292D25]/80">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-[#EEF3ED] dark:bg-[#283226] text-[#556855] dark:text-[#889E86]">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#3A3A32] dark:text-[#EDEBE4]">
                  Share & Collaboration Access
                </h3>
                <p className="text-xs text-[#7B806F] dark:text-[#8E9484] truncate max-w-xs">
                  {doc.name}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#8C907F] hover:text-[#3A3A32] dark:text-[#787D70] dark:hover:text-[#EDEBE4] rounded-lg hover:bg-[#F3F1EA] dark:hover:bg-[#2A2E27]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5 text-xs">
            {error && (
              <div className="p-3 rounded-xl bg-[#FAF0ED] dark:bg-[#341F1B] border border-[#F2D0C7] dark:border-[#522922] text-[#B84A39] dark:text-[#E88C7D] flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 rounded-xl bg-[#EEF4EC] dark:bg-[#202E1E] border border-[#D0E2CC] dark:border-[#354D32] text-[#47703D] dark:text-[#8DBB81] flex items-center space-x-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Invite Form */}
            <form onSubmit={handleShare} className="space-y-3">
              <label className="block font-semibold text-[#4B4F42] dark:text-[#D1D4CA]">
                Invite by Email or Name
              </label>

              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="colleague@clouddocs.io"
                    className="w-full px-3.5 py-2.5 bg-[#FDFCFA] dark:bg-[#282C24] border border-[#E2DEC9] dark:border-[#383E33] rounded-xl outline-hidden focus:border-[#556855] text-[#3A3A32] dark:text-[#EDEBE4] placeholder-[#8C907F]"
                  />
                </div>

                <select
                  value={permission}
                  onChange={(e: any) => setPermission(e.target.value)}
                  className="px-3 py-2.5 bg-[#FDFCFA] dark:bg-[#282C24] border border-[#E2DEC9] dark:border-[#383E33] rounded-xl text-[#3A3A32] dark:text-[#EDEBE4] outline-hidden font-medium"
                >
                  <option value="VIEWER">Can View</option>
                  <option value="EDITOR">Can Edit</option>
                </select>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2.5 bg-[#556855] hover:bg-[#455545] disabled:opacity-50 text-white font-semibold rounded-xl transition shadow-xs flex items-center space-x-1"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Invite</span>
                </button>
              </div>

              {/* Quick Suggestion Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[11px] text-[#8C907F] dark:text-[#787D70] mr-1 self-center">Quick pick:</span>
                {suggestedUsers.slice(0, 4).map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setEmailInput(u.email)}
                    className="px-2 py-0.5 rounded-lg bg-[#F3F1EA] dark:bg-[#2A2E27] text-[11px] text-[#6B705C] dark:text-[#A8ACA0] hover:text-[#556855] dark:hover:text-[#A7C2A4] hover:bg-[#EBE7DC] dark:hover:bg-[#343930] transition"
                  >
                    {u.name}
                  </button>
                ))}
              </div>
            </form>

            {/* Currently Shared List */}
            <div>
              <h4 className="font-semibold text-[#4B4F42] dark:text-[#D1D4CA] mb-2 flex items-center justify-between">
                <span>Who has access</span>
                <span className="text-[11px] font-normal text-[#8C907F]">
                  {doc.shares ? doc.shares.length + 1 : 1} people
                </span>
              </h4>

              <div className="bg-[#F6F4EE] dark:bg-[#292D25] rounded-xl border border-[#E5E1D5] dark:border-[#353A2F] divide-y divide-[#EBE7DC] dark:divide-[#2F342B] max-h-48 overflow-y-auto">
                {/* Document Owner */}
                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5 truncate">
                    <div className="w-7 h-7 rounded-full bg-[#556855] text-white flex items-center justify-center font-bold text-xs">
                      {doc.ownerName ? doc.ownerName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="truncate">
                      <p className="font-semibold text-[#3A3A32] dark:text-[#EDEBE4] truncate">{doc.ownerName || 'Unknown Owner'}</p>
                      <p className="text-[10px] text-[#8C907F]">Owner (Full Control)</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-[#EEF3ED] dark:bg-[#283226] text-[#445543] dark:text-[#B1C8AF] text-[10px] font-bold rounded">
                    OWNER
                  </span>
                </div>

                {/* Active Shares */}
                {doc.shares && doc.shares.length > 0 ? (
                  doc.shares.map((sh) => (
                    <div key={sh.id} className="p-3 flex items-center justify-between">
                      <div className="flex items-center space-x-2.5 truncate">
                        <div className="w-7 h-7 rounded-full bg-[#E5E1D5] dark:bg-[#353A2F] text-[#4B4F42] dark:text-[#D1D4CA] flex items-center justify-center font-bold text-xs">
                          {sh.userEmail ? sh.userEmail.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="truncate">
                          <p className="font-medium text-[#3A3A32] dark:text-[#EDEBE4] truncate">{sh.userName || sh.userEmail}</p>
                          <p className="text-[10px] text-[#8C907F] truncate">{sh.userEmail}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                          sh.permission === 'EDITOR'
                            ? 'bg-[#EEF4EC] dark:bg-[#202E1E] text-[#47703D] dark:text-[#8DBB81]'
                            : 'bg-[#F3F1EA] dark:bg-[#2A2E27] text-[#6B705C] dark:text-[#A8ACA0]'
                        }`}>
                          {sh.permission}
                        </span>
                        <button
                          onClick={() => handleRevoke(sh.id)}
                          className="p-1 text-[#8C907F] hover:text-[#B84A39] rounded-md transition"
                          title="Revoke access"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-[#8C907F] text-xs">
                    No external collaborators yet.
                  </div>
                )}
              </div>
            </div>

            {/* Quick Share Link */}
            <div className="pt-2 flex items-center justify-between border-t border-[#EBE7DC] dark:border-[#2F342B]">
              <button
                onClick={handleCopyLink}
                className="flex items-center space-x-1.5 text-[#556855] dark:text-[#889E86] hover:underline font-medium"
              >
                {copiedLink ? <Check className="w-4 h-4 text-[#47703D] dark:text-[#8DBB81]" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Link copied to clipboard!' : 'Copy direct link'}</span>
              </button>

              <button
                onClick={onClose}
                className="px-4 py-2 bg-[#F3F1EA] hover:bg-[#EBE7DC] dark:bg-[#2A2E27] dark:hover:bg-[#343930] text-[#4B4F42] dark:text-[#D1D4CA] font-medium rounded-xl transition"
              >
                Done
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
