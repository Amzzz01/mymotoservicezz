import React, { useState } from 'react';
import { CostSummary, MaintenanceRecord, Vehicle } from '../types';
import { useAnalytics } from '../hooks/useAnalytics';
import { useApp } from '../context/AppContext';
import CostDashboard from './CostDashboard';

interface OverviewProps {
  records: MaintenanceRecord[];
  activeVehicle: Vehicle;
  costSummary: CostSummary;
  onViewAll: () => void;
}

const ChevronIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const RATING_CLASSES: Record<string, string> = {
  excellent: 'bg-green-500/20 text-green-600 dark:text-green-400',
  good: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
  fair: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
  high: 'bg-red-500/20 text-red-600 dark:text-red-400',
};

const Overview: React.FC<OverviewProps> = ({ records, activeVehicle, costSummary, onViewAll }) => {
  const { t } = useApp();
  const { costEfficiency, predictiveAlerts } = useAnalytics(records, activeVehicle);
  const [vehicleInfoExpanded, setVehicleInfoExpanded] = useState(false);

  const nearestAlert = predictiveAlerts[0];

  const hasFrontTyre = activeVehicle.tyrePressureFront != null;
  const hasRearTyre = activeVehicle.tyrePressureRear != null;
  const tyrePressureText = hasFrontTyre && hasRearTyre
    ? `${activeVehicle.tyrePressureFront} / ${activeVehicle.tyrePressureRear} psi`
    : hasFrontTyre
      ? `F ${activeVehicle.tyrePressureFront} psi`
      : hasRearTyre
        ? `R ${activeVehicle.tyrePressureRear} psi`
        : null;

  const daysUntilRoadTax = activeVehicle.roadTaxExpiry
    ? Math.ceil((new Date(activeVehicle.roadTaxExpiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;
  const roadTaxColorClass = daysUntilRoadTax === null
    ? 'text-slate-700 dark:text-slate-300'
    : daysUntilRoadTax <= 7
      ? 'text-red-600 dark:text-red-400'
      : daysUntilRoadTax <= 30
        ? 'text-yellow-600 dark:text-yellow-400'
        : 'text-slate-700 dark:text-slate-300';

  const vehicleInfoRows = [
    activeVehicle.registrationNumber && { label: t.registration, value: activeVehicle.registrationNumber, className: 'text-slate-700 dark:text-slate-300' },
    tyrePressureText && { label: t.tyrePressureLabel, value: tyrePressureText, className: 'text-slate-700 dark:text-slate-300' },
    activeVehicle.roadTaxExpiry && {
      label: t.roadTaxExpiry,
      value: new Date(activeVehicle.roadTaxExpiry).toLocaleDateString(),
      className: roadTaxColorClass,
    },
  ].filter((row): row is { label: string; value: string; className: string } => Boolean(row));

  const recentRecords = [...records]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-4 mb-6">
      {/* Hero card */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg shadow-lg p-6 text-center text-white">
        <div className="text-sm font-medium opacity-90">{activeVehicle.name} · {t.odometer}</div>
        <div className="text-4xl sm:text-5xl font-bold mt-1 tracking-tight">
          {activeVehicle.currentOdometer.toLocaleString()} <span className="text-xl sm:text-2xl font-medium opacity-90">km</span>
        </div>
      </div>

      {/* Two-tile row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">{t.nextService}</div>
          {nearestAlert ? (
            <>
              <div className="font-bold text-slate-800 dark:text-slate-100 truncate">{nearestAlert.serviceType}</div>
              {nearestAlert.distanceRemaining <= 0 ? (
                <div className="text-sm font-semibold text-red-600 dark:text-red-400 mt-1">{t.overdue}</div>
              ) : (
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {nearestAlert.distanceRemaining.toLocaleString()} km · {t.distanceRemaining}
                </div>
              )}
            </>
          ) : (
            <div className="text-sm text-slate-400 dark:text-slate-500">{t.noPredictions}</div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">{t.costEfficiency}</div>
          {costEfficiency ? (
            <>
              <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${RATING_CLASSES[costEfficiency.rating]}`}>
                {costEfficiency.rating.toUpperCase()}
              </span>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
                RM {costEfficiency.costPerKm.toFixed(2)}/km
              </div>
            </>
          ) : (
            <div className="text-sm text-slate-400 dark:text-slate-500">{t.addRecordsForAnalytics}</div>
          )}
        </div>
      </div>

      {/* Vehicle info card (collapsible, collapsed by default) */}
      {vehicleInfoRows.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden">
          <button
            onClick={() => setVehicleInfoExpanded(prev => !prev)}
            className="w-full flex items-center justify-between px-4 py-3 min-h-[44px] text-left"
            aria-expanded={vehicleInfoExpanded}
          >
            <span className="font-semibold text-slate-700 dark:text-slate-300">{t.vehicleInfo}</span>
            <ChevronIcon className={`w-5 h-5 text-slate-400 dark:text-slate-500 transition-transform ${vehicleInfoExpanded ? 'rotate-180' : ''}`} />
          </button>
          {vehicleInfoExpanded && (
            <div className="px-4 pb-4 space-y-2 border-t border-slate-200 dark:border-slate-700 pt-3">
              {vehicleInfoRows.map((row) => (
                <div key={row.label} className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">{row.label}</span>
                  <span className={`font-medium ${row.className}`}>{row.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Cost Overview */}
      <CostDashboard costSummary={costSummary} />

      {/* Recent service history */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-700 dark:text-slate-300">{t.recentServiceHistory}</h3>
          {records.length > 0 && (
            <button
              onClick={onViewAll}
              className="text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 min-h-[44px] px-2"
            >
              {t.viewAll}
            </button>
          )}
        </div>
        {recentRecords.length === 0 ? (
          <p className="text-sm text-slate-400 dark:text-slate-500">{t.noRecordsYet}</p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {recentRecords.map((record) => {
              const total = (record.partsCost || 0) + (record.laborCost || 0);
              return (
                <div key={record.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium text-slate-800 dark:text-slate-100 truncate">{record.description}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(record.date).toLocaleDateString()} · {record.kilometers.toLocaleString()} km
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">
                    RM {total.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Overview;
