import React from 'react';
import { Folder, UploadCloud, FileQuestion, SearchX, Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: 'folder' | 'upload' | 'search' | 'trash' | 'inbox';
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'folder',
  title,
  description,
  actionLabel,
  onAction,
}) => {
  const renderIcon = () => {
    switch (icon) {
      case 'upload':
        return <UploadCloud className="w-12 h-12 text-blue-500/70 dark:text-blue-400/60" />;
      case 'search':
        return <SearchX className="w-12 h-12 text-amber-500/70 dark:text-amber-400/60" />;
      case 'inbox':
        return <Inbox className="w-12 h-12 text-indigo-500/70 dark:text-indigo-400/60" />;
      default:
        return <Folder className="w-12 h-12 text-zinc-400 dark:text-zinc-500" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/30 my-6">
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm border border-zinc-100 dark:border-zinc-700/60 mb-4">
        {renderIcon()}
      </div>
      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mt-1 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl shadow-sm transition-all"
        >
          <UploadCloud className="w-4 h-4" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};
