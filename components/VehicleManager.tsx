import React, { useState, useRef } from 'react';
import { Vehicle, MaintenanceRecord } from '../types';
import { useApp } from '../context/AppContext';

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
    <path d="M18.586 4H5.414A2.914 2.914 0 002.5 6.914v1.072A8.004 8.004 0 004 12.5v4.619a1 1 0 001.32.949l3.41-1.364A1 1 0 009 17.76V16h6v1.76a1 1 0 01-.27.648l-3.41 1.364a1 1 0 00-1.32.95V22h2a1 1 0 001-1v-1.115a8.04 8.04 0 003-3.033V15a1 1 0 00-1-1h-1v-1.5a8.004 8.004 0 001.5-4.514V6.914A2.914 2.914 0 0018.586 4zM8 12c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm8 0c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2z"/>
  </svg>
);

// Motorcycle emoji options
const MOTORCYCLE_EMOJIS = ['🏍️', '🛵', '🏁', '⚙️', '🔧', '🛠️', '⚡', '🔥', '💨', '🌟', '⭐', '🎯'];

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
  const { t } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    year: '',
    model: '',
    currentOdometer: '',
    purchaseDate: '',
    purchaseOdometer: '',
    registrationNumber: '',
    tyrePressureFront: '',
    tyrePressureRear: '',
    roadTaxExpiry: '',
    customIcon: '🏍️',
    iconType: 'emoji' as 'emoji' | 'image'
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [iconImage, setIconImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      year: '',
      model: '',
      currentOdometer: '',
      purchaseDate: '',
      purchaseOdometer: '',
      registrationNumber: '',
      tyrePressureFront: '',
      tyrePressureRear: '',
      roadTaxExpiry: '',
      customIcon: '🏍️',
      iconType: 'emoji'
    });
    setEditingId(null);
    setError('');
    setIconImage(null);
    setShowEmojiPicker(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError(t.photoSizeLimit);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setIconImage(base64String);
        setFormData({ ...formData, customIcon: base64String, iconType: 'image' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.type || !formData.currentOdometer) {
      setError(t.nameTypeOdometerRequired);
      return;
    }

    const odometerValue = parseInt(formData.currentOdometer);
    if (isNaN(odometerValue) || odometerValue < 0) {
      setError(t.odometerMustBeValid);
      return;
    }

    // Validate tyre pressures if provided
    if (formData.tyrePressureFront) {
      const frontPressure = parseFloat(formData.tyrePressureFront);
      if (isNaN(frontPressure) || frontPressure < 0 || frontPressure > 100) {
        setError(t.tyrePressureFrontInvalid);
        return;
      }
    }

    if (formData.tyrePressureRear) {
      const rearPressure = parseFloat(formData.tyrePressureRear);
      if (isNaN(rearPressure) || rearPressure < 0 || rearPressure > 100) {
        setError(t.tyrePressureRearInvalid);
        return;
      }
    }

    try {
      const vehicleData: any = {
        userId,
        name: formData.name.trim(),
        type: formData.type.trim(),
        currentOdometer: odometerValue,
        isActive: vehicles.length === 0,
        customIcon: formData.customIcon || '🏍️',
        iconType: formData.iconType
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

      if (formData.registrationNumber && formData.registrationNumber.trim()) {
        vehicleData.registrationNumber = formData.registrationNumber.trim().toUpperCase();
      }

      if (formData.tyrePressureFront) {
        const frontPressure = parseFloat(formData.tyrePressureFront);
        if (!isNaN(frontPressure)) {
          vehicleData.tyrePressureFront = frontPressure;
        }
      }

      if (formData.tyrePressureRear) {
        const rearPressure = parseFloat(formData.tyrePressureRear);
        if (!isNaN(rearPressure)) {
          vehicleData.tyrePressureRear = rearPressure;
        }
      }

      if (formData.roadTaxExpiry) {
        vehicleData.roadTaxExpiry = formData.roadTaxExpiry;
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
      setError(err.message || t.failedSaveVehicle);
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
      purchaseOdometer: vehicle.purchaseOdometer?.toString() || '',
      registrationNumber: vehicle.registrationNumber || '',
      tyrePressureFront: vehicle.tyrePressureFront?.toString() || '',
      tyrePressureRear: vehicle.tyrePressureRear?.toString() || '',
      roadTaxExpiry: vehicle.roadTaxExpiry || '',
      customIcon: vehicle.customIcon || '🏍️',
      iconType: vehicle.iconType || 'emoji'
    });
    if (vehicle.iconType === 'image' && vehicle.customIcon) {
      setIconImage(vehicle.customIcon);
    }
    setEditingId(vehicle.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t.confirmDeleteVehicle)) {
      try {
        await onDeleteVehicle(id);
      } catch (err: any) {
        console.error('Delete error:', err);
        alert(err.message || t.failedDeleteVehicle);
      }
    }
  };

  const isRoadTaxExpiringSoon = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  };

  const isRoadTaxExpired = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    return expiry < today;
  };

  const renderVehicleIcon = (vehicle: Vehicle) => {
    if (vehicle.iconType === 'image' && vehicle.customIcon) {
      return (
        <img
          src={vehicle.customIcon}
          alt={vehicle.name}
          className="w-6 h-6 rounded object-cover flex-shrink-0"
        />
      );
    } else if (vehicle.customIcon) {
      return (
        <span className="text-2xl flex-shrink-0">{vehicle.customIcon}</span>
      );
    }
    return <MotorcycleIcon className="w-6 h-6 text-cyan-500 dark:text-cyan-400 flex-shrink-0" />;
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-700 dark:text-slate-300">{t.myVehicles}</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-2 px-4 rounded-lg shadow-md transition-colors text-sm"
          >
            + {t.addVehicle}
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-2xl mb-6">
          <h3 className="text-lg font-bold mb-4 text-cyan-600 dark:text-cyan-400">
            {editingId ? t.editVehicle : t.addNewVehicle}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Custom Icon Section */}
            <div className="bg-slate-100/50 dark:bg-slate-700/50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                {t.vehicleIcon}
              </label>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center border-2 border-slate-300 dark:border-slate-600">
                    {formData.iconType === 'image' && iconImage ? (
                      <img src={iconImage} alt={t.vehicleIcon} className="w-14 h-14 rounded object-cover" />
                    ) : (
                      <span className="text-4xl">{formData.customIcon}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded text-sm transition-colors"
                    >
                      {formData.iconType === 'emoji' ? `✏️ ${t.changeEmoji}` : `😀 ${t.useEmoji}`}
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded text-sm transition-colors"
                    >
                      📸 {t.uploadImage}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {showEmojiPicker && (
                <div className="mt-3 grid grid-cols-6 sm:grid-cols-8 gap-2">
                  {MOTORCYCLE_EMOJIS.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, customIcon: emoji, iconType: 'emoji' });
                        setIconImage(null);
                        setShowEmojiPicker(false);
                      }}
                      className="w-12 h-12 text-2xl hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors flex items-center justify-center"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Basic Information */}
            <div>
              <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wide">{t.basicInfo}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t.vehicleName} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., My Harley"
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t.vehicleModel} *
                  </label>
                  <input
                    type="text"
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    placeholder="e.g., Harley-Davidson Sportster"
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t.year}
                  </label>
                  <input
                    type="number"
                    id="year"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="2023"
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label htmlFor="model" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t.vehicleModel}
                  </label>
                  <input
                    type="text"
                    id="model"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="Nightster"
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label htmlFor="registrationNumber" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t.registrationNumber}
                  </label>
                  <input
                    type="text"
                    id="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                    placeholder="e.g., ABC1234"
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 uppercase"
                  />
                </div>
              </div>
            </div>

            {/* Odometer Information */}
            <div>
              <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wide">{t.odometerInfo}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="currentOdometer" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t.currentOdometerKm} *
                  </label>
                  <input
                    type="number"
                    id="currentOdometer"
                    value={formData.currentOdometer}
                    onChange={(e) => setFormData({ ...formData, currentOdometer: e.target.value })}
                    placeholder="5000"
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label htmlFor="purchaseOdometer" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t.purchaseOdometerKm}
                  </label>
                  <input
                    type="number"
                    id="purchaseOdometer"
                    value={formData.purchaseOdometer}
                    onChange={(e) => setFormData({ ...formData, purchaseOdometer: e.target.value })}
                    placeholder="0"
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label htmlFor="purchaseDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t.purchaseDate}
                  </label>
                  <input
                    type="date"
                    id="purchaseDate"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Tyre & Road Tax Information */}
            <div>
              <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wide">{t.tyreAndRoadTax}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="tyrePressureFront" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t.frontTyrePressure}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    id="tyrePressureFront"
                    value={formData.tyrePressureFront}
                    onChange={(e) => setFormData({ ...formData, tyrePressureFront: e.target.value })}
                    placeholder="32"
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label htmlFor="tyrePressureRear" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t.rearTyrePressure}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    id="tyrePressureRear"
                    value={formData.tyrePressureRear}
                    onChange={(e) => setFormData({ ...formData, tyrePressureRear: e.target.value })}
                    placeholder="36"
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label htmlFor="roadTaxExpiry" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t.roadTaxExpiry}
                  </label>
                  <input
                    type="date"
                    id="roadTaxExpiry"
                    value={formData.roadTaxExpiry}
                    onChange={(e) => setFormData({ ...formData, roadTaxExpiry: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}

            <div className="flex justify-end gap-4 pt-2">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                className="py-2 px-4 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-2 px-4 rounded-md shadow-md transition-colors"
              >
                {editingId ? t.updateRecord : t.addVehicle}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className={`bg-white dark:bg-slate-800 rounded-lg p-4 cursor-pointer transition-all ${
              vehicle.isActive
                ? 'ring-2 ring-cyan-500 shadow-lg shadow-cyan-500/20'
                : 'hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
            onClick={() => onSetActive(vehicle.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {renderVehicleIcon(vehicle)}
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100">{vehicle.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{vehicle.type}</p>
                  {vehicle.year && vehicle.model && (
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {vehicle.year} {vehicle.model}
                    </p>
                  )}
                </div>
              </div>
              {vehicle.isActive && (
                <span className="text-xs bg-cyan-500 text-slate-900 px-2 py-1 rounded-full font-bold">
                  {t.active}
                </span>
              )}
            </div>

            {/* Vehicle Details */}
            <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300 border-t border-slate-200 dark:border-slate-700 pt-3">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">{t.odometer}:</span>
                <span className="font-semibold">{vehicle.currentOdometer.toLocaleString()} km</span>
              </div>

              {vehicle.registrationNumber && (
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">{t.registration}:</span>
                  <span className="font-mono font-semibold">{vehicle.registrationNumber}</span>
                </div>
              )}

              {(vehicle.tyrePressureFront || vehicle.tyrePressureRear) && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">{t.tyrePressureLabel}:</span>
                  <span className="text-xs">
                    {vehicle.tyrePressureFront && <span>{t.front}: {vehicle.tyrePressureFront} PSI</span>}
                    {vehicle.tyrePressureFront && vehicle.tyrePressureRear && <span className="mx-1">|</span>}
                    {vehicle.tyrePressureRear && <span>{t.rear}: {vehicle.tyrePressureRear} PSI</span>}
                  </span>
                </div>
              )}

              {vehicle.roadTaxExpiry && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">{t.roadTax}:</span>
                  <span className={`text-xs font-semibold ${
                    isRoadTaxExpired(vehicle.roadTaxExpiry)
                      ? 'text-red-500 dark:text-red-400'
                      : isRoadTaxExpiringSoon(vehicle.roadTaxExpiry)
                      ? 'text-yellow-500 dark:text-yellow-400'
                      : 'text-green-500 dark:text-green-400'
                  }`}>
                    {isRoadTaxExpired(vehicle.roadTaxExpiry) && `⚠️ ${t.expired} `}
                    {isRoadTaxExpiringSoon(vehicle.roadTaxExpiry) && !isRoadTaxExpired(vehicle.roadTaxExpiry) && '⚠️ '}
                    {new Date(vehicle.roadTaxExpiry).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-3 flex gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(vehicle);
                }}
                className="text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 px-3 py-1 rounded transition-colors"
              >
                {t.edit}
              </button>
              {vehicles.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(vehicle.id);
                  }}
                  className="text-xs bg-red-50 dark:bg-red-900 hover:bg-red-100 dark:hover:bg-red-800 text-red-600 dark:text-red-300 px-3 py-1 rounded transition-colors"
                >
                  {t.delete}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {vehicles.length === 0 && !showForm && (
        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
          <p>{t.noVehiclesMsg}</p>
        </div>
      )}
    </div>
  );
};

export default VehicleManager;
