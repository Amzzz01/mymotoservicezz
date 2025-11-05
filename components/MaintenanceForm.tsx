import React, { useState } from 'react';
import { MaintenanceRecord } from '../types';

interface MaintenanceFormProps {
  onAddRecord: (record: Omit<MaintenanceRecord, 'id'>) => void;
}

const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
    </svg>
);

const MaintenanceForm: React.FC<MaintenanceFormProps> = ({ onAddRecord }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [kilometers, setKilometers] = useState('');
  const [motorcycleName, setMotorcycleName] = useState('');
  const [motorcycleType, setMotorcycleType] = useState('');
  const [error, setError] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !description || !kilometers || !motorcycleName || !motorcycleType) {
      setError('All fields are required.');
      return;
    }
    const kmNumber = parseInt(kilometers, 10);
    if (isNaN(kmNumber) || kmNumber < 0) {
      setError('Kilometers must be a positive number.');
      return;
    }

    onAddRecord({ date, description, kilometers: kmNumber, motorcycleName, motorcycleType });
    setDescription('');
    setKilometers('');
    setMotorcycleName('');
    setMotorcycleType('');
    setError('');
    setIsFormVisible(false);
  };

  return (
    <div className="mb-8">
      {!isFormVisible ? (
        <div className="text-center">
            <button
            onClick={() => setIsFormVisible(true)}
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 px-6 rounded-lg shadow-lg shadow-cyan-500/20 transition-all duration-300 transform hover:scale-105"
            >
            <PlusIcon className="w-5 h-5" />
            Add New Maintenance Record
            </button>
        </div>
      ) : (
        <div className="bg-slate-800 p-6 rounded-lg shadow-2xl animate-fade-in">
            <h2 className="text-xl font-bold mb-4 text-cyan-400">New Maintenance Record</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="date" className="block text-sm font-medium text-slate-300 mb-1">Date</label>
                <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="motorcycleName" className="block text-sm font-medium text-slate-300 mb-1">Motorcycle Name</label>
                    <input
                    type="text"
                    id="motorcycleName"
                    value={motorcycleName}
                    onChange={(e) => setMotorcycleName(e.target.value)}
                    placeholder="e.g., Nightster"
                    className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                </div>
                <div>
                    <label htmlFor="motorcycleType" className="block text-sm font-medium text-slate-300 mb-1">Motorcycle Type</label>
                    <input
                    type="text"
                    id="motorcycleType"
                    value={motorcycleType}
                    onChange={(e) => setMotorcycleType(e.target.value)}
                    placeholder="e.g., Harley-Davidson Sportster"
                    className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                </div>
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Oil change, new chain and sprockets"
                rows={3}
                className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
            </div>
            <div>
                <label htmlFor="kilometers" className="block text-sm font-medium text-slate-300 mb-1">Kilometers</label>
                <input
                type="number"
                id="kilometers"
                value={kilometers}
                onChange={(e) => setKilometers(e.target.value)}
                placeholder="Odometer reading"
                className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <div className="flex justify-end gap-4 pt-2">
                 <button type="button" onClick={() => setIsFormVisible(false)} className="py-2 px-4 rounded-md text-slate-300 hover:bg-slate-700 transition-colors">
                    Cancel
                </button>
                <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-2 px-4 rounded-md shadow-md shadow-cyan-500/20 transition-colors">
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
