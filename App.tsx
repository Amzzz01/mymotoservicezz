import React from 'react';
import { MaintenanceRecord } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import MaintenanceForm from './components/MaintenanceForm';
import MaintenanceList from './components/MaintenanceList';
import AISuggestion from './components/AISuggestion';

const MotoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M18.586 4H5.414A2.914 2.914 0 002.5 6.914v1.072A8.004 8.004 0 004 12.5v4.619a1 1 0 001.32.949l3.41-1.364A1 1 0 019 17.76V16h6v1.76a1 1 0 01-.27.648l-3.41 1.364a1 1 0 00-1.32.95V22h2a1 1 0 001-1v-1.115a8.04 8.04 0 003-3.033V15a1 1 0 00-1-1h-1v-1.5a8.004 8.004 0 001.5-4.514V6.914A2.914 2.914 0 0018.586 4zM8 12c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm8 0c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2z"/>
    </svg>
);


function App() {
  const [records, setRecords] = useLocalStorage<MaintenanceRecord[]>('motorcycle-maintenance', []);

  const addRecord = (record: Omit<MaintenanceRecord, 'id'>) => {
    const newRecord: MaintenanceRecord = {
      ...record,
      id: Date.now().toString(),
    };
    setRecords(prevRecords => [newRecord, ...prevRecords]);
  };

  const deleteRecord = (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
        setRecords(prevRecords => prevRecords.filter(record => record.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans">
      <header className="bg-slate-800/50 backdrop-blur-sm p-4 sticky top-0 z-10 shadow-lg shadow-slate-900/50">
        <div className="container mx-auto flex items-center justify-center sm:justify-start gap-4">
          <MotoIcon className="w-10 h-10 text-cyan-400" />
          <h1 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-wider">
            MyMotoLog
          </h1>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <MaintenanceForm onAddRecord={addRecord} />
          <AISuggestion records={records} />
          <MaintenanceList records={records} onDeleteRecord={deleteRecord} />
        </div>
      </main>
      <footer className="text-center p-4 text-slate-500 text-sm">
        <p>Built for the ride.</p>
      </footer>
    </div>
  );
}

export default App;