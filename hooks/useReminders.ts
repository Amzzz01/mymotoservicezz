import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  updateDoc,
  doc,
  serverTimestamp,
  orderBy 
} from 'firebase/firestore';
import { db } from '../firebase';
import { Reminder, Vehicle } from '../types';

export function useReminders(userId: string, vehicleId?: string) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setReminders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    let q;

    // Filter by vehicle if specified
    if (vehicleId) {
      q = query(
        collection(db, 'reminders'),
        where('userId', '==', userId),
        where('vehicleId', '==', vehicleId)
      );
    } else {
      q = query(
        collection(db, 'reminders'),
        where('userId', '==', userId)
      );
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const remindersData: Reminder[] = [];
        snapshot.forEach((doc) => {
          remindersData.push({
            id: doc.id,
            ...doc.data()
          } as Reminder);
        });
        
        // Sort locally by createdAt (descending)
        remindersData.sort((a, b) => {
          const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bTime - aTime;
        });
        
        setReminders(remindersData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching reminders:', err);
        setError('Failed to load reminders: ' + err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId, vehicleId]);

  const addReminder = async (reminder: Omit<Reminder, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, 'reminders'), {
        ...reminder,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error('Error adding reminder:', err);
      throw new Error('Failed to add reminder');
    }
  };

  const updateReminder = async (id: string, updates: Partial<Reminder>) => {
    try {
      await updateDoc(doc(db, 'reminders', id), updates);
    } catch (err) {
      console.error('Error updating reminder:', err);
      throw new Error('Failed to update reminder');
    }
  };

  const deleteReminder = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'reminders', id));
    } catch (err) {
      console.error('Error deleting reminder:', err);
      throw new Error('Failed to delete reminder');
    }
  };

  const dismissReminder = async (id: string) => {
    try {
      await updateDoc(doc(db, 'reminders', id), { 
        dismissed: true,
        lastTriggered: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error dismissing reminder:', err);
      throw new Error('Failed to dismiss reminder');
    }
  };

  const checkReminders = (vehicle: Vehicle) => {
    const today = new Date();
    const activeReminders: Reminder[] = [];

    reminders.forEach(reminder => {
      if (!reminder.isActive || reminder.dismissed) return;

      // Check time-based reminders
      if (reminder.dueDate) {
        const dueDate = new Date(reminder.dueDate);
        if (dueDate <= today) {
          activeReminders.push(reminder);
        }
      }

      // Check mileage-based reminders
      if (reminder.dueMileage && vehicle.currentOdometer >= reminder.dueMileage) {
        activeReminders.push(reminder);
      }
    });

    return activeReminders;
  };

  return { 
    reminders, 
    loading, 
    error, 
    addReminder, 
    updateReminder, 
    deleteReminder,
    dismissReminder,
    checkReminders
  };
}