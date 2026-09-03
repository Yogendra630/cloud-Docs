import React from 'react';
import { ChevronRight, Home, Folder } from 'lucide-react';
import { FolderItem } from '../../types';

interface BreadcrumbItem {
  id: string | null;
  name: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onSelect: (id: string | null) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onSelect }) => {
  return (
    <nav className="flex items-center space-x-1.5 text-xs text-zinc-500 dark:text-zinc-400 py-2 overflow-x-auto">
      <button
        onClick={() => onSelect(null)}
        className="flex items-center space-x-1 hover:text-zinc-900 dark:hover:text-zinc-100 font-medium shrink-0 transition"
      >
        <Home className="w-3.5 h-3.5 text-blue-600" />
        <span>Root</span>
      </button>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={item.id || idx}>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <button
              onClick={() => onSelect(item.id)}
              disabled={isLast}
              className={`flex items-center space-x-1 shrink-0 truncate max-w-[160px] font-medium transition ${
                isLast
                  ? 'text-zinc-900 dark:text-zinc-100 font-semibold cursor-default'
                  : 'hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <Folder className="w-3 h-3 text-amber-500" />
              <span className="truncate">{item.name}</span>
            </button>
          </React.Fragment>
        );
      })}
    </nav>
  );
};
