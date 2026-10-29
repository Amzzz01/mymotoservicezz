import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppContext';
import {
  RoadTaxAlert,
  addOneYear,
  describeRoadTax,
  getRoadTaxDaysLeft,
  vehicleLabel,
} from '../utils/roadTax';

interface RenewRoadTaxModalProps {
  alerts: RoadTaxAlert[];
  initialVehicleId?: string | null;
  onSave: (vehicleId: string, newExpiry: string) => Promise<void>;
  onClose: () => void;
}

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const RenewRoadTaxModal: React.FC<RenewRoadTaxModalProps> = ({ alerts: liveAlerts, initialVehicleId, onSave, onClose }) => {
  const { t } = useApp();
  // Snapshot the list on open so it doesn't reshuffle while the form is in use
  const [alerts] = useState(liveAlerts);
  const initial = alerts.find(a => a.vehicle.id === initialVehicleId) ?? alerts[0];
  const [vehicleId, setVehicleId] = useState(initial.vehicle.id);
  const [newExpiry, setNewExpiry] = useState(addOneYear(initial.vehicle.roadTaxExpiry!));
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const selectVehicle = (alert: RoadTaxAlert) => {
    setVehicleId(alert.vehicle.id);
    setNewExpiry(addOneYear(alert.vehicle.roadTaxExpiry!));
    setError('');
  };

  const handleSave = async () => {
    if (!newExpiry || getRoadTaxDaysLeft(newExpiry) <= 0) {
      setError(t.expiryMustBeFuture);
      return;
    }
    setSaving(true);
    try {
      await onSave(vehicleId, newExpiry);
    } catch (err) {
      console.error('Failed to renew road tax:', err);
      setError(t.failedRenewRoadTax);
      setSaving(false);
    }
  };

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-fade-in" onClick={onClose} />
      <div className="fixed inset-x-0 bottom-0 sm:inset-0 z-40 flex justify-center sm:items-center sm:p-4 pointer-events-none">
        <div
          className="pointer-events-auto bg-white dark:bg-slate-800 w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl animate-slide-up overflow-hidden pb-[env(safe-area-inset-bottom)]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="renew-road-tax-title"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <h3 id="renew-road-tax-title" className="text-lg font-bold text-slate-800 dark:text-slate-100">{t.renewRoadTax}</h3>
            <button
              onClick={onClose}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              aria-label={t.close}
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            <fieldset className="space-y-2">
              <legend className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t.selectVehicle}</legend>
              {alerts.map(alert => {
                const selected = alert.vehicle.id === vehicleId;
                const expired = alert.status === 'expired';
                return (
                  <label
                    key={alert.vehicle.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border-2 transition-colors ${
                      selected
                        ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/30'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="renew-vehicle"
                      checked={selected}
                      onChange={() => selectVehicle(alert)}
                      className="w-4 h-4 accent-cyan-600"
                    />
                    <span className="flex-1 min-w-0">
                      <span className="block font-semibold text-slate-800 dark:text-slate-100 truncate">{vehicleLabel(alert.vehicle)}</span>
                      <span className={`block text-sm ${expired ? 'text-red-600 dark:text-red-400' : 'text-amber-700 dark:text-amber-400'}`}>
                        {describeRoadTax(alert.vehicle.roadTaxExpiry!, t)}
                      </span>
                    </span>
                    {expired && (
                      <span className="flex-shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white">
                        {t.expired}
                      </span>
                    )}
                  </label>
                );
              })}
            </fieldset>

            <div>
              <label htmlFor="renew-new-expiry" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.newExpiryDate}
              </label>
              <input
                id="renew-new-expiry"
                type="date"
                value={newExpiry}
                onChange={e => { setNewExpiry(e.target.value); setError(''); }}
                className="w-full min-h-[48px] bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-3 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t.newExpiryHint}</p>
              {error && <p className="text-sm text-red-600 dark:text-red-400 mt-2" role="alert">{error}</p>}
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={saving}
                className="flex-1 min-h-[48px] rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-[2] min-h-[48px] rounded-lg font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-60"
              >
                {t.saveNewDate}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default RenewRoadTaxModal;
