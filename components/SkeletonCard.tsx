import React from 'react';

interface SkeletonCardProps {
  className?: string;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ className = '' }) => (
  <div
    role="status"
    aria-label="Loading"
    className={`bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 sm:p-5 animate-pulse ${className}`}
  >
    <div className="flex justify-between items-start">
      <div className="flex-grow">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0" />
          <div className="h-4 w-32 sm:w-40 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="pl-7 space-y-2">
          <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="flex items-center gap-3">
            <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      </div>
      <div className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-700 flex-shrink-0 ml-2" />
    </div>
  </div>
);

export default SkeletonCard;
