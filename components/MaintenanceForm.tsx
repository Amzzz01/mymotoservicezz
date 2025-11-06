import React, { useState } from 'react';
import { MaintenanceRecord, Vehicle } from '../types';

interface MaintenanceFormProps {
  onAddRecord: (record: Omit<MaintenanceRecord, 'id'>) => void;
  vehicles: Vehicle[];
  activeVehicle: Vehicle | null;
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

const MaintenanceForm: React.FC<MaintenanceFormProps> = ({ onAddRecord, vehicles, activeVehicle }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [kilometers, setKilometers] = useState('');
  const [motorcycleName, setMotorcycleName] = useState('');
  const [motorcycleType, setMotorcycleType] = useState('');
  const [partsCost, setPartsCost] = useState('');
  const [laborCost, setLaborCost] = useState('');
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);

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

    onAddRecord({
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
    });

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
      {!isFormVisible ? (
        <div className="text-center">
          <button
            onClick={() => setIsFormVisible(true)}
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-lg shadow-lg shadow-cyan-500/20 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
          >
            <PlusIcon className="w-5 h-5" />
            Add New Maintenance Record
          </button>
        </div>
      ) : (
        <div className="bg-slate-800 p-4 sm:p-6 rounded-lg shadow-2xl animate-fade-in">
          <h2 className="text-xl font-bold mb-4 text-cyan-400">
            New Maintenance Record - {activeVehicle.name}
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
              {(partsCost || laborCost) && (
                <div className="mt-2 text-right">
                  <span className="text-sm text-slate-400">Total: </span>
                  <span className="text-lg font-bold text-cyan-400">
                    RM {((parseFloat(partsCost || '0') + parseFloat(laborCost || '0')).toFixed(2))}
                  </span>
                </div>
              )}
            </div>

            {/* Photos */}
            <div className="border-t border-slate-700 pt-4">
              <h3 className="text-sm font-semibold text-slate-300 mb-3">Photos (Optional)</h3>
              <div className="space-y-3">
                <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-cyan-500 transition-colors">
                  <div className="flex flex-col items-center gap-2">
                    <PhotoIcon className="w-8 h-8 text-slate-500" />
                    <span className="text-sm text-slate-400">
                      Click to upload photos (max 5, 2MB each)
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>

                {photos.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={photo}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
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
                onClick={() => {
                  setIsFormVisible(false);
                  setError('');
                  setPhotos([]);
                }}
                className="py-2 px-4 rounded-md text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-2 px-4 rounded-md shadow-md shadow-cyan-500/20 transition-colors"
              >
                Save Record
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MaintenanceForm;