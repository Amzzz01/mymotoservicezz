import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Vehicle } from '../types';

interface VehicleSelectorProps {
  vehicles: Vehicle[];
  activeVehicle: Vehicle | null;
  onSelectVehicle: (vehicleId: string) => Promise<void>;
}

const MotorcycleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.586 4H5.414A2.914 2.914 0 002.5 6.914v1.072A8.004 8.004 0 004 12.5v4.619a1 1 0 001.32.949l3.41-1.364A1 1 0 009 17.76V16h6v1.76a1 1 0 01-.27.648l-3.41 1.364a1 1 0 00-1.32.95V22h2a1 1 0 001-1v-1.115a8.04 8.04 0 003-3.033V15a1 1 0 00-1-1h-1v-1.5a8.004 8.004 0 001.5-4.514V6.914A2.914 2.914 0 0018.586 4zM8 12c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm8 0c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2z"/>
  </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const VehicleSelector: React.FC<VehicleSelectorProps> = ({
  vehicles,
  activeVehicle,
  onSelectVehicle
}) => {
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSelectVehicle = async (vehicleId: string) => {
    await onSelectVehicle(vehicleId);
    setShowModal(false);
  };

  if (vehicles.length === 0) return null;

  // Modal content
  const modalContent = showModal ? (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-[9998] animate-fade-in"
        onClick={() => setShowModal(false)}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      
      {/* Modal - Centered on ENTIRE PAGE */}
      <div 
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <div 
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Select Vehicle</h3>
                <p className="text-sm text-cyan-100 mt-1">
                  {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Vehicle List - Scrollable */}
          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
            {vehicles.map((vehicle) => {
              const isActive = activeVehicle?.id === vehicle.id;
              
              return (
                <button
                  key={vehicle.id}
                  onClick={() => handleSelectVehicle(vehicle.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg transform scale-[1.02]'
                      : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {/* Vehicle Icon/Emoji */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                    isActive ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-600'
                  }`}>
                    {vehicle.iconType === 'emoji' && vehicle.customIcon ? (
                      <span className="text-2xl">{vehicle.customIcon}</span>
                    ) : vehicle.iconType === 'image' && vehicle.customIcon ? (
                      <img 
                        src={vehicle.customIcon} 
                        alt={vehicle.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <MotorcycleIcon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-300'}`} />
                    )}
                  </div>

                  {/* Vehicle Info */}
                  <div className="flex-1 text-left">
                    <div className={`font-bold text-base ${isActive ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>
                      {vehicle.name}
                    </div>
                    <div className={`text-sm ${isActive ? 'text-cyan-100' : 'text-slate-500 dark:text-slate-400'}`}>
                      {vehicle.type}
                    </div>
                    {vehicle.registrationNumber && (
                      <div className={`text-xs mt-1 ${isActive ? 'text-cyan-200' : 'text-slate-400 dark:text-slate-500'}`}>
                        {vehicle.registrationNumber}
                      </div>
                    )}
                  </div>

                  {/* Active Indicator */}
                  {isActive && (
                    <div className="flex-shrink-0">
                      <div className="bg-white rounded-full p-1">
                        <CheckIcon className="w-5 h-5 text-cyan-500" />
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  ) : null;

  return (
    <>
      {/* Vehicle Selector Button */}
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700/50 transition-colors"
        aria-label="Select Vehicle"
      >
        {activeVehicle?.iconType === 'emoji' && activeVehicle.customIcon ? (
          <span className="text-2xl">{activeVehicle.customIcon}</span>
        ) : activeVehicle?.iconType === 'image' && activeVehicle.customIcon ? (
          <img 
            src={activeVehicle.customIcon} 
            alt={activeVehicle.name}
            className="w-6 h-6 rounded-full object-cover"
          />
        ) : (
          <MotorcycleIcon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
        )}
        <div className="hidden lg:block text-left">
          <div className="text-xs text-slate-500 dark:text-slate-400">Active Vehicle</div>
          <div className="text-sm font-bold text-cyan-600 dark:text-cyan-400">
            {activeVehicle?.name || 'Select Vehicle'}
          </div>
        </div>
        <svg 
          className="w-4 h-4 text-slate-500 dark:text-slate-400 hidden lg:block" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Render modal at document.body level using Portal */}
      {mounted && createPortal(modalContent, document.body)}
    </>
  );
};

export default VehicleSelector;