import React from 'react';

export const DocumentCardSkeleton: React.FC = () => {
  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm animate-pulse flex flex-col justify-between h-48">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
        <div className="w-6 h-6 rounded-md bg-zinc-200 dark:bg-zinc-800" />
      </div>
      <div className="space-y-2 mt-4">
        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
        <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
      </div>
      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
        <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />
        <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />
      </div>
    </div>
  );
};

export const DocumentTableSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="p-4 flex items-center justify-between animate-pulse">
          <div className="flex items-center space-x-3 w-1/3">
            <div className="w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-800 shrink-0" />
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
          </div>
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-20 hidden md:block" />
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-24 hidden md:block" />
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-16" />
        </div>
      ))}
    </div>
  );
};
