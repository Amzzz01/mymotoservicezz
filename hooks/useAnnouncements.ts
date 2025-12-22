import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc,
  setDoc,
  getDoc,
  orderBy 
} from 'firebase/firestore';
import { db } from '../firebase';
import { Announcement, ViewedAnnouncement } from '../types';

export function useAnnouncements(userId: string) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [viewedAnnouncements, setViewedAnnouncements] = useState<ViewedAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch active announcements
  useEffect(() => {
    if (!userId) {
      setAnnouncements([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    const q = query(
      collection(db, 'announcements'),
      where('isActive', '==', true)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const announcementsData: Announcement[] = [];
        snapshot.forEach((doc) => {
          announcementsData.push({
            id: doc.id,
            ...doc.data()
          } as Announcement);
        });
        
        // Sort by priority (high > medium > low) then by date (newest first)
        announcementsData.sort((a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
          if (priorityDiff !== 0) return priorityDiff;
          
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        
        setAnnouncements(announcementsData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching announcements:', err);
        setError('Failed to load announcements: ' + err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  // Fetch user's viewed announcements
  useEffect(() => {
    if (!userId) {
      setViewedAnnouncements([]);
      return;
    }

    const viewedRef = doc(db, 'users', userId);
    
    const unsubscribe = onSnapshot(
      viewedRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const viewed = data.viewedAnnouncements || [];
          setViewedAnnouncements(viewed);
        } else {
          setViewedAnnouncements([]);
        }
      },
      (err) => {
        console.error('Error fetching viewed announcements:', err);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  // Calculate unread count
  useEffect(() => {
    const viewedIds = new Set(viewedAnnouncements.map(v => v.announcementId));
    const unread = announcements.filter(a => !viewedIds.has(a.id)).length;
    setUnreadCount(unread);
  }, [announcements, viewedAnnouncements]);

  // Mark announcement as viewed
  const markAsViewed = async (announcementId: string) => {
    if (!userId) return;

    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      const currentViewed: ViewedAnnouncement[] = userDoc.exists() 
        ? (userDoc.data().viewedAnnouncements || []) 
        : [];

      // Check if already viewed
      if (currentViewed.some(v => v.announcementId === announcementId)) {
        return;
      }

      // Add new viewed announcement
      const newViewed: ViewedAnnouncement = {
        announcementId,
        viewedAt: new Date().toISOString()
      };

      await setDoc(userRef, {
        viewedAnnouncements: [...currentViewed, newViewed]
      }, { merge: true });

    } catch (err) {
      console.error('Error marking announcement as viewed:', err);
      throw new Error('Failed to mark announcement as viewed');
    }
  };

  // Mark all announcements as viewed
  const markAllAsViewed = async () => {
    if (!userId || announcements.length === 0) return;

    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      const currentViewed: ViewedAnnouncement[] = userDoc.exists() 
        ? (userDoc.data().viewedAnnouncements || []) 
        : [];

      const currentViewedIds = new Set(currentViewed.map(v => v.announcementId));
      const now = new Date().toISOString();

      // Add any unviewed announcements
      const newViewed = announcements
        .filter(a => !currentViewedIds.has(a.id))
        .map(a => ({
          announcementId: a.id,
          viewedAt: now
        }));

      if (newViewed.length > 0) {
        await setDoc(userRef, {
          viewedAnnouncements: [...currentViewed, ...newViewed]
        }, { merge: true });
      }

    } catch (err) {
      console.error('Error marking all announcements as viewed:', err);
      throw new Error('Failed to mark all announcements as viewed');
    }
  };

  // Get unread announcements
  const getUnreadAnnouncements = () => {
    const viewedIds = new Set(viewedAnnouncements.map(v => v.announcementId));
    return announcements.filter(a => !viewedIds.has(a.id));
  };

  return {
    announcements,
    viewedAnnouncements,
    loading,
    error,
    unreadCount,
    markAsViewed,
    markAllAsViewed,
    getUnreadAnnouncements
  };
}