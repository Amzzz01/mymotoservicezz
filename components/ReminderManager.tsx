import React, { useState } from 'react';
import { Reminder, Vehicle } from '../types';
import { useApp } from '../context/AppContext';

interface ReminderManagerProps {
  reminders: Reminder[];
  vehicles: Vehicle[];
  activeVehicle: Vehicle | null;
  onAddReminder: (reminder: Omit<Reminder, 'id' | 'createdAt'>) => Promise<void>;
  onUpdateReminder: (id: string, updates: Partial<Reminder>) => Promise<void>;
  onDeleteReminder: (id: string) => Promise<void>;
  onDismissReminder: (id: string) => Promise<void>;
  userId: string;
}

const BellIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.076 32.91 32.91 0 003.256.508 3.5 3.5 0 006.972 0 32.903 32.903 0 003.256-.508.75.75 0 00.515-1.076A11.448 11.448 0 0116 8a6 6 0 00-6-6zM8.05 14.943a33.54 33.54 0 003.9 0 2 2 0 01-3.9 0z" clipRule="evenodd" />
  </svg>
);

const ReminderManager: React.FC<ReminderManagerProps> = ({
  reminders,
  vehicles,
  activeVehicle,
  onAddReminder,
  onUpdateReminder,
  onDeleteReminder,
  onDismissReminder,
  userId
}) => {
  const { t } = useApp();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    vehicleId: activeVehicle?.id || '',
    dueDate: '',
    dueMileage: '',
    repeatInterval: '' as '' | 'monthly' | 'quarterly' | 'biannually' | 'yearly',
    mileageInterval: '',
    isTimeBased: true,
    isMileageBased: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.vehicleId) {
      alert(t.titleAndVehicleRequired);
      return;
    }

    // Validate that at least one reminder type is set
    const hasTimeReminder = formData.isTimeBased && formData.dueDate;
    const hasMileageReminder = formData.isMileageBased && formData.dueMileage;

    if (!hasTimeReminder && !hasMileageReminder) {
      alert(t.setAtLeastOneReminder);
      return;
    }

    // Build reminder data, only including fields that have values
    const reminderData: any = {
      userId,
      vehicleId: formData.vehicleId,
      title: formData.title,
      isActive: true,
      dismissed: false
    };

    // Add optional fields only if they have values
    if (formData.description) {
      reminderData.description = formData.description;
    }

    // Add time-based fields only if checkbox is checked and has values
    if (formData.isTimeBased && formData.dueDate) {
      reminderData.dueDate = formData.dueDate;

      if (formData.repeatInterval) {
        reminderData.repeatInterval = formData.repeatInterval as 'monthly' | 'quarterly' | 'biannually' | 'yearly';
      }
    }

    // Add mileage-based fields only if checkbox is checked and has values
    if (formData.isMileageBased && formData.dueMileage) {
      reminderData.dueMileage = parseFloat(formData.dueMileage);

      if (formData.mileageInterval) {
        reminderData.mileageInterval = parseFloat(formData.mileageInterval);
      }
    }

    try {
      if (editingId) {
        await onUpdateReminder(editingId, reminderData);
      } else {
        await onAddReminder(reminderData);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving reminder:', error);
      alert(t.failedSaveReminder);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      vehicleId: activeVehicle?.id || '',
      dueDate: '',
      dueMileage: '',
      repeatInterval: '',
      mileageInterval: '',
      isTimeBased: true,
      isMileageBased: false
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (reminder: Reminder) => {
    setFormData({
      title: reminder.title,
      description: reminder.description || '',
      vehicleId: reminder.vehicleId,
      dueDate: reminder.dueDate || '',
      dueMileage: reminder.dueMileage?.toString() || '',
      repeatInterval: reminder.repeatInterval || '',
      mileageInterval: reminder.mileageInterval?.toString() || '',
      isTimeBased: !!reminder.dueDate,
      isMileageBased: !!reminder.dueMileage
    });
    setEditingId(reminder.id);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const getDueStatus = (reminder: Reminder, vehicle: Vehicle | undefined): 'due' | 'upcoming' => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check date-based
    if (reminder.dueDate) {
      const dueDate = new Date(reminder.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      if (dueDate <= today) return 'due';
    }

    // Check mileage-based
    if (reminder.dueMileage && vehicle?.currentOdometer) {
      if (vehicle.currentOdometer >= reminder.dueMileage) return 'due';
    }

    return 'upcoming';
  };

  const activeReminders = reminders.filter(r => !r.dismissed && r.isActive);

  return (
    <div className="mb-8">
      {/* Header - Mobile optimized */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-700 dark:text-slate-300">{t.serviceReminders}</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-violet-500 hover:bg-violet-400 active:bg-violet-600 text-white font-bold py-2.5 sm:py-2 px-4 rounded-lg shadow-md transition-colors text-sm w-full sm:w-auto"
          >
            + {t.addReminder}
          </button>
        )}
      </div>

      {/* Form - Mobile optimized */}
      {showForm && (
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-2xl mb-6">
          <h3 className="text-lg font-bold mb-4 text-violet-400">
            {editingId ? t.editReminder : t.newReminder}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.reminderTitle} *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Oil Change"
                className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md p-2.5 sm:p-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-violet-500 text-base sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.vehicleLabel} *</label>
              <select
                value={formData.vehicleId}
                onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md p-2.5 sm:p-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-violet-500 text-base sm:text-sm"
              >
                <option value="">{t.selectVehicle}</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.description}</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md p-2.5 sm:p-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-violet-500 text-base sm:text-sm"
              />
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <label className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  checked={formData.isTimeBased}
                  onChange={(e) => setFormData({ ...formData, isTimeBased: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">{t.timeBasedReminder}</span>
              </label>

              {formData.isTimeBased && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                  <div>
                    <label className="block text-sm text-slate-500 dark:text-slate-400 mb-1">{t.dueDate}</label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md p-2.5 sm:p-2 text-slate-900 dark:text-slate-100 text-base sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-500 dark:text-slate-400 mb-1">{t.repeatLabel}</label>
                    <select
                      value={formData.repeatInterval}
                      onChange={(e) => setFormData({ ...formData, repeatInterval: e.target.value as any })}
                      className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md p-2.5 sm:p-2 text-slate-900 dark:text-slate-100 text-base sm:text-sm"
                    >
                      <option value="">{t.noRepeat}</option>
                      <option value="monthly">{t.monthlyOption}</option>
                      <option value="quarterly">{t.quarterlyOption}</option>
                      <option value="biannually">{t.biannuallyOption}</option>
                      <option value="yearly">{t.yearlyOption}</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <label className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  checked={formData.isMileageBased}
                  onChange={(e) => setFormData({ ...formData, isMileageBased: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">{t.mileageBasedReminder}</span>
              </label>

              {formData.isMileageBased && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                  <div>
                    <label className="block text-sm text-slate-500 dark:text-slate-400 mb-1">{t.dueAtKm}</label>
                    <input
                      type="number"
                      value={formData.dueMileage}
                      onChange={(e) => setFormData({ ...formData, dueMileage: e.target.value })}
                      placeholder="10000"
                      className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md p-2.5 sm:p-2 text-slate-900 dark:text-slate-100 text-base sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-500 dark:text-slate-400 mb-1">{t.repeatEveryKm}</label>
                    <input
                      type="number"
                      value={formData.mileageInterval}
                      onChange={(e) => setFormData({ ...formData, mileageInterval: e.target.value })}
                      placeholder="5000"
                      className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md p-2.5 sm:p-2 text-slate-900 dark:text-slate-100 text-base sm:text-sm"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Mobile-optimized form buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-2">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="py-2.5 sm:py-2 px-4 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 active:bg-slate-200 dark:active:bg-slate-600 transition-colors order-2 sm:order-1 w-full sm:w-auto"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="bg-violet-500 hover:bg-violet-400 active:bg-violet-600 text-white font-bold py-2.5 sm:py-2 px-4 rounded-md transition-colors order-1 sm:order-2 w-full sm:w-auto"
              >
                {editingId ? t.updateRecord : t.addReminder}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reminder List - Mobile optimized */}
      <div className="space-y-3">
        {activeReminders.length === 0 ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-lg">
            <p>{t.noActiveRemindersMsg}</p>
          </div>
        ) : (
          activeReminders.map(reminder => {
            const vehicle = vehicles.find(v => v.id === reminder.vehicleId);
            const status = getDueStatus(reminder, vehicle);

            return (
              <div
                key={reminder.id}
                className={`bg-white dark:bg-slate-800 rounded-lg p-4 sm:p-5 border-l-4 ${
                  status === 'due' ? 'border-red-500' : 'border-yellow-500'
                }`}
              >
                {/* Mobile-first layout - stacks vertically on mobile, horizontal on larger screens */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <BellIcon className={`w-5 h-5 ${status === 'due' ? 'text-red-400' : 'text-yellow-400'}`} />
                      <h3 className="font-bold text-slate-800 dark:text-slate-100">{reminder.title}</h3>
                      {status === 'due' && (
                        <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full font-bold">
                          {t.dueNow}
                        </span>
                      )}
                    </div>
                    {reminder.description && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{reminder.description}</p>
                    )}
                    <div className="text-sm text-slate-500 dark:text-slate-400 space-y-1">
                      {reminder.dueDate && (
                        <p>{t.dueLabel}: {new Date(reminder.dueDate).toLocaleDateString()}</p>
                      )}
                      {reminder.dueMileage && (
                        <p>{t.dueAtLabel}: {reminder.dueMileage.toLocaleString()} km</p>
                      )}
                      {vehicle && (
                        <p className="text-xs text-slate-400 dark:text-slate-500">{t.vehicleLabel}: {vehicle.name}</p>
                      )}
                    </div>
                  </div>

                  {/* Mobile-optimized buttons - stack vertically on mobile, horizontal on tablet+ */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleEdit(reminder)}
                      className="text-sm sm:text-xs bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 active:bg-blue-300 dark:active:bg-blue-700 text-blue-700 dark:text-blue-300 px-4 py-2.5 sm:px-3 sm:py-2 rounded-md sm:rounded font-medium transition-colors w-full sm:w-auto touch-manipulation"
                    >
                      {t.edit}
                    </button>
                    <button
                      onClick={() => onDismissReminder(reminder.id)}
                      className="text-sm sm:text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 active:bg-slate-300 dark:active:bg-slate-500 text-slate-700 dark:text-slate-300 px-4 py-2.5 sm:px-3 sm:py-2 rounded-md sm:rounded font-medium transition-colors w-full sm:w-auto touch-manipulation"
                    >
                      {t.dismiss}
                    </button>
                    <button
                      onClick={() => onDeleteReminder(reminder.id)}
                      className="text-sm sm:text-xs bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 active:bg-red-300 dark:active:bg-red-700 text-red-700 dark:text-red-300 px-4 py-2.5 sm:px-3 sm:py-2 rounded-md sm:rounded font-medium transition-colors w-full sm:w-auto touch-manipulation"
                    >
                      {t.delete}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ReminderManager;
