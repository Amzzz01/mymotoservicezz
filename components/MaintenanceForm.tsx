import React, { useState, useEffect } from 'react';
import { MaintenanceRecord, Vehicle, ParsedReceiptData } from '../types';
import ReceiptScanner from './ReceiptScanner';

interface MaintenanceFormProps {
  onAddRecord: (record: Omit<MaintenanceRecord, 'id'>) => void;
  onUpdateRecord: (id: string, record: Omit<MaintenanceRecord, 'id'>) => void;
  vehicles: Vehicle[];
  activeVehicle: Vehicle | null;
  editingRecord?: MaintenanceRecord | null;
  onCancelEdit?: () => void;
}

const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
  </svg>
);

const PhotoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M1 5.25A2.25 2.25 0 013.25 3h13.5A2.25 2.25 0 0119 5.25v9.5A2.25 2.25 0 0116.75 17H3.25A2.25 2.25 0 011 14.75v-9.5zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 00.75-.75v-2.69l-2.22-2.219a.75.75 0 00-1.06 0l-1.91 1.909.47.47a.75.75 0 11-1.06 1.06L6.53 8.091a.75.75 0 00-1.06 0l-2.97 2.97zM12 7a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
  </svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
  </svg>
);

const CameraIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M1 8a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 018.07 3h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0016.07 6H17a2 2 0 012 2v7a2 2 0 01-2 2H3a2 2 0 01-2-2V8zm13.5 3a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM10 14a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
  </svg>
);

const EditIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
  </svg>
);

