import React from 'react';
import { createPortal } from 'react-dom';
import { Announcement } from '../types';
import { useApp } from '../context/AppContext';
import { RoadTaxAlert, describeRoadTax, vehicleLabel } from '../utils/roadTax';
import { ClockIcon, ShieldAlertIcon } from './RoadTaxAlert';

interface AnnouncementModalProps {
  announcements: Announcement[];
  viewedAnnouncementIds: Set<string>;
  onClose: () => void;
  onMarkAsViewed: (announcementId: string) => void;
  onMarkAllAsViewed: () => void;
  roadTaxAlerts: RoadTaxAlert[];
  onRenewRoadTax: (vehicleId: string) => void;
}

const AnnouncementModal: React.FC<AnnouncementModalProps> = ({
  announcements,
  viewedAnnouncementIds,
  onClose,
  onMarkAsViewed,
  onMarkAllAsViewed,
  roadTaxAlerts,
  onRenewRoadTax
}) => {
  const { t } = useApp();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'feature':
        return '✨';
      case 'update':
        return '🔄';
      case 'maintenance':
        return '🔧';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'feature':
        return 'from-purple-500 to-pink-500';
      case 'update':
        return 'from-blue-500 to-cyan-500';
      case 'maintenance':
        return 'from-orange-500 to-red-500';
      case 'info':
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <span className="text-xs font-bold px-2 py-1 bg-red-500 text-white rounded">HIGH</span>;
      case 'medium':
        return <span className="text-xs font-bold px-2 py-1 bg-yellow-500 text-white rounded">MEDIUM</span>;
      case 'low':
        return <span className="text-xs font-bold px-2 py-1 bg-green-500 text-white rounded">LOW</span>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const unreadCount = announcements.filter(a => !viewedAnnouncementIds.has(a.id)).length;

  // Modal content
  const modalContent = (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-[9998] animate-fade-in"
        onClick={onClose}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      
      {/* Modal - Centered on ENTIRE PAGE */}
      <div 
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <div 
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">📢 Announcements</h3>
                <p className="text-sm text-cyan-100 mt-1">
                  {unreadCount > 0 ? `${unreadCount} new update${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mark All as Read Button */}
          {unreadCount > 0 && (
            <div className="px-6 py-3 bg-slate-100 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
              <button
                onClick={onMarkAllAsViewed}
                className="text-sm text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Mark all as read
              </button>
            </div>
          )}

          {/* Announcements List - Scrollable */}
          <div className="max-h-[60vh] overflow-y-auto p-6 space-y-4">
            {roadTaxAlerts.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.needsAction}</div>
                {roadTaxAlerts.map(alert => {
                  const expired = alert.status === 'expired';
                  return (
                    <div
                      key={alert.vehicle.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border ${
                        expired
                          ? 'bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700'
                          : 'bg-amber-50 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700'
                      }`}
                    >
                      <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-white ${expired ? 'bg-red-600' : 'bg-amber-600'}`}>
                        {expired ? <ShieldAlertIcon className="w-5 h-5" /> : <ClockIcon className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-bold text-sm ${expired ? 'text-red-800 dark:text-red-300' : 'text-amber-800 dark:text-amber-300'}`}>
                          {expired ? t.roadTaxExpiredTitle : t.roadTaxSoonTitle}
                        </div>
                        <div className="text-sm text-slate-700 dark:text-slate-300 truncate">{vehicleLabel(alert.vehicle)}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{describeRoadTax(alert.vehicle.roadTaxExpiry!, t)}</div>
                      </div>
                      <button
                        onClick={() => onRenewRoadTax(alert.vehicle.id)}
                        className={`flex-shrink-0 min-h-[36px] px-3 rounded-lg text-sm font-bold ${
                          expired
                            ? 'bg-red-600 hover:bg-red-500 text-white'
                            : 'bg-white dark:bg-slate-800 border border-amber-600 text-amber-800 dark:text-amber-300'
                        }`}
                      >
                        {t.renew}
                      </button>
                    </div>
                  );
                })}
                <p className="text-xs text-slate-500 dark:text-slate-400">{t.roadTaxAlertsStay}</p>
              </div>
            )}

            {announcements.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-slate-500 dark:text-slate-400 text-lg">No announcements yet</p>
                <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">Check back later for updates!</p>
              </div>
            ) : (
              announcements.map((announcement) => {
                const isUnread = !viewedAnnouncementIds.has(announcement.id);
                
                return (
                  <div
                    key={announcement.id}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      isUnread
                        ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 shadow-lg'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700/50'
                    }`}
                  >
                    {/* Unread Indicator */}
                    {isUnread && (
                      <div className="absolute top-2 right-2">
                        <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></div>
                      </div>
                    )}

                    {/* Type Banner */}
                    <div className={`bg-gradient-to-r ${getTypeColor(announcement.type)} px-4 py-2 flex items-center justify-between`}>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getTypeIcon(announcement.type)}</span>
                        <span className="text-white font-bold text-sm uppercase tracking-wide">
                          {announcement.type}
                        </span>
                        {announcement.version && (
                          <span className="text-white/80 text-xs">v{announcement.version}</span>
                        )}
                      </div>
                      {!announcement.fromAdmin && getPriorityBadge(announcement.priority)}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
                        {announcement.title}
                      </h4>
                      <p className="text-slate-600 dark:text-slate-300 text-sm whitespace-pre-line leading-relaxed">
                        {announcement.message}
                      </p>
                      
                      {/* Footer */}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200 dark:border-slate-600">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {formatDate(announcement.date)}
                        </span>
                        
                        {isUnread && (
                          <button
                            onClick={() => onMarkAsViewed(announcement.id)}
                            className="text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-medium"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );

  // Render modal at document.body level using Portal
  return createPortal(modalContent, document.body);
};

export default AnnouncementModal;