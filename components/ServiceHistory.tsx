import React, { useState, useMemo } from 'react';
import { MaintenanceRecord } from '../types';
import MaintenanceItem from './MaintenanceItem';
import { useApp } from '../context/AppContext';

interface ServiceHistoryProps {
  records: MaintenanceRecord[];
  onEditRecord: (record: MaintenanceRecord) => void;
  onDeleteRecord: (id: string) => void;
  onBack: () => void;
}

interface MonthGroup {
  key: string;
  label: string;
  records: MaintenanceRecord[];
}

const BackIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
  </svg>
);

const ServiceHistory: React.FC<ServiceHistoryProps> = ({ records, onEditRecord, onDeleteRecord, onBack }) => {
  const { t, language } = useApp();
  const [query, setQuery] = useState('');

  const monthGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? records.filter(r =>
          r.description.toLowerCase().includes(q) || (r.notes || '').toLowerCase().includes(q)
        )
      : records;

    const sorted = [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const formatter = new Intl.DateTimeFormat(language === 'ms' ? 'ms-MY' : 'en-US', {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    });

    const groups: MonthGroup[] = [];
    sorted.forEach((record) => {
      const date = new Date(record.date);
      const key = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
      let group = groups[groups.length - 1]?.key === key ? groups[groups.length - 1] : undefined;
      if (!group) {
        group = { key, label: formatter.format(date), records: [] };
        groups.push(group);
      }
      group.records.push(record);
    });

    return groups;
  }, [records, query, language]);

  const hasAnyRecords = records.length > 0;
  const hasVisibleRecords = monthGroups.length > 0;

  return (
    <div className="mb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={onBack}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/50 transition-colors"
          aria-label="Back"
        >
          <BackIcon className="w-5 h-5" />
        </button>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-700 dark:text-slate-300">{t.serviceHistory}</h2>
      </div>

      {/* Search */}
      {hasAnyRecords && (
        <div className="relative mb-6">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchRecords}
            className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md pl-10 pr-3 py-2.5 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
      )}

      {/* Grouped list */}
      {!hasAnyRecords ? (
        <div className="text-center py-8 sm:py-12 px-6 bg-white dark:bg-slate-800 rounded-lg">
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">{t.noMaintenanceHistory}</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2">{t.addRecordToStart}</p>
        </div>
      ) : !hasVisibleRecords ? (
        <div className="text-center py-8 sm:py-12 px-6 bg-white dark:bg-slate-800 rounded-lg">
          <p className="text-slate-500 dark:text-slate-400">{t.noSearchResults}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {monthGroups.map((group) => (
            <div key={group.key}>
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                {group.label}
              </h3>
              <div className="space-y-4">
                {group.records.map((record) => (
                  <MaintenanceItem
                    key={record.id}
                    record={record}
                    onDelete={onDeleteRecord}
                    onEdit={onEditRecord}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceHistory;
