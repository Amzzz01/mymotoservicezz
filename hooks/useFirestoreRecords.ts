import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc,
  serverTimestamp,
  orderBy 
} from 'firebase/firestore';
import { db } from '../firebase';
import { MaintenanceRecord } from '../types';

export function useFirestoreRecords(userId: string) {
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setRecords([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Create a query to get records for this user, ordered by date descending
    const q = query(
      collection(db, 'maintenanceRecords'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const recordsData: MaintenanceRecord[] = [];
        snapshot.forEach((doc) => {
          recordsData.push({
            id: doc.id,
            ...doc.data()
          } as MaintenanceRecord);
        });
        setRecords(recordsData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching records:', err);
        setError('Failed to load maintenance records');
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [userId]);

  const addRecord = async (record: Omit<MaintenanceRecord, 'id'>, userId: string) => {
    try {
      await addDoc(collection(db, 'maintenanceRecords'), {
        ...record,
        userId,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error('Error adding record:', err);
      throw new Error('Failed to add maintenance record');
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'maintenanceRecords', id));
    } catch (err) {
      console.error('Error deleting record:', err);
      throw new Error('Failed to delete maintenance record');
    }
  };

  return { records, loading, error, addRecord, deleteRecord };
}
