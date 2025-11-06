import React, { useState } from 'react';
import { Vehicle, MaintenanceRecord } from '../types';

interface VehicleManagerProps {
  vehicles: Vehicle[];
  activeVehicle: Vehicle | null;
  onAddVehicle: (vehicle: Omit<Vehicle, 'id' | 'createdAt'>) => Promise<void>;
  onUpdateVehicle: (id: string, updates: Partial<Vehicle>) => Promise<void>;
  onDeleteVehicle: (id: string) => Promise<void>;
  onSetActive: (id: string) => Promise<void>;
  userId: string;
  records?: MaintenanceRecord[];
}

const MotorcycleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.586 4H5.414A2.914 2.914 0 002.5 6.914v1.072A8.004 8.004 0 004 12.5v4.619a1 1 0 001.32.949l3.41-1.364A1 1 0 019 17.76V16h6v1.76a1 1 0 01-.27.648l-3.41 1.364a1 1 0 00-1.32.95V22h2a1 1 0 001-1v-1.115a8.04 8.04 0 003-3.033V15a1 1 0 00-1-1h-1v-1.5a8.004 8.004 0 001.5-4.514V6.914A2.914 2.914 0 0018.586 4zM8 12c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm8 0c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2z"/>
  </svg>
);

const VehicleManager: React.FC<VehicleManagerProps> = ({
  vehicles,
  activeVehicle,
  onAddVehicle,
  onUpdateVehicle,
  onDeleteVehicle,
  onSetActive,
  userId,
  records = []
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    year: '',
    model: '',
    currentOdometer: '',
    purchaseDate: '',
    purchaseOdometer: ''
  });
  const [error, setError] = useState('');

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      year: '',
      model: '',
      currentOdometer: '',
      purchaseDate: '',
      purchaseOdometer: ''
    });
    setEditingId(null);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.type || !formData.currentOdometer) {
      setError('Name, type, and current odometer are required.');
      return;
    }

    const odometerValue = parseInt(formData.currentOdometer);
    if (isNaN(odometerValue) || odometerValue < 0) {
      setError('Current odometer must be a valid positive number.');
      return;
    }

    try {
      const vehicleData: any = {
        userId,
        name: formData.name.trim(),
        type: formData.type.trim(),
        currentOdometer: odometerValue,
        isActive: vehicles.length === 0
      };

      // Add optional fields only if they have values
      if (formData.year) {
        const yearValue = parseInt(formData.year);
        if (!isNaN(yearValue)) {
          vehicleData.year = yearValue;
        }
      }

      if (formData.model && formData.model.trim()) {
        vehicleData.model = formData.model.trim();
      }

      if (formData.purchaseDate) {
        vehicleData.purchaseDate = formData.purchaseDate;
      }

      if (formData.purchaseOdometer) {
        const purchaseOdometerValue = parseInt(formData.purchaseOdometer);
        if (!isNaN(purchaseOdometerValue)) {
          vehicleData.purchaseOdometer = purchaseOdometerValue;
        }
      }

      if (editingId) {
        await onUpdateVehicle(editingId, vehicleData);
      } else {
        await onAddVehicle(vehicleData);
      }

      resetForm();
      setShowForm(false);
    } catch (err: any) {
      console.error('Error saving vehicle:', err);
      setError(err.message || 'Failed to save vehicle. Please try again.');
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setFormData({
      name: vehicle.name,
      type: vehicle.type,
      year: vehicle.year?.toString() || '',
      model: vehicle.model || '',
      currentOdometer: vehicle.currentOdometer.toString(),
      purchaseDate: vehicle.purchaseDate || '',
      purchaseOdometer: vehicle.purchaseOdometer?.toString() || ''
    });
    setEditingId(vehicle.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    // Prevent deleting if it's the last vehicle and there are maintenance records
    const vehicleRecords = records?.filter(r => r.vehicleId === id) || [];
    
    const confirmMessage = vehicleRecords.length > 0
      ? `Are you sure you want to delete this vehicle? This will also delete ${vehicleRecords.length} maintenance record(s).`
      : 'Are you sure you want to delete this vehicle?';
    
    if (window.confirm(confirmMessage)) {
      try {
        await onDeleteVehicle(id);
      } catch (err: any) {
        console.error('Delete error:', err);
        alert(err.message || 'Failed to delete vehicle. Please try again.');
      }
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-300">My Vehicles</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-2 px-4 rounded-lg shadow-md transition-colors text-sm"
          >
            + Add Vehicle
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-slate-800 p-4 sm:p-6 rounded-lg shadow-2xl mb-6">
          <h3 className="text-lg font-bold mb-4 text-cyan-400">
            {editingId ? 'Edit Vehicle' : 'Add New Vehicle'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., My Harley"
                  className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-slate-300 mb-1">
                  Type *
                </label>
                <input
                  type="text"
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  placeholder="e.g., Harley-Davidson Sportster"
                  className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-slate-300 mb-1">
                  Year
                </label>
                <input
                  type="number"
                  id="year"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="2023"
                  className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
              <div>
                <label htmlFor="model" className="block text-sm font-medium text-slate-300 mb-1">
                  Model
                </label>
                <input
                  type="text"
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="Nightster"
                  className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
              <div>
                <label htmlFor="currentOdometer" className="block text-sm font-medium text-slate-300 mb-1">
                  Current Odometer (km) *
                </label>
                <input
                  type="number"
                  id="currentOdometer"
                  value={formData.currentOdometer}
                  onChange={(e) => setFormData({ ...formData, currentOdometer: e.target.value })}
                  placeholder="5000"
                  className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
              <div>
                <label htmlFor="purchaseOdometer" className="block text-sm font-medium text-slate-300 mb-1">
                  Purchase Odometer (km)
                </label>
                <input
                  type="number"
                  id="purchaseOdometer"
                  value={formData.purchaseOdometer}
                  onChange={(e) => setFormData({ ...formData, purchaseOdometer: e.target.value })}
                  placeholder="0"
                  className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
              <div>
                <label htmlFor="purchaseDate" className="block text-sm font-medium text-slate-300 mb-1">
                  Purchase Date
                </label>
                <input
                  type="date"
                  id="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <div className="flex justify-end gap-4 pt-2">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                className="py-2 px-4 rounded-md text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-2 px-4 rounded-md shadow-md transition-colors"
              >
                {editingId ? 'Update Vehicle' : 'Add Vehicle'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className={`bg-slate-800 rounded-lg p-4 cursor-pointer transition-all ${
              vehicle.isActive
                ? 'ring-2 ring-cyan-500 shadow-lg shadow-cyan-500/20'
                : 'hover:bg-slate-700'
            }`}
            onClick={() => onSetActive(vehicle.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <MotorcycleIcon className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-100">{vehicle.name}</h3>
                  <p className="text-sm text-slate-400">{vehicle.type}</p>
                  {vehicle.year && vehicle.model && (
                    <p className="text-xs text-slate-500">
                      {vehicle.year} {vehicle.model}
                    </p>
                  )}
                </div>
              </div>
              {vehicle.isActive && (
                <span className="text-xs bg-cyan-500 text-slate-900 px-2 py-1 rounded-full font-bold">
                  Active
                </span>
              )}
            </div>
            <div className="mt-3 text-sm text-slate-300">
              <p>Odometer: {vehicle.currentOdometer.toLocaleString()} km</p>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(vehicle);
                }}
                className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1 rounded transition-colors"
              >
                Edit
              </button>
              {vehicles.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(vehicle.id);
                  }}
                  className="text-xs bg-red-900 hover:bg-red-800 text-red-300 px-3 py-1 rounded transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {vehicles.length === 0 && !showForm && (
        <div className="text-center py-8 text-slate-400">
          <p>No vehicles yet. Add your first motorcycle to get started!</p>
        </div>
      )}
    </div>
  );
};

export default VehicleManager;