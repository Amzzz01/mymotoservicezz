import React, { useState, useMemo } from 'react';
import { MileageLog, MileageStats, MaintenanceRecord, Vehicle, Reminder } from '../types';
import { useApp } from '../context/AppContext';

interface MileageTrackerProps {
  logs: (MileageLog & { distanceSinceLast: number | null })[];
  stats: MileageStats;
  loading: boolean;
  activeVehicle: Vehicle | null;
  reminders: Reminder[];
  maintenanceRecords: MaintenanceRecord[];
  onAddLog: (log: Omit<MileageLog, 'id' | 'createdAt'>) => Promise<void>;
  onUpdateLog: (id: string, updates: Partial<MileageLog>) => Promise<void>;
  onDeleteLog: (id: string) => Promise<void>;
}

const MileageTracker: React.FC<MileageTrackerProps> = ({
  logs,
  stats,
  loading,
  activeVehicle,
  reminders,
  maintenanceRecords,
  onAddLog,
  onUpdateLog,
  onDeleteLog,
}) => {
  const { t } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFuelStop, setIsFuelStop] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    odometer: '',
    notes: '',
    fuelAmount: '',
    fuelCost: '',
  });

  // Distance between maintenance services
  const serviceDistances = useMemo(() => {
    const sorted = [...maintenanceRecords]
      .filter(r => r.kilometers > 0)
      .sort((a, b) => b.kilometers - a.kilometers);

    return sorted.map((record, i) => {
      const next = sorted[i + 1];
      const distance = next ? record.kilometers - next.kilometers : null;
      return { ...record, distanceSinceLastService: distance };
    });
  }, [maintenanceRecords]);

  // Mileage-based reminders with progress
  const mileageReminders = useMemo(() => {
    if (!activeVehicle) return [];
    return reminders
      .filter(r => r.isActive && !r.dismissed && r.dueMileage)
      .map(r => {
        const current = activeVehicle.currentOdometer;
        const target = r.dueMileage!;
        const progress = Math.min(100, (current / target) * 100);
        const remaining = Math.max(0, target - current);
        return { ...r, progress, remaining, current, target };
      });
  }, [reminders, activeVehicle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeVehicle) return;

    const odometer = parseFloat(formData.odometer);
    if (!formData.date || isNaN(odometer) || odometer <= 0) {
      alert(t.allFieldsRequired || 'Please fill in all required fields.');
      return;
    }

    const fuelAmount = isFuelStop ? parseFloat(formData.fuelAmount) : undefined;
    const fuelCost = isFuelStop ? parseFloat(formData.fuelCost) : undefined;
    const fuelPricePerLiter = fuelAmount && fuelCost ? fuelCost / fuelAmount : undefined;

    const logData: Omit<MileageLog, 'id' | 'createdAt'> = {
      vehicleId: activeVehicle.id,
      userId: '', // will be set by hook
      date: formData.date,
      odometer,
      notes: formData.notes || undefined,
      isFuelStop,
      fuelAmount: isFuelStop && fuelAmount ? fuelAmount : undefined,
      fuelCost: isFuelStop && fuelCost ? fuelCost : undefined,
      fuelPricePerLiter: isFuelStop && fuelPricePerLiter ? fuelPricePerLiter : undefined,
    };

    try {
      if (editingId) {
        await onUpdateLog(editingId, logData);
      } else {
        await onAddLog(logData);
      }
      resetForm();
    } catch (err) {
      console.error('Error saving mileage log:', err);
      alert('Failed to save mileage log. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      odometer: '',
      notes: '',
      fuelAmount: '',
      fuelCost: '',
    });
    setIsFuelStop(false);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (log: MileageLog) => {
    setFormData({
      date: log.date,
      odometer: log.odometer.toString(),
      notes: log.notes || '',
      fuelAmount: log.fuelAmount?.toString() || '',
      fuelCost: log.fuelCost?.toString() || '',
    });
    setIsFuelStop(log.isFuelStop);
    setEditingId(log.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t.confirmDelete || 'Are you sure you want to delete this entry?')) {
      try {
        await onDeleteLog(id);
      } catch (err) {
        console.error('Failed to delete:', err);
      }
    }
  };

  if (!activeVehicle) {
    return (
      <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg shadow-md">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-700 dark:text-slate-300 mb-4">
          {t.mileageTracker || 'Mileage Tracker'}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base px-4">
          {t.pleaseSelectVehicle}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
            {t.mileageTracker || 'Mileage Tracker'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t.mileageSubtitle || 'Track your rides and fuel consumption'}
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-white font-bold py-2.5 sm:py-2 px-4 rounded-lg shadow-md transition-colors text-sm w-full sm:w-auto"
          >
            + {t.addMileageLog || 'Add Mileage Log'}
          </button>
        )}
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-md border-l-4 border-amber-500">
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{t.totalDistance || 'Total Distance'}</p>
          <p className="text-lg sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
            {stats.totalDistance.toLocaleString()} <span className="text-sm font-normal">km</span>
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            ~{Math.round(stats.avgMonthlyKm).toLocaleString()} km/{t.monthly || 'mo'}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-md border-l-4 border-green-500">
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{t.fuelEfficiency || 'Fuel Efficiency'}</p>
          <p className="text-lg sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
            {stats.avgFuelEfficiency > 0 ? stats.avgFuelEfficiency.toFixed(1) : '—'} <span className="text-sm font-normal">km/L</span>
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {stats.avgFuelEfficiency > 0 ? (100 / stats.avgFuelEfficiency).toFixed(1) : '—'} L/100km
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-md border-l-4 border-red-500">
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{t.totalFuelCost || 'Total Fuel Cost'}</p>
          <p className="text-lg sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
            RM {stats.totalFuelCost.toFixed(2)}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {stats.fuelLogCount} {t.fuelStops || 'fuel stops'}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-md border-l-4 border-blue-500">
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{t.costPerKm || 'Cost per km'}</p>
          <p className="text-lg sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
            RM {stats.avgFuelCostPerKm > 0 ? stats.avgFuelCostPerKm.toFixed(3) : '—'}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {stats.totalFuelLiters > 0 ? stats.totalFuelLiters.toFixed(1) : '0'} L {t.totalFuel || 'total fuel'}
          </p>
        </div>
      </div>

      {/* Quick Log Form */}
      {showForm && (
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold mb-4 text-amber-500 dark:text-amber-400">
            {editingId ? (t.editMileageLog || 'Edit Mileage Log') : (t.newMileageLog || 'New Mileage Log')}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t.date || 'Date'} *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2.5 sm:p-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 text-base sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t.odometerReading || 'Odometer Reading'} (km) *
                </label>
                <input
                  type="number"
                  value={formData.odometer}
                  onChange={(e) => setFormData({ ...formData, odometer: e.target.value })}
                  placeholder={activeVehicle ? activeVehicle.currentOdometer.toString() : '0'}
                  className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2.5 sm:p-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 text-base sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t.notesOptional || 'Notes (Optional)'}
              </label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder={t.mileageNotesPlaceholder || 'e.g., Highway ride, daily commute...'}
                className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2.5 sm:p-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 text-base sm:text-sm"
              />
            </div>

            {/* Fuel toggle */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <label className="flex items-center gap-2 mb-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFuelStop}
                  onChange={(e) => setIsFuelStop(e.target.checked)}
                  className="w-4 h-4 accent-amber-500"
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t.includeFuelData || 'Include fuel fill-up data'}
                </span>
              </label>

              {isFuelStop && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ml-6">
                  <div>
                    <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">
                      {t.fuelAmount || 'Fuel Amount'} (L)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.fuelAmount}
                      onChange={(e) => setFormData({ ...formData, fuelAmount: e.target.value })}
                      placeholder="10.5"
                      className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2.5 sm:p-2 text-slate-900 dark:text-slate-100 text-base sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">
                      {t.fuelCostRM || 'Fuel Cost'} (RM)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.fuelCost}
                      onChange={(e) => setFormData({ ...formData, fuelCost: e.target.value })}
                      placeholder="25.00"
                      className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2.5 sm:p-2 text-slate-900 dark:text-slate-100 text-base sm:text-sm"
                    />
                  </div>
                  {formData.fuelAmount && formData.fuelCost && (
                    <div className="sm:col-span-2 text-sm text-slate-500 dark:text-slate-400">
                      {t.pricePerLiter || 'Price per liter'}: RM {(parseFloat(formData.fuelCost) / parseFloat(formData.fuelAmount)).toFixed(3)}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="py-2.5 sm:py-2 px-4 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors order-2 sm:order-1 w-full sm:w-auto"
              >
                {t.cancel || 'Cancel'}
              </button>
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-white font-bold py-2.5 sm:py-2 px-4 rounded-md transition-colors order-1 sm:order-2 w-full sm:w-auto"
              >
                {editingId ? (t.updateRecord || 'Update') : (t.addRecord || 'Add Log')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mileage Reminder Alerts */}
      {mileageReminders.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 sm:p-6 shadow-md">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">
            {t.mileageReminders || 'Mileage Reminders'}
          </h3>
          <div className="space-y-3">
            {mileageReminders.map((r) => (
              <div key={r.id} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{r.title}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    r.remaining === 0
                      ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'
                      : r.remaining < 500
                      ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300'
                      : 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                  }`}>
                    {r.remaining === 0
                      ? (t.overdue || 'Due now!')
                      : `${r.remaining.toLocaleString()} km ${t.remaining || 'remaining'}`
                    }
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full transition-all ${
                      r.progress >= 100 ? 'bg-red-500' : r.progress >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(100, r.progress)}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {r.current.toLocaleString()} / {r.target.toLocaleString()} km
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Distance Between Services */}
      {serviceDistances.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 sm:p-6 shadow-md">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">
            {t.distanceBetweenServices || 'Distance Between Services'}
          </h3>
          <div className="space-y-2">
            {serviceDistances.slice(0, 10).map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                    {record.description}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {new Date(record.date).toLocaleDateString()} &middot; {record.kilometers.toLocaleString()} km
                  </p>
                </div>
                {record.distanceSinceLastService !== null && (
                  <span className="text-sm font-bold text-amber-600 dark:text-amber-400 ml-3 flex-shrink-0">
                    +{record.distanceSinceLastService.toLocaleString()} km
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mileage Log History */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 sm:p-6 shadow-md">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">
          {t.mileageHistory || 'Mileage Log History'}
        </h3>

        {loading ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <p>{t.loadingRecords || 'Loading...'}</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-8 text-slate-400 dark:text-slate-500">
            <p className="text-4xl mb-3">&#9981;</p>
            <p>{t.noMileageLogs || 'No mileage logs yet. Add your first entry!'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className={`border rounded-lg p-3 sm:p-4 transition-colors ${
                  log.isFuelStop
                    ? 'border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg font-bold text-slate-800 dark:text-slate-100">
                        {log.odometer.toLocaleString()} km
                      </span>
                      {log.distanceSinceLast !== null && (
                        <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">
                          +{log.distanceSinceLast.toLocaleString()} km
                        </span>
                      )}
                      {log.isFuelStop && (
                        <span className="text-xs bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full">
                          &#9981; {t.fuelStop || 'Fuel'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      {new Date(log.date).toLocaleDateString()}
                    </p>
                    {log.notes && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{log.notes}</p>
                    )}
                    {log.isFuelStop && log.fuelAmount && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {log.fuelAmount}L &middot; RM {log.fuelCost?.toFixed(2) || '—'}
                        {log.fuelPricePerLiter && ` &middot; RM ${log.fuelPricePerLiter.toFixed(3)}/L`}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(log)}
                      className="text-xs bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-md transition-colors"
                    >
                      {t.edit || 'Edit'}
                    </button>
                    <button
                      onClick={() => handleDelete(log.id)}
                      className="text-xs bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-md transition-colors"
                    >
                      {t.delete || 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MileageTracker;
