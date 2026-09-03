import React, { useState, useEffect } from 'react';
import { HardDrive, FileText } from 'lucide-react';
import { StorageAnalytics, DocumentItem } from '../types';
import { api } from '../services/api';
import { formatBytes } from '../utils/formatters';

export const StorageAnalyticsView: React.FC = () => {
  const [analytics, setAnalytics] = useState<StorageAnalytics | null>(null);
  const [largestDocs, setLargestDocs] = useState<DocumentItem[]>([]);
  const [, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [an, docs] = await Promise.all([
          api.getStorageAnalytics(),
          api.getDocuments({ sort: 'fileSizeBytes_desc' }),
        ]);
        setAnalytics(an);
        setLargestDocs(docs.slice(0, 5));
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const quotaPercent = analytics
    ? Math.min(100, Math.round((analytics.usedBytes / analytics.quotaBytes) * 100))
    : 0;

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#3A3A32] dark:text-[#EDEBE4] flex items-center space-x-2.5">
          <HardDrive className="w-6 h-6 text-[#556855] dark:text-[#889E86]" />
          <span>AWS S3 Storage Analytics</span>
        </h1>
        <p className="text-xs text-[#7B806F] dark:text-[#8E9484]">Live storage usage, quota limits, file type distribution, and capacity forecast</p>
      </div>

      {/* Main Quota Card */}
      <div className="p-6 rounded-3xl bg-[#FFFFFF] dark:bg-[#222520] border border-[#E5E2D9] dark:border-[#2F342B] shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#556855] dark:text-[#889E86]">
              AWS S3 Standard Bucket Usage
            </span>
            <h2 className="text-3xl font-extrabold text-[#3A3A32] dark:text-[#EDEBE4] mt-1">
              {analytics ? formatBytes(analytics.usedBytes) : '2.8 GB'} <span className="text-lg font-normal text-[#8C907F]">of {analytics ? formatBytes(analytics.quotaBytes) : '15 GB'}</span>
            </h2>
            <p className="text-xs text-[#7B806F] dark:text-[#8E9484] mt-1">
              {(15 - (analytics ? analytics.usedBytes / (1024 * 1024 * 1024) : 2.8)).toFixed(1)} GB remaining before quota threshold
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <span className="text-2xl font-black text-[#556855] dark:text-[#889E86]">{quotaPercent}%</span>
              <span className="block text-[11px] text-[#8C907F]">Utilized Capacity</span>
            </div>
          </div>
        </div>

        {/* Big Progress Gauge */}
        <div className="mt-6">
          <div className="w-full h-4 bg-[#F3F1EA] dark:bg-[#2A2E27] rounded-full overflow-hidden flex">
            {analytics?.breakdown.map((item) => (
              <div
                key={item.type}
                className="h-full transition-all duration-500"
                style={{
                  width: `${Math.max(2, item.percentage)}%`,
                  backgroundColor: item.color,
                }}
                title={`${item.type}: ${formatBytes(item.bytes)} (${item.percentage}%)`}
              />
            ))}
          </div>
        </div>

        {/* Breakdown Legend Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mt-6 pt-4 border-t border-[#EBE7DC] dark:border-[#2F342B]">
          {analytics?.breakdown.map((item) => (
            <div key={item.type} className="p-3 rounded-xl bg-[#F6F4EE] dark:bg-[#292D25] border border-[#E5E1D5] dark:border-[#353A2F]">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="font-bold text-xs text-[#3A3A32] dark:text-[#EDEBE4]">{item.type}</span>
              </div>
              <p className="text-xs font-semibold text-[#4B4F42] dark:text-[#D1D4CA] mt-1.5">{formatBytes(item.bytes)}</p>
              <p className="text-[10px] text-[#7B806F] dark:text-[#8E9484]">{item.percentage}% of storage</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top 5 Largest Files in S3 */}
      <div className="p-6 rounded-3xl bg-[#FFFFFF] dark:bg-[#222520] border border-[#E5E2D9] dark:border-[#2F342B] shadow-2xs">
        <h3 className="text-sm font-bold text-[#3A3A32] dark:text-[#EDEBE4] mb-4 flex items-center space-x-2">
          <FileText className="w-4 h-4 text-[#B5825D]" />
          <span>Top Largest S3 Objects</span>
        </h3>

        <div className="divide-y divide-[#EBE7DC] dark:divide-[#2F342B] text-xs">
          {largestDocs.map((doc, idx) => (
            <div key={doc.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center space-x-3 truncate">
                <span className="w-5 h-5 rounded-full bg-[#F3F1EA] dark:bg-[#2A2E27] text-[#6B705C] dark:text-[#A8ACA0] font-bold text-[11px] flex items-center justify-center">
                  {idx + 1}
                </span>
                <div className="truncate">
                  <p className="font-semibold text-[#3A3A32] dark:text-[#EDEBE4] truncate">{doc.name}</p>
                  <p className="text-[10px] text-[#8C907F] font-mono truncate">{doc.s3Key}</p>
                </div>
              </div>

              <div className="text-right shrink-0 ml-3">
                <span className="font-bold text-[#3A3A32] dark:text-[#EDEBE4] font-mono">{formatBytes(doc.fileSizeBytes)}</span>
                <span className="block text-[10px] text-[#8C907F]">v{doc.currentVersion}.0</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
