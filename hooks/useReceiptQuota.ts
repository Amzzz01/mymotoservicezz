import { useState, useEffect } from 'react';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { ReceiptScanQuota } from '../types';

export const useReceiptQuota = () => {
  const [quota, setQuota] = useState<ReceiptScanQuota | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCurrentMonthKey = (): string => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };

  const getNextResetDate = (): Date => {
    const now = new Date();
    // Set to first day of next month at 00:00:00
    return new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0);
  };

  const fetchQuota = async () => {
    try {
      setLoading(true);
      const monthKey = getCurrentMonthKey();
      const quotaRef = doc(db, 'receiptScans', monthKey);
      const quotaDoc = await getDoc(quotaRef);

      if (quotaDoc.exists()) {
        const data = quotaDoc.data();
        setQuota({
          month: monthKey,
          scansUsed: data.scansUsed || 0,
          limit: data.limit || 250,
          lastReset: data.lastReset?.toDate() || new Date(),
          lastUpdated: data.lastUpdated?.toDate() || new Date()
        });
      } else {
        // Create initial quota document for this month
        const initialQuota: Omit<ReceiptScanQuota, 'lastReset' | 'lastUpdated'> = {
          month: monthKey,
          scansUsed: 0,
          limit: 250
        };
        
        await setDoc(quotaRef, {
          ...initialQuota,
          lastReset: serverTimestamp(),
          lastUpdated: serverTimestamp()
        });

        setQuota({
          ...initialQuota,
          lastReset: new Date(),
          lastUpdated: new Date()
        });
      }
      setError(null);
    } catch (err: any) {
      console.error('Error fetching receipt quota:', err);
      setError('Failed to load receipt scan quota');
    } finally {
      setLoading(false);
    }
  };

  const incrementQuota = async (): Promise<boolean> => {
    try {
      const monthKey = getCurrentMonthKey();
      const quotaRef = doc(db, 'receiptScans', monthKey);
      const quotaDoc = await getDoc(quotaRef);

      if (!quotaDoc.exists()) {
        // Create new quota document
        await setDoc(quotaRef, {
          month: monthKey,
          scansUsed: 1,
          limit: 250,
          lastReset: serverTimestamp(),
          lastUpdated: serverTimestamp()
        });
        
        await fetchQuota();
        return true;
      }

      const data = quotaDoc.data();
      const currentUsed = data.scansUsed || 0;
      const limit = data.limit || 250;

      if (currentUsed >= limit) {
        setError('Monthly scan limit reached');
        return false;
      }

      // Increment the counter
      await updateDoc(quotaRef, {
        scansUsed: currentUsed + 1,
        lastUpdated: serverTimestamp()
      });

      await fetchQuota();
      return true;
    } catch (err: any) {
      console.error('Error incrementing quota:', err);
      setError('Failed to update scan quota');
      return false;
    }
  };

  const getQuotaStatus = () => {
    if (!quota) return null;

    const remaining = quota.limit - quota.scansUsed;
    const percentage = (quota.scansUsed / quota.limit) * 100;
    
    let status: 'good' | 'warning' | 'danger' | 'exceeded';
    if (remaining <= 0) status = 'exceeded';
    else if (remaining < 10) status = 'danger';
    else if (remaining < 50) status = 'warning';
    else status = 'good';

    return {
      remaining,
      used: quota.scansUsed,
      limit: quota.limit,
      percentage,
      status,
      nextReset: getNextResetDate()
    };
  };

  useEffect(() => {
    fetchQuota();
  }, []);

  return {
    quota,
    loading,
    error,
    quotaStatus: getQuotaStatus(),
    incrementQuota,
    refreshQuota: fetchQuota
  };
};