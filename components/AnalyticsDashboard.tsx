import React, { useState } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import { MaintenanceRecord, Vehicle, Reminder } from '../types';
import { useApp } from '../context/AppContext';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface AnalyticsDashboardProps {
  records: MaintenanceRecord[];
  activeVehicle: Vehicle | null;
  onAddReminder: (reminder: Omit<Reminder, 'id' | 'createdAt'>) => Promise<void>;
  userId: string;
}

const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];

// Plus Icon Component
const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
  </svg>
);

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ 
  records, 
  activeVehicle, 
  onAddReminder, 
  userId 
}) => {
  const { t } = useApp();
  const analytics = useAnalytics(records, activeVehicle);
  const [activeTab, setActiveTab] = useState<'overview' | 'patterns' | 'predictions'>('overview');
  const [addingReminderId, setAddingReminderId] = useState<string | null>(null);
  const [successMessages, setSuccessMessages] = useState<Record<string, string>>({});
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});

  if (!activeVehicle || records.length === 0) {
    return (
      <div className="bg-slate-800 rounded-lg p-8 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-semibold text-slate-300 mb-2">
          {t.noAnalyticsData || 'No Analytics Data Available'}
        </h3>
        <p className="text-slate-400">
          {t.addRecordsForAnalytics || 'Add maintenance records to see analytics and insights'}
        </p>
      </div>
    );
  }

  const { costEfficiency, predictiveAlerts, serviceBreakdown, timeline, costTrend } = analytics;

  const handleAddToReminder = async (alert: any, index: number) => {
    const alertId = `${alert.serviceType}-${index}`;
    setAddingReminderId(alertId);
    setErrorMessages({ ...errorMessages, [alertId]: '' });
    setSuccessMessages({ ...successMessages, [alertId]: '' });

    try {
      const reminderData: Omit<Reminder, 'id' | 'createdAt'> = {
        userId,
        vehicleId: activeVehicle.id,
        title: alert.serviceType,
        description: `Based on your maintenance history. Average interval: ${alert.averageInterval.toLocaleString()} km`,
        dueMileage: alert.predictedKilometers,
        isActive: true,
        dismissed: false
      };

      await onAddReminder(reminderData);

      setSuccessMessages({
        ...successMessages,
        [alertId]: `✅ Reminder added for ${alert.serviceType} at ${alert.predictedKilometers.toLocaleString()} km!`
      });

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessages(prev => {
          const newMessages = { ...prev };
          delete newMessages[alertId];
          return newMessages;
        });
      }, 5000);

    } catch (err) {
      console.error('Error adding reminder:', err);
      setErrorMessages({
        ...errorMessages,
        [alertId]: 'Failed to add reminder. Please try again.'
      });

      // Clear error message after 5 seconds
      setTimeout(() => {
        setErrorMessages(prev => {
          const newMessages = { ...prev };
          delete newMessages[alertId];
          return newMessages;
        });
      }, 5000);
    } finally {
      setAddingReminderId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          📊 {t.analytics || 'Analytics & Insights'}
        </h2>
        <p className="text-cyan-100">
          {t.analyticsSubtitle || 'Data-driven insights for your motorcycle maintenance'}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-700">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'overview'
              ? 'text-cyan-400 border-b-2 border-cyan-400'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          {t.overview || 'Overview'}
        </button>
        <button
          onClick={() => setActiveTab('patterns')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'patterns'
              ? 'text-cyan-400 border-b-2 border-cyan-400'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          {t.servicePatterns || 'Service Patterns'}
        </button>
        <button
          onClick={() => setActiveTab('predictions')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'predictions'
              ? 'text-cyan-400 border-b-2 border-cyan-400'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          {t.predictions || 'Predictions'}
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Cost Efficiency Card */}
          {costEfficiency && (
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-slate-300 mb-4 flex items-center gap-2">
                💰 {t.costEfficiency || 'Cost Efficiency'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Cost per KM */}
                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="text-sm text-slate-400 mb-1">
                    {t.costPerKm || 'Cost per Kilometer'}
                  </div>
                  <div className="text-3xl font-bold text-cyan-400">
                    RM {costEfficiency.costPerKm.toFixed(2)}
                  </div>
                  <div className="mt-2">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        costEfficiency.rating === 'excellent'
                          ? 'bg-green-500/20 text-green-400'
                          : costEfficiency.rating === 'good'
                          ? 'bg-blue-500/20 text-blue-400'
                          : costEfficiency.rating === 'fair'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {costEfficiency.rating.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Monthly Average */}
                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="text-sm text-slate-400 mb-1">
                    {t.monthlyAverage || 'Monthly Average'}
                  </div>
                  <div className="text-3xl font-bold text-blue-400">
                    RM {costEfficiency.monthlyAverage.toFixed(0)}
                  </div>
                  <div className="text-sm text-slate-500 mt-2">
                    {t.basedOnHistory || 'Based on your history'}
                  </div>
                </div>

                {/* Total Distance */}
                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="text-sm text-slate-400 mb-1">
                    {t.totalDistance || 'Total Distance'}
                  </div>
                  <div className="text-3xl font-bold text-purple-400">
                    {costEfficiency.totalDistance.toLocaleString()} km
                  </div>
                  <div className="text-sm text-slate-500 mt-2">
                    {t.totalCostLabel || 'Total'}: RM {costEfficiency.totalCost.toFixed(0)}
                  </div>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="mt-4 pt-4 border-t border-slate-700">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t.partsPerKm || 'Parts Cost/km'}:</span>
                    <span className="text-slate-300 font-semibold">
                      RM {costEfficiency.partsPerKm.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t.laborPerKm || 'Labor Cost/km'}:</span>
                    <span className="text-slate-300 font-semibold">
                      RM {costEfficiency.laborPerKm.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Service Breakdown Pie Chart */}
          {serviceBreakdown.length > 0 && (
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-slate-300 mb-4">
                📊 {t.serviceBreakdown || 'Service Breakdown'}
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={serviceBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ serviceType, percentage }) =>
                        `${serviceType} (${percentage.toFixed(1)}%)`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {serviceBreakdown.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Cost Trend Line Chart */}
          {costTrend.length > 0 && (
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-slate-300 mb-4">
                📈 {t.costTrend || 'Cost Trend Over Time'}
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={costTrend as any}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="totalCost"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      name={t.totalCost || 'Total Cost (RM)'}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Service Patterns Tab */}
      {activeTab === 'patterns' && (
        <div className="space-y-6">
          {/* Timeline Bar Chart */}
          {timeline.length > 0 && (
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-slate-300 mb-4">
                📅 {t.serviceTimeline || 'Service Timeline'}
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeline as any}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="serviceCount"
                      fill="#06b6d4"
                      name={t.serviceCount || 'Services'}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Service Frequency Table */}
          {analytics.servicePatterns.length > 0 && (
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-slate-300 mb-4">
                🔄 {t.serviceFrequency || 'Service Frequency & Intervals'}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-2 text-slate-400 font-medium">
                        {t.serviceType || 'Service Type'}
                      </th>
                      <th className="text-left py-3 px-2 text-slate-400 font-medium">
                        {t.frequency || 'Frequency'}
                      </th>
                      <th className="text-left py-3 px-2 text-slate-400 font-medium">
                        {t.avgInterval || 'Avg Interval'}
                      </th>
                      <th className="text-left py-3 px-2 text-slate-400 font-medium">
                        {t.avgCost || 'Avg Cost'}
                      </th>
                      <th className="text-left py-3 px-2 text-slate-400 font-medium">
                        {t.lastPerformed || 'Last Performed'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.servicePatterns.map((pattern, index) => (
                      <tr
                        key={pattern.serviceType}
                        className={`border-b border-slate-700/50 ${
                          index % 2 === 0 ? 'bg-slate-750' : ''
                        }`}
                      >
                        <td className="py-3 px-2 text-slate-300">{pattern.serviceType}</td>
                        <td className="py-3 px-2 text-slate-300">
                          {pattern.count}x
                        </td>
                        <td className="py-3 px-2 text-slate-300">
                          {pattern.averageInterval > 0
                            ? `${pattern.averageInterval.toLocaleString()} km`
                            : '-'}
                        </td>
                        <td className="py-3 px-2 text-slate-300">
                          RM {pattern.averageCost.toFixed(0)}
                        </td>
                        <td className="py-3 px-2 text-slate-400 text-sm">
                          {new Date(pattern.lastPerformed).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Predictions Tab */}
      {activeTab === 'predictions' && (
        <div className="space-y-6">
          {predictiveAlerts.length > 0 ? (
            <>
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">
                  🔮 {t.predictiveMaintenance || 'Predictive Maintenance'}
                </h3>
                <p className="text-purple-100">
                  {t.predictiveSubtitle ||
                    'Based on your maintenance history, here are predicted upcoming services'}
                </p>
              </div>

              <div className="space-y-4">
                {predictiveAlerts.map((alert, index) => {
                  const alertId = `${alert.serviceType}-${index}`;
                  const isAdding = addingReminderId === alertId;
                  const successMsg = successMessages[alertId];
                  const errorMsg = errorMessages[alertId];

                  return (
                    <div key={alertId}>
                      <div
                        className={`bg-slate-800 rounded-lg p-6 border-l-4 ${
                          alert.distanceRemaining < 0
                            ? 'border-red-500'
                            : alert.distanceRemaining < 500
                            ? 'border-yellow-500'
                            : 'border-green-500'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="text-lg font-semibold text-slate-200">
                                {alert.serviceType}
                              </h4>
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  alert.confidence === 'high'
                                    ? 'bg-green-500/20 text-green-400'
                                    : alert.confidence === 'medium'
                                    ? 'bg-yellow-500/20 text-yellow-400'
                                    : 'bg-gray-500/20 text-gray-400'
                                }`}
                              >
                                {alert.confidence} confidence
                              </span>
                            </div>

                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-slate-400">
                                  {t.predictedAt || 'Predicted at'}:
                                </span>
                                <span className="text-slate-300 font-semibold">
                                  {alert.predictedKilometers.toLocaleString()} km
                                </span>
                              </div>

                              <div className="flex justify-between">
                                <span className="text-slate-400">
                                  {t.distanceRemaining || 'Distance remaining'}:
                                </span>
                                <span
                                  className={`font-semibold ${
                                    alert.distanceRemaining < 0
                                      ? 'text-red-400'
                                      : alert.distanceRemaining < 500
                                      ? 'text-yellow-400'
                                      : 'text-green-400'
                                  }`}
                                >
                                  {alert.distanceRemaining < 0
                                    ? `${Math.abs(alert.distanceRemaining).toLocaleString()} km ${
                                        t.overdue || 'overdue'
                                      }`
                                    : `${alert.distanceRemaining.toLocaleString()} km`}
                                </span>
                              </div>

                              <div className="flex justify-between">
                                <span className="text-slate-400">
                                  {t.avgInterval || 'Average interval'}:
                                </span>
                                <span className="text-slate-300">
                                  {alert.averageInterval.toLocaleString()} km
                                </span>
                              </div>

                              <div className="flex justify-between">
                                <span className="text-slate-400">
                                  {t.lastPerformed || 'Last performed'}:
                                </span>
                                <span className="text-slate-300">
                                  {new Date(alert.lastPerformed).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-4xl ml-4">
                            {alert.distanceRemaining < 0
                              ? '🚨'
                              : alert.distanceRemaining < 500
                              ? '⚠️'
                              : '✅'}
                          </div>
                        </div>

                        {/* Add to Reminder Button */}
                        <div className="mt-4 pt-4 border-t border-slate-700 flex justify-center">
                          <button
                            onClick={() => handleAddToReminder(alert, index)}
                            disabled={isAdding || !!successMsg}
                            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none text-sm"
                          >
                            {isAdding ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Adding...
                              </>
                            ) : successMsg ? (
                              <>✅ Added</>
                            ) : (
                              <>
                                <PlusIcon className="w-4 h-4" />
                                Add to Reminders
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Success Message */}
                      {successMsg && (
                        <div className="mt-2 bg-green-900/50 border border-green-700 text-green-300 px-4 py-2 rounded-lg text-center text-sm animate-fade-in">
                          {successMsg}
                        </div>
                      )}

                      {/* Error Message */}
                      {errorMsg && (
                        <div className="mt-2 bg-red-900/50 border border-red-700 text-red-300 px-4 py-2 rounded-lg text-center text-sm">
                          {errorMsg}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="bg-slate-800 rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-slate-300 mb-2">
                {t.noPredictions || 'No Predictions Available'}
              </h3>
              <p className="text-slate-400">
                {t.needMoreDataForPredictions ||
                  'Add more maintenance records (at least 2 of the same service type) to see predictive alerts'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;