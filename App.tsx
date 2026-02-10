import React, { useState } from 'react';
import { MaintenanceRecord } from './types';
import { useFirestoreRecords } from './hooks/useFirestoreRecords';
import { useVehicles } from './hooks/useVehicles';
import { useReminders } from './hooks/useReminders';
import { useMileageTracker } from './hooks/useMileageTracker';
import MaintenanceForm from './components/MaintenanceForm';
import MaintenanceList from './components/MaintenanceList';
import AISuggestion from './components/AISuggestion';
import VehicleManager from './components/VehicleManager';
import CostDashboard from './components/CostDashboard';
import ReminderManager from './components/ReminderManager';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import MileageTracker from './components/MileageTracker';
import { useAuth } from './hooks/useAuth';
import AuthPage from './components/AuthPage';
import { useApp } from './context/AppContext';
import SettingsButton from './components/SettingsButton';
import Footer from './components/Footer';
import InstallPrompt from './components/InstallPrompt';
import VehicleSelector from './components/VehicleSelector';
import AnnouncementSystem from './components/AnnouncementSystem';

const MotoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.586 4H5.414A2.914 2.914 0 002.5 6.914v1.072A8.004 8.004 0 004 12.5v4.619a1 1 0 001.32.949l3.41-1.364A1 1 0 009 17.76V16h6v1.76a1 1 0 01-.27.648l-3.41 1.364a1 1 0 00-1.32.95V22h2a1 1 0 001-1v-1.115a8.04 8.04 0 003-3.033V15a1 1 0 00-1-1h-1v-1.5a8.004 8.004 0 001.5-4.514V6.914A2.914 2.914 0 0018.586 4zM8 12c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm8 0c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2z" />
  </svg>
);

const LogoutIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