const MaintenanceForm: React.FC<MaintenanceFormProps> = ({ 
  onAddRecord, 
  onUpdateRecord,
  vehicles, 
  activeVehicle, 
  editingRecord = null,
  onCancelEdit
}) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [kilometers, setKilometers] = useState('');
  const [partsCost, setPartsCost] = useState('');
  const [laborCost, setLaborCost] = useState('');
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [showReceiptScanner, setShowReceiptScanner] = useState(false);
  const [showChoiceScreen, setShowChoiceScreen] = useState(false); // New state for choice screen

  // Load editing record data when editingRecord changes
  useEffect(() => {
    if (editingRecord) {
      setDate(editingRecord.date);
      setDescription(editingRecord.description);
      setKilometers(editingRecord.kilometers.toString());
      setPartsCost(editingRecord.partsCost ? editingRecord.partsCost.toString() : '');
      setLaborCost(editingRecord.laborCost ? editingRecord.laborCost.toString() : '');
      setNotes(editingRecord.notes || '');
      setPhotos(editingRecord.photos || []);
      setIsFormVisible(true);
      setShowReceiptScanner(false);
      setShowChoiceScreen(false); // Close choice screen when editing
      setError('');
    }
  }, [editingRecord]);

  const handleReceiptScanned = (data: ParsedReceiptData, imageFile: File) => {
    // Pre-fill form with scanned data
    setDate(data.date);
    setDescription(data.serviceDescription);
    setPartsCost(data.partsCost.toString());
    setLaborCost(data.laborCost.toString());
    
    // Add notes if available
    if (data.notes) {
      setNotes(notes ? `${notes}\n\n${data.notes}` : data.notes);
    }
    
    // Convert image to base64 and add to photos
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPhotos([...photos, base64String]);
    };
    reader.readAsDataURL(imageFile);
    
    // Close scanner, show form
    setShowReceiptScanner(false);
    setIsFormVisible(true);
    
    // Clear any errors
    setError('');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Limit to 5 photos
    if (photos.length + files.length > 5) {
      setError('Maximum 5 photos allowed');
      return;
    }

    Array.from(files).forEach((file: File) => {
      // Check file size (max 2MB per photo)
      if (file.size > 2 * 1024 * 1024) {
        setError('Each photo must be less than 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setShowReceiptScanner(false);
    setShowChoiceScreen(false); // Also close choice screen
    setError('');
    setPhotos([]);
    
    // Reset form if editing
    if (editingRecord && onCancelEdit) {
      onCancelEdit();
      setDescription('');
      setKilometers('');
      setPartsCost('');
      setLaborCost('');
      setNotes('');
      setPhotos([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!activeVehicle) {
      setError('Please select or add a vehicle first.');
      return;
    }

    if (!date || !description || !kilometers) {
      setError('Date, description, and kilometers are required.');
      return;
    }

    const kmNumber = parseInt(kilometers, 10);
    if (isNaN(kmNumber) || kmNumber < 0) {
      setError('Kilometers must be a positive number.');
      return;
    }

    // Validate costs if provided
    if (partsCost && (isNaN(parseFloat(partsCost)) || parseFloat(partsCost) < 0)) {
      setError('Parts cost must be a valid positive number.');
      return;
    }

    if (laborCost && (isNaN(parseFloat(laborCost)) || parseFloat(laborCost) < 0)) {
      setError('Labor cost must be a valid positive number.');
      return;
    }

    const recordData = {
      date,
      description,
      kilometers: kmNumber,
      motorcycleName: activeVehicle.name,
      motorcycleType: activeVehicle.type,
      vehicleId: activeVehicle.id,
      partsCost: partsCost ? parseFloat(partsCost) : undefined,
      laborCost: laborCost ? parseFloat(laborCost) : undefined,
      notes: notes || undefined,
      photos: photos.length > 0 ? photos : undefined
    };

    if (editingRecord) {
      // Update existing record
      onUpdateRecord(editingRecord.id, recordData);
      if (onCancelEdit) onCancelEdit();
    } else {
      // Add new record
      onAddRecord(recordData);
    }

    // Reset form
    setDescription('');
    setKilometers('');
    setPartsCost('');
    setLaborCost('');
    setNotes('');
    setPhotos([]);
    setError('');
    setIsFormVisible(false);
  };

  if (!activeVehicle) {
    return (
      <div className="mb-8 text-center py-8 bg-slate-800 rounded-lg">
        <p className="text-slate-400">Please add a vehicle first to start tracking maintenance.</p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      {/* Single "Add Maintenance Record" Button - Shows First */}
      {!isFormVisible && !showReceiptScanner && !showChoiceScreen ? (
        <div className="text-center">
          <button
            onClick={() => setShowChoiceScreen(true)}
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-lg shadow-lg shadow-cyan-500/20 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
          >
            <PlusIcon className="w-5 h-5" />
            Add New Maintenance Record
          </button>
        </div>
      ) : null}

      {/* Choice Screen Modal - Scan or Manual Entry */}
      {showChoiceScreen && !isFormVisible && !showReceiptScanner ? (
        <>
          {/* Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-fade-in"
            onClick={() => setShowChoiceScreen(false)}
          />
          
          {/* Modal Content */}
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-slate-800 w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl animate-slide-up sm:animate-fade-in overflow-hidden">
              {/* Modal Header */}
              <div className="bg-slate-700 px-6 py-4 border-b border-slate-600">
                <h3 className="text-lg font-bold text-cyan-400">Add Maintenance Record</h3>
                <p className="text-sm text-slate-400 mt-1">Choose your preferred method</p>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                {/* Scan Receipt Option */}
                <button
                  onClick={() => {
                    setShowChoiceScreen(false);
                    setShowReceiptScanner(true);
                  }}
                  className="w-full flex items-center gap-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold p-5 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                    <CameraIcon className="w-8 h-8" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="text-lg font-bold">Scan Receipt</div>
                    <div className="text-sm opacity-90">Auto-fill from photo</div>
                  </div>
                  <svg className="w-6 h-6 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Manual Entry Option */}
                <button
                  onClick={() => {
                    setShowChoiceScreen(false);
                    setIsFormVisible(true);
                  }}
                  className="w-full flex items-center gap-4 bg-slate-700 hover:bg-slate-600 text-white font-bold p-5 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="bg-slate-600 p-3 rounded-lg">
                    <EditIcon className="w-8 h-8" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="text-lg font-bold">Manual Entry</div>
                    <div className="text-sm opacity-90">Type details yourself</div>
                  </div>
                  <svg className="w-6 h-6 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-slate-700 border-t border-slate-600">
                <button
                  onClick={() => setShowChoiceScreen(false)}
                  className="w-full py-3 text-slate-300 hover:text-white font-medium transition-colors rounded-lg hover:bg-slate-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      ) : null}

      {/* Receipt Scanner Component */}
      {showReceiptScanner && (
        <ReceiptScanner
          onReceiptScanned={handleReceiptScanned}
          onCancel={() => setShowReceiptScanner(false)}
        />
      )}

      {/* Maintenance Form */}
      {isFormVisible && (
        <div className="bg-slate-800 p-4 sm:p-6 rounded-lg shadow-2xl animate-fade-in">
          <h2 className="text-xl font-bold mb-4 text-cyan-400">
            {editingRecord ? 'Edit' : 'New'} Maintenance Record - {activeVehicle.name}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-slate-300 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
              <div>
                <label htmlFor="kilometers" className="block text-sm font-medium text-slate-300 mb-1">
                  Odometer Reading (km) *
                </label>
                <input
                  type="number"
                  id="kilometers"
                  value={kilometers}
                  onChange={(e) => setKilometers(e.target.value)}
                  placeholder={`Current: ${activeVehicle.currentOdometer.toLocaleString()} km`}
                  className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">
                Service Description *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Oil change, new chain and sprockets, brake pads replacement"
                rows={3}
                className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>

            {/* Cost Tracking */}
            <div className="border-t border-slate-700 pt-4">
              <h3 className="text-sm font-semibold text-slate-300 mb-3">Cost Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="partsCost" className="block text-sm font-medium text-slate-300 mb-1">
                    Parts Cost (RM)
                  </label>
                  <input
                    type="number"
                    id="partsCost"
                    value={partsCost}
                    onChange={(e) => setPartsCost(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label htmlFor="laborCost" className="block text-sm font-medium text-slate-300 mb-1">
                    Labor Cost (RM)
                  </label>
                  <input
                    type="number"
                    id="laborCost"
                    value={laborCost}
                    onChange={(e) => setLaborCost(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Photos */}
            <div className="border-t border-slate-700 pt-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Photos (Optional, Max 5)
              </label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer bg-slate-700 hover:bg-slate-600 text-slate-300 px-4 py-2 rounded-md border border-slate-600 transition-colors inline-flex items-center gap-2">
                  <PhotoIcon className="w-5 h-5" />
                  <span className="text-sm">Upload Photos</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
                <span className="text-xs text-slate-400">{photos.length}/5 photos</span>
              </div>
              {photos.length > 0 && (
                <div className="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img src={photo} alt={`Upload ${index + 1}`} className="w-full h-20 object-cover rounded-md" />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-1 right-1 bg-red-600 hover:bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="border-t border-slate-700 pt-4">
              <label htmlFor="notes" className="block text-sm font-medium text-slate-300 mb-1">
                Additional Notes (Optional)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional information, observations, or reminders..."
                rows={3}
                className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>

            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-4 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="py-2 px-4 rounded-md text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-2 px-4 rounded-md shadow-md shadow-cyan-500/20 transition-colors"
              >
                {editingRecord ? 'Update Record' : 'Save Record'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MaintenanceForm;