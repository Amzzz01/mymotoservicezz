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
  orderBy,
  getDocs
} from 'firebase/firestore';
import { db } from '../firebase';
import { Vehicle } from '../types';

export function useVehicles(userId: string) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [activeVehicle, setActiveVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setVehicles([]);
      setActiveVehicle(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Simple query without orderBy to avoid indexing issues initially
    const q = query(
      collection(db, 'vehicles'),
      where('userId', '==', userId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const vehiclesData: Vehicle[] = [];
        snapshot.forEach((doc) => {
          vehiclesData.push({
            id: doc.id,
            ...doc.data()
          } as Vehicle);
        });
        
        // Sort locally by createdAt
        vehiclesData.sort((a, b) => {
          const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bTime - aTime;
        });
        
        setVehicles(vehiclesData);
        
        // Set active vehicle (either the one marked active or the first one)
        const active = vehiclesData.find(v => v.isActive) || vehiclesData[0] || null;
        setActiveVehicle(active);
        
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching vehicles:', err);
        setError('Failed to load vehicles: ' + err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  const addVehicle = async (vehicle: Omit<Vehicle, 'id' | 'createdAt'>) => {
    try {
      // If this is the first vehicle, make it active
      const isFirstVehicle = vehicles.length === 0;
      
      await addDoc(collection(db, 'vehicles'), {
        ...vehicle,
        isActive: isFirstVehicle || vehicle.isActive,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error('Error adding vehicle:', err);
      throw new Error('Failed to add vehicle');
    }
  };

  const updateVehicle = async (id: string, updates: Partial<Vehicle>) => {
    try {
      await updateDoc(doc(db, 'vehicles', id), updates);
    } catch (err) {
      console.error('Error updating vehicle:', err);
      throw new Error('Failed to update vehicle');
    }
  };

  const deleteVehicle = async (id: string) => {
    try {
      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Delete associated maintenance records - ADD userId to query
      const recordsQuery = query(
        collection(db, 'maintenanceRecords'),
        where('vehicleId', '==', id),
        where('userId', '==', userId)  // IMPORTANT: Filter by userId
      );
      const recordsSnapshot = await getDocs(recordsQuery);
      
      if (recordsSnapshot.docs.length > 0) {
        const deleteRecordsPromises = recordsSnapshot.docs.map(docSnap => 
          deleteDoc(doc(db, 'maintenanceRecords', docSnap.id))
        );
        await Promise.all(deleteRecordsPromises);
      }
      
      // Delete associated reminders - ADD userId to query
      const remindersQuery = query(
        collection(db, 'reminders'),
        where('vehicleId', '==', id),
        where('userId', '==', userId)  // IMPORTANT: Filter by userId
      );
      const remindersSnapshot = await getDocs(remindersQuery);
      
      if (remindersSnapshot.docs.length > 0) {
        const deleteRemindersPromises = remindersSnapshot.docs.map(docSnap => 
          deleteDoc(doc(db, 'reminders', docSnap.id))
        );
        await Promise.all(deleteRemindersPromises);
      }
      
      // Finally, delete the vehicle itself
      await deleteDoc(doc(db, 'vehicles', id));
      
      // If this was the only vehicle, clear active vehicle
      if (vehicles.length === 1) {
        setActiveVehicle(null);
      }
    } catch (err: any) {
      console.error('Error deleting vehicle:', err);
      throw new Error('Failed to delete vehicle: ' + (err.message || 'Unknown error'));
    }
  };

  const setActive = async (id: string) => {
    try {
      // Set all vehicles to inactive
      const updatePromises = vehicles.map(v => 
        updateDoc(doc(db, 'vehicles', v.id), { isActive: v.id === id })
      );
      await Promise.all(updatePromises);
    } catch (err) {
      console.error('Error setting active vehicle:', err);
      throw new Error('Failed to set active vehicle');
    }
  };

  const updateOdometer = async (id: string, newOdometer: number) => {
    try {
      await updateDoc(doc(db, 'vehicles', id), { currentOdometer: newOdometer });
    } catch (err) {
      console.error('Error updating odometer:', err);
      throw new Error('Failed to update odometer');
    }
  };

  return { 
    vehicles, 
    activeVehicle, 
    loading, 
    error, 
    addVehicle, 
    updateVehicle, 
    deleteVehicle,
    setActive,
    updateOdometer
  };
}