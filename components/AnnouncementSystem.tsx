import React, { useState, useEffect } from 'react';
import { useAnnouncements } from '../hooks/useAnnouncements';
import AnnouncementModal from './AnnouncementModal';

interface AnnouncementSystemProps {
  userId: string;
}

const BellIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M5.85 3.5a.75.75 0 00-1.117-1 9.719 9.719 0 00-2.348 4.876.75.75 0 001.479.248A8.219 8.219 0 015.85 3.5zM19.267 2.5a.75.75 0 10-1.118 1 8.22 8.22 0 011.987 4.124.75.75 0 001.48-.248A9.72 9.72 0 0019.266 2.5z" />
    <path fillRule="evenodd" d="M12 2.25A6.75 6.75 0 005.25 9v.75a8.217 8.217 0 01-2.119 5.52.75.75 0 00.298 1.206c1.544.57 3.16.99 4.831 1.243a3.75 3.75 0 107.48 0 24.583 24.583 0 004.83-1.244.75.75 0 00.298-1.205 8.217 8.217 0 01-2.118-5.52V9A6.75 6.75 0 0012 2.25zM9.75 18c0-.034 0-.067.002-.1a25.05 25.05 0 004.496 0l.002.1a2.25 2.25 0 11-4.5 0z" clipRule="evenodd" />
  </svg>
);

const AnnouncementSystem: React.FC<AnnouncementSystemProps> = ({ userId }) => {
  const {
    announcements,
    viewedAnnouncements,
    unreadCount,
    markAsViewed,
    markAllAsViewed,
    getUnreadAnnouncements
  } = useAnnouncements(userId);

  const [showModal, setShowModal] = useState(false);
  const [showInitialPopup, setShowInitialPopup] = useState(false);

  // Show popup for first unread announcement (only once per session)
  useEffect(() => {
    const hasShownPopup = sessionStorage.getItem('announcementPopupShown');
    
    if (!hasShownPopup && unreadCount > 0) {
      const timer = setTimeout(() => {
        setShowInitialPopup(true);
        sessionStorage.setItem('announcementPopupShown', 'true');
      }, 2000); // Show after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [unreadCount]);

  const viewedAnnouncementIds = new Set(viewedAnnouncements.map(v => v.announcementId));

  const handleOpenModal = () => {
    setShowModal(true);
    setShowInitialPopup(false);
  };

  const handleMarkAsViewed = async (announcementId: string) => {
    await markAsViewed(announcementId);
  };

  const handleMarkAllAsViewed = async () => {
    await markAllAsViewed();
  };

  return (
    <>
      {/* Notification Bell Button */}
      <div className="relative">
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700/50 transition-colors relative"
          aria-label="Announcements"
        >
          <BellIcon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          
          {/* Unread Badge */}
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </div>
          )}
        </button>
      </div>

      {/* ✅ FIXED: Initial Popup Notification - Better Positioning */}
      {showInitialPopup && unreadCount > 0 && (
        <div className="fixed top-20 right-4 z-30 animate-slide-in-right max-w-sm">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg shadow-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <BellIcon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm mb-1">
                  {unreadCount} New Update{unreadCount !== 1 ? 's' : ''}!
                </h4>
                <p className="text-xs text-cyan-100">
                  Check out what's new in MyMotoLog
                </p>
              </div>
              <button
                onClick={() => setShowInitialPopup(false)}
                className="flex-shrink-0 hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <button
              onClick={handleOpenModal}
              className="mt-3 w-full bg-white text-cyan-600 font-bold py-2 px-4 rounded-lg hover:bg-cyan-50 transition-colors text-sm"
            >
              View Announcements
            </button>
          </div>
        </div>
      )}

      {/* Announcement Modal */}
      {showModal && (
        <AnnouncementModal
          announcements={announcements}
          viewedAnnouncementIds={viewedAnnouncementIds}
          onClose={() => setShowModal(false)}
          onMarkAsViewed={handleMarkAsViewed}
          onMarkAllAsViewed={handleMarkAllAsViewed}
        />
      )}
    </>
  );
};

export default AnnouncementSystem;