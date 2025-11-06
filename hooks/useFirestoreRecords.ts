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
import { MaintenanceRecord, CostSummary } from '../types';

export function useFirestoreRecords(userId: string, vehicleId?: string) {
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [costSummary, setCostSummary] = useState<CostSummary>({
    totalParts: 0,
    totalLabor: 0,
    totalCost: 0,
    recordCount: 0,
    averageCostPerService: 0
  });

  useEffect(() => {
    if (!userId) {
      setRecords([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    let q;
    
    // Filter by vehicle if specified
    if (vehicleId) {
      q = query(
        collection(db, 'maintenanceRecords'),
        where('userId', '==', userId),
        where('vehicleId', '==', vehicleId)
      );
    } else {
      q = query(
        collection(db, 'maintenanceRecords'),
        where('userId', '==', userId)
      );
    }

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
        
        // Sort locally by date (descending)
        recordsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        setRecords(recordsData);
        
        // Calculate cost summary
        const summary = calculateCostSummary(recordsData);
        setCostSummary(summary);
        
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching records:', err);
        setError('Failed to load maintenance records: ' + err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId, vehicleId]);

  const calculateCostSummary = (records: MaintenanceRecord[]): CostSummary => {
    const totalParts = records.reduce((sum, r) => sum + (r.partsCost || 0), 0);
    const totalLabor = records.reduce((sum, r) => sum + (r.laborCost || 0), 0);
    const totalCost = totalParts + totalLabor;
    const recordCount = records.length;
    const averageCostPerService = recordCount > 0 ? totalCost / recordCount : 0;

    return {
      totalParts,
      totalLabor,
      totalCost,
      recordCount,
      averageCostPerService
    };
  };

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

  const updateRecord = async (id: string, updates: Partial<MaintenanceRecord>) => {
    try {
      await updateDoc(doc(db, 'maintenanceRecords', id), updates);
    } catch (err) {
      console.error('Error updating record:', err);
      throw new Error('Failed to update maintenance record');
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

  return { 
    records, 
    loading, 
    error, 
    costSummary,
    addRecord, 
    updateRecord,
    deleteRecord 
  };
}