import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Server,
  Database,
  Cloud,
  Shield,
  Layers,
  FileCode,
  Copy,
  Check,
  X,
  ExternalLink,
  Cpu,
  Lock,
  ArrowRight,
  Terminal,
} from 'lucide-react';
import { api } from '../../services/api';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  const [sources, setSources] = useState<any[]>([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'diagram' | 'code' | 's3'>('diagram');

  useEffect(() => {
    if (isOpen && sources.length === 0) {
      api.getSpringBootSources().then((data) => {
        if (Array.isArray(data)) setSources(data);
      }).catch(console.error);
    }
  }, [isOpen]);

  const handleCopy = () => {
    if (sources[selectedFileIndex]) {
      navigator.clipboard.writeText(sources[selectedFileIndex].code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-hidden">
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
          className="relative w-full max-w-5xl h-[88vh] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
                  <span>CloudDocs Enterprise Architecture & Backend Inspector</span>
                  <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-full">
                    Production Stack
                  </span>
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  React 19 Frontend • Spring Boot 3 REST API • AWS S3 Object Store • MySQL 8 Database
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex bg-zinc-200/70 dark:bg-zinc-800 p-1 rounded-xl text-xs font-medium">
                <button
                  onClick={() => setActiveTab('diagram')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    activeTab === 'diagram'
                      ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  Architecture Diagram
                </button>
                <button
                  onClick={() => setActiveTab('code')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    activeTab === 'code'
                      ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  Spring Boot & SQL Code
                </button>
                <button
                  onClick={() => setActiveTab('s3')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    activeTab === 's3'
                      ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  AWS S3 Security Model
                </button>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'diagram' && (
              <div className="p-6 h-full overflow-y-auto space-y-6">
                {/* 4-Tier Interactive Flow */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-semibold text-sm">
                        <Cpu className="w-4 h-4" />
                        <span>Client Tier</span>
                      </div>
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mt-2">React 19 + Tailwind</h4>
                      <ul className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 space-y-1">
                        <li>• Drag & Drop File Upload</li>
                        <li>• In-Browser PDF/Code Preview</li>
                        <li>• JWT Authorization Header</li>
                        <li>• Real-time Storage Meter</li>
                      </ul>
                    </div>
                    <div className="mt-4 pt-2 border-t border-blue-200/60 dark:border-blue-900/40 text-[11px] text-blue-700 dark:text-blue-300 font-mono">
                      HTTP/2 • HTTPS
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/40 dark:bg-indigo-950/20 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
                        <Server className="w-4 h-4" />
                        <span>API Gateway</span>
                      </div>
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mt-2">Spring Boot 3 + JWT</h4>
                      <ul className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 space-y-1">
                        <li>• Stateless SecurityFilterChain</li>
                        <li>• RBAC (User vs Admin)</li>
                        <li>• SHA-256 Digest Check</li>
                        <li>• Pre-Signed URL Generator</li>
                      </ul>
                    </div>
                    <div className="mt-4 pt-2 border-t border-indigo-200/60 dark:border-indigo-900/40 text-[11px] text-indigo-700 dark:text-indigo-300 font-mono">
                      Port: 8080 / 3000
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 font-semibold text-sm">
                        <Cloud className="w-4 h-4" />
                        <span>Object Storage</span>
                      </div>
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mt-2">Amazon S3 Bucket</h4>
                      <ul className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 space-y-1">
                        <li>• Private Object ACLs</li>
                        <li>• SSE-S3 AES-256 Encryption</li>
                        <li>• Version Partitioning</li>
                        <li>• 15-Min Expiring Signed URLs</li>
                      </ul>
                    </div>
                    <div className="mt-4 pt-2 border-t border-amber-200/60 dark:border-amber-900/40 text-[11px] text-amber-700 dark:text-amber-300 font-mono">
                      s3://clouddocs-storage
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                        <Database className="w-4 h-4" />
                        <span>Relational DB</span>
                      </div>
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mt-2">MySQL 8 / RDS</h4>
                      <ul className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 space-y-1">
                        <li>• Normalized Schema (BCNF)</li>
                        <li>• Folder Hierarchies & Trees</li>
                        <li>• Document Version Pointers</li>
                        <li>• Tamper-Evident Audit Logs</li>
                      </ul>
                    </div>
                    <div className="mt-4 pt-2 border-t border-emerald-200/60 dark:border-emerald-900/40 text-[11px] text-emerald-700 dark:text-emerald-300 font-mono">
                      InnoDB • Port: 3306
                    </div>
                  </div>
                </div>

                {/* S3 Storage Pattern Explainer */}
                <div className="p-5 rounded-2xl bg-zinc-900 text-zinc-100 dark:bg-zinc-950 border border-zinc-800">
                  <h3 className="text-sm font-semibold flex items-center space-x-2 text-emerald-400">
                    <Shield className="w-4 h-4" />
                    <span>Why S3 + MySQL Separation is the Industry Standard</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-xs text-zinc-300 leading-relaxed">
                    <div>
                      <p className="font-medium text-white mb-1">❌ Anti-Pattern (Storing Blobs in Database):</p>
                      <p>
                        Storing binary files (PDFs, PPTs, Images) directly as LONGBLOB in MySQL bloats table sizes, exhausts RAM buffer pools, slows down backups, and introduces single-point bottleneck risks.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-emerald-300 mb-1">✅ CloudDocs Architecture (S3 + MySQL):</p>
                      <p>
                        Binary files reside in Amazon S3's 99.999999999% durable object store. MySQL only stores lightweight document metadata (1-2 KB per row), S3 object keys, and version records.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Relational Table Mappings */}
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3 flex items-center space-x-2">
                    <Database className="w-4 h-4 text-blue-600" />
                    <span>Relational Database Schema Map</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                    {[
                      { name: 'users', count: '8 users', desc: 'Accounts, Passwords, Quotas, Roles' },
                      { name: 'folders', count: '9 folders', desc: 'Tree hierarchy & color paths' },
                      { name: 'documents', count: '12 docs', desc: 'S3 Keys, sizes, trash, favs' },
                      { name: 'document_versions', count: '18 versions', desc: 'v1, v2, v3 history & hashes' },
                      { name: 'document_shares', count: '6 shares', desc: 'RBAC (VIEWER / EDITOR)' },
                      { name: 'audit_logs', count: '24+ logs', desc: 'IP, action, timestamp audit trail' },
                    ].map((t) => (
                      <div key={t.name} className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                        <div className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 truncate">{t.name}</div>
                        <div className="text-[11px] font-medium text-zinc-800 dark:text-zinc-200 mt-0.5">{t.count}</div>
                        <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 leading-tight">{t.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'code' && (
              <div className="grid grid-cols-1 md:grid-cols-12 h-full overflow-hidden">
                {/* File list sidebar */}
                <div className="md:col-span-4 border-r border-zinc-200 dark:border-zinc-800 h-full overflow-y-auto p-3 space-y-1.5 bg-zinc-50/70 dark:bg-zinc-900/40">
                  <div className="px-3 py-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Spring Boot & Database Files
                  </div>
                  {sources.map((file, idx) => (
                    <button
                      key={file.filePath}
                      onClick={() => setSelectedFileIndex(idx)}
                      className={`w-full text-left p-2.5 rounded-xl transition flex items-start space-x-2.5 ${
                        selectedFileIndex === idx
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'hover:bg-zinc-200/60 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      <FileCode className="w-4 h-4 shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-mono font-medium truncate">{file.filePath.split('/').pop()}</p>
                        <p className={`text-[10px] truncate mt-0.5 ${selectedFileIndex === idx ? 'text-blue-100' : 'text-zinc-400'}`}>
                          {file.category} • {file.filePath}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Code display pane */}
                <div className="md:col-span-8 h-full flex flex-col bg-zinc-950 text-zinc-100 overflow-hidden">
                  {sources[selectedFileIndex] ? (
                    <>
                      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 text-xs">
                        <span className="font-mono text-zinc-300 truncate">{sources[selectedFileIndex].filePath}</span>
                        <button
                          onClick={handleCopy}
                          className="flex items-center space-x-1.5 px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-200 transition"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                        </button>
                      </div>
                      <div className="p-4 flex-1 overflow-auto font-mono text-xs leading-relaxed text-zinc-300 select-text">
                        <pre>{sources[selectedFileIndex].code}</pre>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
                      Loading code sources...
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 's3' && (
              <div className="p-6 h-full overflow-y-auto space-y-6">
                <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50">
                  <h3 className="text-base font-semibold text-blue-950 dark:text-blue-100 flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span>AWS S3 Object Key Partitioning Scheme</span>
                  </h3>
                  <p className="text-xs text-blue-800 dark:text-blue-200 mt-1 leading-relaxed">
                    All document files and version uploads are strictly partitioned under user isolation prefixes with cryptographically unique UUID suffixes.
                  </p>

                  <div className="mt-4 p-3 bg-zinc-900 rounded-xl font-mono text-xs text-emerald-400 overflow-x-auto">
                    s3://clouddocs-storage-production/users/&#123;userId&#125;/documents/&#123;documentId&#125;/v&#123;versionNumber&#125;_&#123;filename&#125;
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                    <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
                      <Lock className="w-4 h-4 text-emerald-500" />
                      <span>Zero Public Access</span>
                    </h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                      S3 bucket has <strong>Block Public Access</strong> enabled on all 4 settings. Direct bucket URLs will result in HTTP 403 Forbidden.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                    <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
                      <Terminal className="w-4 h-4 text-indigo-500" />
                      <span>Pre-Signed URL Security</span>
                    </h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                      Downloads generate AWS SigV4 signed URLs cryptographically valid for only 15 minutes, allowing safe direct streaming without exposing AWS IAM keys.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                    <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-amber-500" />
                      <span>SHA-256 Integrity</span>
                    </h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                      Every version upload computes and stores an immutable SHA-256 digest in MySQL to detect tampering and guarantee bit-level file integrity.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
