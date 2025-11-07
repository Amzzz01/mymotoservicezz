import React, { useState } from 'react';
import { Reminder, Vehicle } from '../types';

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
      alert('Title and vehicle are required');
      return;
    }

    // Validate that at least one reminder type is set
    const hasTimeReminder = formData.isTimeBased && formData.dueDate;
    const hasMileageReminder = formData.isMileageBased && formData.dueMileage;
    
    if (!hasTimeReminder && !hasMileageReminder) {
      alert('Please set at least one reminder: date or mileage');
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
      reminderData.dueMileage = parseInt(formData.dueMileage);
      
      if (formData.mileageInterval) {
        reminderData.mileageInterval = parseInt(formData.mileageInterval);
      }
    }

    if (editingId) {
      // Update existing reminder
      await onUpdateReminder(editingId, reminderData);
      setEditingId(null);
    } else {
      // Add new reminder
      await onAddReminder(reminderData);
    }
    
    setShowForm(false);
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
  };

  const handleEdit = (reminder: Reminder) => {
    setEditingId(reminder.id);
    setFormData({
      title: reminder.title,
      description: reminder.description || '',
      vehicleId: reminder.vehicleId,
      dueDate: reminder.dueDate || '',
      dueMileage: reminder.dueMileage ? reminder.dueMileage.toString() : '',
      repeatInterval: (reminder.repeatInterval || '') as '' | 'monthly' | 'quarterly' | 'biannually' | 'yearly',
      mileageInterval: reminder.mileageInterval ? reminder.mileageInterval.toString() : '',
      isTimeBased: !!reminder.dueDate,
      isMileageBased: !!reminder.dueMileage
    });
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    setEditingId(null);
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
  };

  const getDueStatus = (reminder: Reminder, vehicle: Vehicle | null) => {
    if (!vehicle) return 'unknown';
    
    let isDue = false;
    
    if (reminder.dueDate) {
      const dueDate = new Date(reminder.dueDate);
      const today = new Date();
      if (dueDate <= today) isDue = true;
    }
    
    if (reminder.dueMileage && vehicle.currentOdometer >= reminder.dueMileage) {
      isDue = true;
    }
    
    return isDue ? 'due' : 'upcoming';
  };

  const activeReminders = reminders.filter(r => !r.dismissed && r.isActive);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-300">Service Reminders</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-violet-500 hover:bg-violet-400 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors text-sm"
          >
            + Add Reminder
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-slate-800 p-4 sm:p-6 rounded-lg shadow-2xl mb-6">
          <h3 className="text-lg font-bold mb-4 text-violet-400">
            {editingId ? 'Edit Reminder' : 'New Reminder'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Oil Change"
                className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-slate-100 focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Vehicle *</label>
              <select
                value={formData.vehicleId}
                onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-slate-100 focus:ring-2 focus:ring-violet-500"
              >
                <option value="">Select a vehicle</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-slate-100 focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div className="border-t border-slate-700 pt-4">
              <label className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  checked={formData.isTimeBased}
                  onChange={(e) => setFormData({ ...formData, isTimeBased: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-slate-300">Time-based reminder</span>
              </label>
              
              {formData.isTimeBased && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Due Date</label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Repeat</label>
                    <select
                      value={formData.repeatInterval}
                      onChange={(e) => setFormData({ ...formData, repeatInterval: e.target.value as any })}
                      className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-slate-100"
                    >
                      <option value="">No repeat</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="biannually">Every 6 months</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-slate-700 pt-4">
              <label className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  checked={formData.isMileageBased}
                  onChange={(e) => setFormData({ ...formData, isMileageBased: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-slate-300">Mileage-based reminder</span>
              </label>
              
              {formData.isMileageBased && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Due at (km)</label>
                    <input
                      type="number"
                      value={formData.dueMileage}
                      onChange={(e) => setFormData({ ...formData, dueMileage: e.target.value })}
                      placeholder="10000"
                      className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Repeat every (km)</label>
                    <input
                      type="number"
                      value={formData.mileageInterval}
                      onChange={(e) => setFormData({ ...formData, mileageInterval: e.target.value })}
                      placeholder="5000"
                      className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-slate-100"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4 pt-2">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="py-2 px-4 rounded-md text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-violet-500 hover:bg-violet-400 text-white font-bold py-2 px-4 rounded-md"
              >
                {editingId ? 'Update Reminder' : 'Add Reminder'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {activeReminders.length === 0 ? (
          <div className="text-center py-8 text-slate-400 bg-slate-800 rounded-lg">
            <p>No active reminders. Add one to stay on top of maintenance!</p>
          </div>
        ) : (
          activeReminders.map(reminder => {
            const vehicle = vehicles.find(v => v.id === reminder.vehicleId);
            const status = getDueStatus(reminder, vehicle);
            
            return (
              <div
                key={reminder.id}
                className={`bg-slate-800 rounded-lg p-4 border-l-4 ${
                  status === 'due' ? 'border-red-500' : 'border-yellow-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <BellIcon className={`w-5 h-5 ${status === 'due' ? 'text-red-400' : 'text-yellow-400'}`} />
                      <h3 className="font-bold text-slate-100">{reminder.title}</h3>
                      {status === 'due' && (
                        <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full font-bold">
                          DUE NOW
                        </span>
                      )}
                    </div>
                    {reminder.description && (
                      <p className="text-sm text-slate-400 mb-2">{reminder.description}</p>
                    )}
                    <div className="text-sm text-slate-400 space-y-1">
                      {reminder.dueDate && (
                        <p>📅 Due: {new Date(reminder.dueDate).toLocaleDateString()}</p>
                      )}
                      {reminder.dueMileage && (
                        <p>📊 Due at: {reminder.dueMileage.toLocaleString()} km</p>
                      )}
                      {vehicle && (
                        <p className="text-xs text-slate-500">Vehicle: {vehicle.name}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(reminder)}
                      className="text-xs bg-blue-900 hover:bg-blue-800 text-blue-300 px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDismissReminder(reminder.id)}
                      className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1 rounded"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => onDeleteReminder(reminder.id)}
                      className="text-xs bg-red-900 hover:bg-red-800 text-red-300 px-3 py-1 rounded"
                    >
                      Delete
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