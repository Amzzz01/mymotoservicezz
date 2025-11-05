import React from 'react';
import { MaintenanceRecord } from '../types';
import MaintenanceItem from './MaintenanceItem';

interface MaintenanceListProps {
  records: MaintenanceRecord[];
  onDeleteRecord: (id: string) => void;
}

const MaintenanceList: React.FC<MaintenanceListProps> = ({ records, onDeleteRecord }) => {
  const sortedRecords = [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (records.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 px-6 bg-slate-800 rounded-lg">
        <h3 className="text-xl font-semibold text-slate-300">No Maintenance History</h3>
        <p className="text-slate-400 mt-2">Click "Add New Maintenance Record" to log your first service.</p>
      </div>
    );
  }

  return (
    <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-slate-300 border-b-2 border-slate-700 pb-2">Service History</h2>
        <div className="space-y-4">
            {sortedRecords.map((record) => (
                <MaintenanceItem key={record.id} record={record} onDelete={onDeleteRecord} />
            ))}
        </div>
    </div>
  );
};

export default MaintenanceList;