function App() {
  const { currentUser, logout } = useAuth();
  const { t } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'mileage' | 'reminders' | 'vehicles'>('overview');
  const [editingRecord, setEditingRecord] = useState<MaintenanceRecord | null>(null);

  // Custom hooks for data management
  const { vehicles, activeVehicle, addVehicle, updateVehicle, deleteVehicle, setActive, error: vehiclesError } = useVehicles(currentUser?.uid);

  const {
    records,
    addRecord,
    updateRecord,
    deleteRecord,
    loading: recordsLoading,
    error: recordsError,
    costSummary
  } = useFirestoreRecords(currentUser?.uid, activeVehicle?.id);

  const {
    reminders,
    addReminder,
    updateReminder,
    deleteReminder,
    dismissReminder,
  } = useReminders(currentUser?.uid, activeVehicle?.id);

  const {
    logsWithDistance: mileageLogs,
    stats: mileageStats,
    loading: mileageLoading,
    addLog: addMileageLog,
    updateLog: updateMileageLog,
    deleteLog: deleteMileageLog,
  } = useMileageTracker(currentUser?.uid, activeVehicle?.id);

  const error = vehiclesError || recordsError;

  const handleAddMileageLog = async (log: Parameters<typeof addMileageLog>[0]) => {
    await addMileageLog(log);
    if (activeVehicle && log.odometer > activeVehicle.currentOdometer) {
      await updateVehicle(activeVehicle.id, { currentOdometer: log.odometer });
    }
  };

  const handleUpdateMileageLog = async (id: string, updates: Parameters<typeof updateMileageLog>[1]) => {
    await updateMileageLog(id, updates);
    if (activeVehicle && updates.odometer && updates.odometer > activeVehicle.currentOdometer) {
      await updateVehicle(activeVehicle.id, { currentOdometer: updates.odometer });
    }
  };

  if (!currentUser) {
    return <AuthPage />;
  }

  const handleAddRecord = async (record: Omit<MaintenanceRecord, 'id'>) => {
    try {
      if (!currentUser?.uid) {
        alert(t.mustBeLoggedIn);
        return;
      }

      if (!activeVehicle) {
        alert(t.pleaseSelectVehicle);
        return;
      }

      // Add the record
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
        alert(t.mustBeLoggedIn);
        return;
      }

      if (!activeVehicle) {
        alert(t.pleaseSelectVehicle);
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
    if (window.confirm(t.confirmDelete)) {
      try {
        await deleteRecord(id);
      } catch (error: any) {
        console.error('Failed to delete record:', error);
        alert(error.message || 'Failed to delete record. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 font-sans transition-colors duration-200">
      <header className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm p-3 sm:p-4 sticky top-0 z-10 shadow-md dark:shadow-slate-900/50 transition-colors duration-200">
        <div className="container mx-auto flex items-center justify-between gap-2">
          {/* Logo and Title - Mobile optimized */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <img
              src="/icons/icon-192x192.png"
              alt="MyMotoLog"
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full"
            />
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-wider">
              {t.appName}
            </h1>
          </div>

          {/* ✅ UPDATED: Right side controls with new components */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* ✅ NEW: Vehicle Selector (replaces static vehicle indicator) */}
            <VehicleSelector
              vehicles={vehicles}
              activeVehicle={activeVehicle}
              onSelectVehicle={setActive}
            />

            {/* User email - hide on mobile */}
            <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 hidden md:block">
              {t.welcome}, <span className="font-bold">{currentUser.email}</span>!
            </span>

            {/* ✅ NEW: Announcement System */}
            <AnnouncementSystem userId={currentUser.uid} />

            {/* Settings Button */}
            <SettingsButton />

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center gap-1 sm:gap-2 text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700/50"
              aria-label={t.logout}
            >
              <LogoutIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-medium hidden sm:block">{t.logout}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation - Mobile optimized with horizontal scroll */}
      <div className="container mx-auto px-3 sm:px-6 pt-4 sm:pt-6">
        <div className="flex gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm sm:text-base flex-shrink-0 ${activeTab === 'overview'
              ? 'bg-cyan-500 text-white shadow-lg'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
          >
            📊 {t.overview}
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm sm:text-base flex-shrink-0 ${activeTab === 'analytics'
              ? 'bg-purple-500 text-white shadow-lg'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
          >
            📈 {t.analytics || 'Analytics'}
          </button>

          <button
            onClick={() => setActiveTab('mileage')}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm sm:text-base flex-shrink-0 ${activeTab === 'mileage'
              ? 'bg-amber-500 text-white shadow-lg'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
          >
            &#9981; {t.mileage || 'Mileage'}
          </button>

          <button
            onClick={() => setActiveTab('reminders')}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm sm:text-base flex-shrink-0 ${activeTab === 'reminders'
              ? 'bg-violet-500 text-white shadow-lg'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
          >
            🔔 {t.reminders}
            {reminders.filter(r => !r.dismissed && r.isActive).length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {reminders.filter(r => !r.dismissed && r.isActive).length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('vehicles')}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm sm:text-base flex-shrink-0 ${activeTab === 'vehicles'
              ? 'bg-emerald-500 text-white shadow-lg'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
          >
            🏍️ {t.vehicles} ({vehicles.length})
          </button>
        </div>
      </div>

      <main className="container mx-auto p-3 sm:p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          {error && (
            <div className="bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-300 px-4 py-3 rounded-lg mb-4 text-sm sm:text-base">
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
                  <AISuggestion
                    records={records}
                    activeVehicle={activeVehicle}
                    onAddReminder={addReminder}
                    userId={currentUser.uid}
                  />
                  {recordsLoading ? (
                    <div className="text-center py-8 text-slate-600 dark:text-slate-400">
                      <p>{t.loadingRecords}</p>
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
                <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg shadow-md">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-700 dark:text-slate-300 mb-4">
                    {t.welcomeTitle}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm sm:text-base px-4">
                    {t.welcomeMessage}
                  </p>
                  <button
                    onClick={() => setActiveTab('vehicles')}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
                  >
                    {t.addFirstVehicle}
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab === 'analytics' && (
            <AnalyticsDashboard
              records={records}
              activeVehicle={activeVehicle}
              onAddReminder={addReminder}
              userId={currentUser.uid}
            />
          )}

          {activeTab === 'mileage' && (
            <MileageTracker
              logs={mileageLogs}
              stats={mileageStats}
              loading={mileageLoading}
              activeVehicle={activeVehicle}
              reminders={reminders}
              maintenanceRecords={records}
              onAddLog={handleAddMileageLog}
              onUpdateLog={handleUpdateMileageLog}
              onDeleteLog={deleteMileageLog}
            />
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

      <Footer />

      <InstallPrompt />
    </div>
  );
}

export default App;