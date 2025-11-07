import React, { useState } from 'react';
import { MaintenanceRecord } from './types';
import { useFirestoreRecords } from './hooks/useFirestoreRecords';
import { useVehicles } from './hooks/useVehicles';
import { useReminders } from './hooks/useReminders';
import MaintenanceForm from './components/MaintenanceForm';
import MaintenanceList from './components/MaintenanceList';
import AISuggestion from './components/AISuggestion';
import VehicleManager from './components/VehicleManager';
import CostDashboard from './components/CostDashboard';
import ReminderManager from './components/ReminderManager';
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
  const { vehicles, activeVehicle, loading: vehiclesLoading, addVehicle, updateVehicle, deleteVehicle, setActive } = useVehicles(currentUser?.uid || '');
  const { records, loading: recordsLoading, error, costSummary, addRecord, updateRecord, deleteRecord } = useFirestoreRecords(currentUser?.uid || '', activeVehicle?.id);
  const { reminders, loading: remindersLoading, addReminder, updateReminder, deleteReminder, dismissReminder } = useReminders(currentUser?.uid || '', activeVehicle?.id);
  const [activeTab, setActiveTab] = useState<'overview' | 'reminders' | 'vehicles'>('overview');
  const [editingRecord, setEditingRecord] = useState<MaintenanceRecord | null>(null);

  if (authLoading || vehiclesLoading) {
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
      if (!currentUser?.uid) {
        alert('You must be logged in to add records.');
        return;
      }

      if (!activeVehicle) {
        alert('Please select or add a vehicle first.');
        return;
      }

      // Add the record - userId will be added in the hook
      await addRecord(record);
      
      // Update vehicle odometer if the new reading is higher
      if (record.kilometers > activeVehicle.currentOdometer) {
        await updateVehicle(activeVehicle.id, { currentOdometer: record.kilometers });
      }
    } catch (error: any) {
      console.error('Failed to add record:', error);
      alert(error.message || 'Failed to add maintenance record. Please try again.');
    }
  };

  const handleUpdateRecord = async (id: string, record: Omit<MaintenanceRecord, 'id'>) => {
    try {
      if (!currentUser?.uid) {
        alert('You must be logged in to update records.');
        return;
      }

      if (!activeVehicle) {
        alert('Please select or add a vehicle first.');
        return;
      }

      // Update the record
      await updateRecord(id, record);
      
      // Update vehicle odometer if the new reading is higher
      if (record.kilometers > activeVehicle.currentOdometer) {
        await updateVehicle(activeVehicle.id, { currentOdometer: record.kilometers });
      }
      
      // Clear editing state
      setEditingRecord(null);
    } catch (error: any) {
      console.error('Failed to update record:', error);
      alert(error.message || 'Failed to update maintenance record. Please try again.');
    }
  };

  const handleEditRecord = (record: MaintenanceRecord) => {
    setEditingRecord(record);
    // Scroll to top to show the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingRecord(null);
  };

  const handleDeleteRecord = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await deleteRecord(id);
      } catch (error: any) {
        console.error('Failed to delete record:', error);
        alert(error.message || 'Failed to delete record. Please try again.');
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
            {activeVehicle && (
              <div className="hidden md:block text-right">
                <div className="text-xs text-slate-400">Active Vehicle</div>
                <div className="text-sm font-bold text-cyan-400">{activeVehicle.name}</div>
              </div>
            )}
            <span className="text-sm text-slate-300 hidden sm:block">
              Welcome, <span className="font-bold">{currentUser.email}</span>!
            </span>
            <button 
              onClick={logout} 
              className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors p-2 rounded-lg hover:bg-slate-700/50" 
              aria-label="Logout"
            >
              <LogoutIcon className="w-5 h-5" />
              <span className="text-sm font-medium hidden md:block">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="container mx-auto px-3 sm:px-6 pt-6">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-cyan-500 text-slate-900 shadow-lg'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            📊 Overview
          </button>
          <button
            onClick={() => setActiveTab('reminders')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'reminders'
                ? 'bg-violet-500 text-white shadow-lg'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🔔 Reminders
            {reminders.filter(r => !r.dismissed && r.isActive).length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {reminders.filter(r => !r.dismissed && r.isActive).length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('vehicles')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'vehicles'
                ? 'bg-emerald-500 text-white shadow-lg'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🏍️ Vehicles ({vehicles.length})
          </button>
        </div>
      </div>

      <main className="container mx-auto p-3 sm:p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {activeTab === 'overview' && (
            <>
              {activeVehicle ? (
                <>
                  <CostDashboard costSummary={costSummary} />
                  <MaintenanceForm 
                    onAddRecord={handleAddRecord}
                    onUpdateRecord={handleUpdateRecord} 
                    vehicles={vehicles}
                    activeVehicle={activeVehicle}
                    editingRecord={editingRecord}
                    onCancelEdit={handleCancelEdit}
                  />
                  <AISuggestion records={records} />
                  {recordsLoading ? (
                    <div className="text-center py-8 text-slate-400">
                      <p>Loading your maintenance records...</p>
                    </div>
                  ) : (
                    <MaintenanceList 
                      records={records} 
                      onDeleteRecord={handleDeleteRecord}
                      onEditRecord={handleEditRecord}
                    />
                  )}
                </>
              ) : (
                <div className="text-center py-12 bg-slate-800 rounded-lg">
                  <h2 className="text-2xl font-bold text-slate-300 mb-4">Welcome to MyMotoLog!</h2>
                  <p className="text-slate-400 mb-6">Get started by adding your first vehicle.</p>
                  <button
                    onClick={() => setActiveTab('vehicles')}
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 px-6 rounded-lg shadow-lg transition-colors"
                  >
                    Add Your First Vehicle
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab === 'reminders' && (
            <ReminderManager
              reminders={reminders}
              vehicles={vehicles}
              activeVehicle={activeVehicle}
              onAddReminder={addReminder}
              onUpdateReminder={updateReminder}
              onDeleteReminder={deleteReminder}
              onDismissReminder={dismissReminder}
              userId={currentUser.uid}
            />
          )}

          {activeTab === 'vehicles' && (
            <VehicleManager
              vehicles={vehicles}
              activeVehicle={activeVehicle}
              onAddVehicle={addVehicle}
              onUpdateVehicle={updateVehicle}
              onDeleteVehicle={deleteVehicle}
              onSetActive={setActive}
              userId={currentUser.uid}
              records={records}
            />
          )}
        </div>
      </main>

      <footer className="text-center p-4 text-slate-500 text-sm">
        <p>Built for your motorcycle maintenance needs.</p>
      </footer>
    </div>
  );
}

export default App;