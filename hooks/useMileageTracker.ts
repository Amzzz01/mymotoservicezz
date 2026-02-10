import { useState, useEffect, useMemo } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { MileageLog, MileageStats } from '../types';

export function useMileageTracker(userId: string | undefined, vehicleId?: string) {
  const [logs, setLogs] = useState<MileageLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLogs([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    let q;
    if (vehicleId) {
      q = query(
        collection(db, 'mileageLogs'),
        where('userId', '==', userId),
        where('vehicleId', '==', vehicleId)
      );
    } else {
      q = query(
        collection(db, 'mileageLogs'),
        where('userId', '==', userId)
      );
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const logsData: MileageLog[] = [];
        snapshot.forEach((docSnap) => {
          logsData.push({
            id: docSnap.id,
            ...docSnap.data()
          } as MileageLog);
        });

        // Sort by odometer descending (most recent first)
        logsData.sort((a, b) => b.odometer - a.odometer);

        setLogs(logsData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching mileage logs:', err);
        setError('Failed to load mileage logs: ' + err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId, vehicleId]);

  // Compute stats
  const stats: MileageStats = useMemo(() => {
    if (logs.length === 0) {
      return {
        totalDistance: 0,
        avgDailyKm: 0,
        avgMonthlyKm: 0,
        totalFuelCost: 0,
        totalFuelLiters: 0,
        avgFuelEfficiency: 0,
        avgFuelCostPerKm: 0,
        fuelLogCount: 0,
      };
    }

    // Sorted ascending by odometer for calculations
    const sorted = [...logs].sort((a, b) => a.odometer - b.odometer);
    const totalDistance = sorted[sorted.length - 1].odometer - sorted[0].odometer;

    // Date range for daily/monthly averages
    const dates = sorted.map(l => new Date(l.date).getTime());
    const dayRange = Math.max(1, (Math.max(...dates) - Math.min(...dates)) / (1000 * 60 * 60 * 24));
    const avgDailyKm = totalDistance / dayRange;
    const avgMonthlyKm = avgDailyKm * 30;

    // Fuel stats
    const fuelLogs = sorted.filter(l => l.isFuelStop && l.fuelAmount && l.fuelAmount > 0);
    const totalFuelCost = fuelLogs.reduce((sum, l) => sum + (l.fuelCost || 0), 0);
    const totalFuelLiters = fuelLogs.reduce((sum, l) => sum + (l.fuelAmount || 0), 0);

    // Fuel efficiency: calculate between consecutive fuel stops
    let totalEfficiencyKm = 0;
    let totalEfficiencyLiters = 0;
    for (let i = 1; i < fuelLogs.length; i++) {
      const dist = fuelLogs[i].odometer - fuelLogs[i - 1].odometer;
      const liters = fuelLogs[i].fuelAmount || 0;
      if (dist > 0 && liters > 0) {
        totalEfficiencyKm += dist;
        totalEfficiencyLiters += liters;
      }
    }
    const avgFuelEfficiency = totalEfficiencyLiters > 0
      ? totalEfficiencyKm / totalEfficiencyLiters
      : 0;

    const avgFuelCostPerKm = totalDistance > 0 ? totalFuelCost / totalDistance : 0;

    return {
      totalDistance,
      avgDailyKm,
      avgMonthlyKm,
      totalFuelCost,
      totalFuelLiters,
      avgFuelEfficiency,
      avgFuelCostPerKm,
      fuelLogCount: fuelLogs.length,
    };
  }, [logs]);

  // Distance between entries (sorted by odometer descending for display)
  const logsWithDistance = useMemo(() => {
    const sorted = [...logs].sort((a, b) => b.odometer - a.odometer);
    return sorted.map((log, i) => {
      const nextLog = sorted[i + 1]; // previous in odometer order
      const distanceSinceLast = nextLog ? log.odometer - nextLog.odometer : null;
      return { ...log, distanceSinceLast };
    });
  }, [logs]);

  const addLog = async (log: Omit<MileageLog, 'id' | 'createdAt'>) => {
    try {
      if (!userId) throw new Error('User not authenticated');

      const cleanLog: any = { ...log, userId, createdAt: new Date().toISOString() };
      // Remove undefined values
      Object.keys(cleanLog).forEach(key => {
        if (cleanLog[key] === undefined) delete cleanLog[key];
      });

      await addDoc(collection(db, 'mileageLogs'), cleanLog);
    } catch (err: any) {
      console.error('Error adding mileage log:', err);
      throw new Error('Failed to add mileage log: ' + (err.message || 'Unknown error'));
    }
  };

  const updateLog = async (id: string, updates: Partial<MileageLog>) => {
    try {
      const cleanUpdates: any = {};
      Object.keys(updates).forEach(key => {
        const value = (updates as any)[key];
        if (value !== undefined) cleanUpdates[key] = value;
      });
      await updateDoc(doc(db, 'mileageLogs', id), cleanUpdates);
    } catch (err) {
      console.error('Error updating mileage log:', err);
      throw new Error('Failed to update mileage log');
    }
  };

  const deleteLog = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'mileageLogs', id));
    } catch (err) {
      console.error('Error deleting mileage log:', err);
      throw new Error('Failed to delete mileage log');
    }
  };

  return {
    logs,
    logsWithDistance,
    stats,
    loading,
    error,
    addLog,
    updateLog,
    deleteLog,
  };
}
