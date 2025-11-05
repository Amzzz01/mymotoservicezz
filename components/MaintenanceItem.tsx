import React from 'react';
import { MaintenanceRecord } from '../types';

interface MaintenanceItemProps {
  record: MaintenanceRecord;
  onDelete: (id: string) => void;
}

const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zM4.5 8.5a.75.75 0 000 1.5h11a.75.75 0 000-1.5h-11z" clipRule="evenodd" />
    </svg>
);

const GaugeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M11.5 1a.5.5 0 01.5.5V2.856a8.001 8.001 0 11-3 0V1.5a.5.5 0 01.5-.5h2zM10 11a1 1 0 100-2 1 1 0 000 2zm3.834-3.11a.75.75 0 10-1.061-1.06l-.003.002-2.12 2.122a.75.75 0 000 1.06l.001.002 2.122 2.12a.75.75 0 001.06-1.06l-1.59-1.591 1.59-1.59z" clipRule="evenodd" />
    </svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
    </svg>
);

const MotoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M9.01 4.31a2 2 0 00-3.52.27l-.16 1.01-.01.16a8.4 8.4 0 00-2.03.62.75.75 0 00-.5 1.2l1.24 1.25a7.51 7.51 0 00-.3 4.98l-1.6 3.2A.75.75 0 003 18h1.22l.33-1.22a4.5 4.5 0 014.24-3.11l.13-.01.99.99a4.5 4.5 0 011.69 3.35L12 18h1a.75.75 0 00.74-.63l.1-1.04a7.5 7.5 0 001.3-1.62l.24-.37.36.36a.75.75 0 001.06-1.06l-4-4a.75.75 0 00-1.06 0l-.36.36-.37.24a7.5 7.5 0 00-1.62 1.3l-1.04.1A2.25 2.25 0 016.9 9.8l1.32-1.32a.75.75 0 00.32-1.07 8.42 8.42 0 00.12-2.12l.16-.01 1.01-.16a2 2 0 00.27-3.52zM15 11a1 1 0 112 0 1 1 0 01-2 0z"/>
    </svg>
);


const MaintenanceItem: React.FC<MaintenanceItemProps> = ({ record, onDelete }) => {
  const formattedDate = new Date(record.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC', // Ensure date is not shifted by local timezone
  });

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg p-4 sm:p-5 transition-all duration-300 hover:shadow-cyan-500/10 hover:ring-1 hover:ring-slate-700">
      <div className="flex justify-between items-start">
        <div className="flex-grow">
            <div className="flex items-center gap-2 text-slate-200 font-semibold mb-2">
                <MotoIcon className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                <h3 className="text-base sm:text-lg">{record.motorcycleName || 'N/A'} <span className="text-slate-400 font-normal text-sm sm:text-base">({record.motorcycleType || 'Unknown Type'})</span></h3>
            </div>
            
            <div className="pl-7">
                <p className="text-slate-100 text-base sm:text-lg mb-2">{record.description}</p>
                <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-3 text-sm text-slate-400">
                    <div className="flex items-center gap-1.5">
                        <CalendarIcon className="w-4 h-4 text-slate-500" />
                        <span>{formattedDate}</span>
                    </div>
                    <span className="text-slate-600 hidden sm:inline">|</span>
                    <div className="flex items-center gap-1.5">
                        <GaugeIcon className="w-4 h-4 text-slate-500" />
                        <span>{record.kilometers.toLocaleString('en-US')} km</span>
                    </div>
                </div>
            </div>
        </div>
        <button
          onClick={() => onDelete(record.id)}
          className="text-slate-500 hover:text-red-400 transition-colors p-1 rounded-full flex-shrink-0 ml-2"
          aria-label="Delete record"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default MaintenanceItem;