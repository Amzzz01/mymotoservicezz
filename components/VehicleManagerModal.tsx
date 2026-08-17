import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Vehicle, MaintenanceRecord } from '../types';
import { useApp } from '../context/AppContext';
import VehicleManager from './VehicleManager';

interface VehicleManagerModalProps {
  vehicles: Vehicle[];
  activeVehicle: Vehicle | null;
  onAddVehicle: (vehicle: Omit<Vehicle, 'id' | 'createdAt'>) => Promise<void>;
  onUpdateVehicle: (id: string, updates: Partial<Vehicle>) => Promise<void>;
  onDeleteVehicle: (id: string) => Promise<void>;
  onSetActive: (id: string) => Promise<void>;
  userId: string;
  records: MaintenanceRecord[];
  onClose: () => void;
}

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const VehicleManagerModal: React.FC<VehicleManagerModalProps> = ({ onClose, ...vehicleManagerProps }) => {
  const { t } = useApp();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-[9998] animate-fade-in"
        onClick={onClose}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <div
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
            <h3 className="text-lg font-bold text-white">{t.manageVehicles}</h3>
            <button
              onClick={onClose}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              aria-label={t.close}
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="p-4 sm:p-6">
            <VehicleManager {...vehicleManagerProps} />
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default VehicleManagerModal;
