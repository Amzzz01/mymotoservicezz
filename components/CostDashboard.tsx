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

const ChartIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M1 11.27c0-.246.033-.492.099-.73l1.523-5.521A2.75 2.75 0 015.273 3h9.454a2.75 2.75 0 012.651 2.019l1.523 5.52c.066.239.099.485.099.731V15a2 2 0 01-2 2H3a2 2 0 01-2-2v-3.73zm3.068-5.852A1.25 1.25 0 015.273 4.5h9.454a1.25 1.25 0 011.205.918l1.523 5.52c.006.02.01.041.015.062H14a1 1 0 00-.86.49l-.606 1.02a1 1 0 01-.86.49H8.236a1 1 0 01-.894-.553l-.448-.894A1 1 0 006 11H2.53l.015-.062 1.523-5.52z" clipRule="evenodd" />
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-violet-600 to-violet-800 rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <DollarIcon className="w-6 h-6 text-white" />
            <h3 className="text-sm font-medium text-violet-100">{t.totalCost}</h3>
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(costSummary.totalCost)}</p>
          <p className="text-xs text-violet-200 mt-1">{costSummary.recordCount} {t.services}</p>
        </div>

        <div className="bg-gradient-to-br from-cyan-600 to-cyan-800 rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <ChartIcon className="w-6 h-6 text-white" />
            <h3 className="text-sm font-medium text-cyan-100">{t.partsCost}</h3>
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(costSummary.totalParts)}</p>
          <p className="text-xs text-cyan-200 mt-1">
            {costSummary.totalCost > 0
              ? `${((costSummary.totalParts / costSummary.totalCost) * 100).toFixed(0)}% ${t.ofTotal}`
              : t.noData}
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <DollarIcon className="w-6 h-6 text-white" />
            <h3 className="text-sm font-medium text-blue-100">{t.laborCost}</h3>
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(costSummary.totalLabor)}</p>
          <p className="text-xs text-blue-200 mt-1">
            {costSummary.totalCost > 0
              ? `${((costSummary.totalLabor / costSummary.totalCost) * 100).toFixed(0)}% ${t.ofTotal}`
              : t.noData}
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <ChartIcon className="w-6 h-6 text-white" />
            <h3 className="text-sm font-medium text-emerald-100">{t.avgPerService}</h3>
          </div>
          <p className="text-2xl font-bold text-white">
            {formatCurrency(costSummary.averageCostPerService)}
          </p>
          <p className="text-xs text-emerald-200 mt-1">{t.basedOnAllRecords}</p>
        </div>
      </div>
    </div>
  );
};

export default CostDashboard;
