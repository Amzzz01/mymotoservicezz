import React from 'react';
import { CostSummary } from '../types';
import { useApp } from '../context/AppContext';

interface CostDashboardProps {
  costSummary: CostSummary;
}

const DollarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M10.75 10.818v2.614A3.13 3.13 0 0011.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 00-1.138-.432zM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 00-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.202.592.037.051.08.102.128.152z" />
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-6a.75.75 0 01.75.75v.316a3.78 3.78 0 011.653.713c.426.33.744.74.925 1.2a.75.75 0 01-1.395.55 1.35 1.35 0 00-.447-.563 2.187 2.187 0 00-.736-.363V9.3c.698.093 1.383.32 1.959.696.787.514 1.29 1.27 1.29 2.13 0 .86-.504 1.616-1.29 2.13-.576.377-1.261.603-1.96.696v.299a.75.75 0 11-1.5 0v-.3c-.697-.092-1.382-.318-1.958-.695-.482-.315-.857-.717-1.078-1.188a.75.75 0 011.359-.636c.08.173.245.376.54.569.313.205.706.353 1.138.432v-2.748a3.782 3.782 0 01-1.653-.713C6.9 9.433 6.5 8.681 6.5 7.875c0-.805.4-1.558 1.097-2.096a3.78 3.78 0 011.653-.713V4.75A.75.75 0 0110 4z" clipRule="evenodd" />
  </svg>
);

const ToolIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <g transform="rotate(45 12 12)">
      <rect x="10.5" y="4" width="3" height="10" rx="1.5" strokeWidth={2} />
      <circle cx="12" cy="17" r="3" strokeWidth={2} />
    </g>
  </svg>
);

const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <circle cx="12" cy="8" r="3" strokeWidth={2} />
    <path d="M6 20a6 6 0 0112 0" strokeWidth={2} strokeLinecap="round" />
  </svg>
);

const ReceiptIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <rect x="7" y="4" width="10" height="15" rx="1" strokeWidth={2} />
    <line x1="9.5" y1="9" x2="14.5" y2="9" strokeWidth={2} strokeLinecap="round" />
    <line x1="9.5" y1="13" x2="14.5" y2="13" strokeWidth={2} strokeLinecap="round" />
  </svg>
);

const CostDashboard: React.FC<CostDashboardProps> = ({ costSummary }) => {
  const { t } = useApp();

  const formatCurrency = (amount: number) => {
    return `RM ${amount.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-slate-700 dark:text-slate-300">{t.costOverview}</h2>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4">
          <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
            <DollarIcon className="w-5 h-5" />
            <h3 className="text-xs font-medium">{t.totalCost}</h3>
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{formatCurrency(costSummary.totalCost)}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{costSummary.recordCount} {t.services}</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4">
          <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
            <ToolIcon className="w-5 h-5" />
            <h3 className="text-xs font-medium">{t.partsCost}</h3>
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{formatCurrency(costSummary.totalParts)}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {costSummary.totalCost > 0
              ? `${((costSummary.totalParts / costSummary.totalCost) * 100).toFixed(0)}% ${t.ofTotal}`
              : t.noData}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4">
          <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
            <UserIcon className="w-5 h-5" />
            <h3 className="text-xs font-medium">{t.laborCost}</h3>
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{formatCurrency(costSummary.totalLabor)}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {costSummary.totalCost > 0
              ? `${((costSummary.totalLabor / costSummary.totalCost) * 100).toFixed(0)}% ${t.ofTotal}`
              : t.noData}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4">
          <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400">
            <ReceiptIcon className="w-5 h-5" />
            <h3 className="text-xs font-medium">{t.avgPerService}</h3>
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {formatCurrency(costSummary.averageCostPerService)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.basedOnAllRecords}</p>
        </div>
      </div>
    </div>
  );
};

export default CostDashboard;
