import { useState } from 'react';
import { scanReceipt } from '../services/receiptScanner';
import { ScannedReceiptData } from '../types';

interface UseReceiptScannerReturn {
  scanning: boolean;
  error: string | null;
  scannedData: ScannedReceiptData | null;
  scanReceiptImage: (file: File) => Promise<void>;
  clearError: () => void;
  clearData: () => void;
}

/**
 * Hook for scanning receipts using Google Cloud Vision API
 */
export function useReceiptScanner(): UseReceiptScannerReturn {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scannedData, setScannedData] = useState<ScannedReceiptData | null>(null);

  const scanReceiptImage = async (file: File) => {
    // Validate file
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Check file size (max 4MB for Vision API)
    const maxSize = 4 * 1024 * 1024; // 4MB
    if (file.size > maxSize) {
      setError('Image is too large. Please select an image under 4MB');
      return;
    }

    setScanning(true);
    setError(null);
    setScannedData(null);

    try {
      const data = await scanReceipt(file);
      setScannedData(data);
      
      // Log what was found for user feedback
      const foundFields = [];
      if (data.date) foundFields.push('date');
      if (data.cost) foundFields.push('cost');
      if (data.serviceType) foundFields.push('service type');
      if (data.description) foundFields.push('vendor');
      if (data.mileage) foundFields.push('mileage');
      
      console.log('Successfully extracted:', foundFields.join(', '));
      
      if (foundFields.length === 0) {
        setError('Could not extract receipt data. Please enter details manually or try a clearer image.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to scan receipt';
      setError(errorMessage);
      console.error('Receipt scan error:', err);
    } finally {
      setScanning(false);
    }
  };

  const clearError = () => setError(null);
  const clearData = () => setScannedData(null);

  return {
    scanning,
    error,
    scannedData,
    scanReceiptImage,
    clearError,
    clearData,
  };
}