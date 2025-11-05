import React from 'react';
import { MaintenanceRecord } from './types';
import { useFirestoreRecords } from './hooks/useFirestoreRecords';
import MaintenanceForm from './components/MaintenanceForm';
import MaintenanceList from './components/MaintenanceList';
import AISuggestion from './components/AISuggestion';
import { useAuth } from './hooks/useAuth';
import AuthPage from './components/AuthPage';

const MotoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M18.586 4H5.414A2.914 2.914 0 002.5 6.914v1.072A8.004 8.004 0 004 12.5v4.619a1 1 0 001.32.949l3.41-1.364A1 1 0 019 17.76V16h6v1.76a1 1 0 01-.27.648l-3.41 1.364a1 1 0 00-1.32.95V22h2a1 1 0 001-1v-1.115a8.04 8.04 0 003-3.033V15a1 1 0 00-1-1h-1v-1.5a8.004 8.004 0 001.5-4.514V6.914A2.914 2.914 0 0018.586 4zM8 12c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm8 0c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2z"/>
    </svg>
);

const LogoutIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clipRule="evenodd" />
      <path fillRule="evenodd" d="M16.72 9.22a.75.75 0 011.06 0l.09.09a2.25 2.25 0 010 3.18l-2.69 2.7a.75.75 0 11-1.06-1.06l2.69-2.7a.75.75 0 000-1.06l-.09-.09a.75.75 0 010-1.06z" clipRule="evenodd" />
      <path fillRule="evenodd" d="M12.25 10a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75z" clipRule="evenodd" />
    </svg>
);


function App() {
  const { currentUser, logout, loading: authLoading } = useAuth();
  const { records, loading: recordsLoading, error, addRecord, deleteRecord } = useFirestoreRecords(currentUser?.uid || '');

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-cyan-400 text-xl">Loading...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthPage />;
  }

  const handleAddRecord = async (record: Omit<MaintenanceRecord, 'id'>) => {
    try {
      await addRecord(record, currentUser.uid);
    } catch (error) {
      console.error('Failed to add record:', error);
      alert('Failed to add maintenance record. Please try again.');
    }
  };

  const handleDeleteRecord = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await deleteRecord(id);
      } catch (error) {
        console.error('Failed to delete record:', error);
        alert('Failed to delete record. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans">
      <header className="bg-slate-800/50 backdrop-blur-sm p-3 sm:p-4 sticky top-0 z-10 shadow-lg shadow-slate-900/50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center justify-center sm:justify-start gap-3 sm:gap-4">
            <MotoIcon className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400" />
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-100 tracking-wider">
              MyMotoLog
            </h1>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="text-sm text-slate-300 hidden sm:block">
              Welcome, <span className="font-bold">{currentUser.email}</span>!
            </span>
             <button onClick={logout} className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors p-2 rounded-lg hover:bg-slate-700/50" aria-label="Logout">
                <LogoutIcon className="w-5 h-5" />
                <span className="text-sm font-medium hidden md:block">Logout</span>
             </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-3 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          <MaintenanceForm onAddRecord={handleAddRecord} />
          <AISuggestion records={records} />
          
          {recordsLoading ? (
            <div className="text-center py-8 text-slate-400">
              <p>Loading your maintenance records...</p>
            </div>
          ) : (
            <MaintenanceList records={records} onDeleteRecord={handleDeleteRecord} />
          )}
        </div>
      </main>
      <footer className="text-center p-4 text-slate-500 text-sm">
        <p>Built for the ride.</p>
      </footer>
    </div>
  );
}

export default App;
