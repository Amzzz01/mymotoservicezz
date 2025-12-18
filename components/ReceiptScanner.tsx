import React, { useState, useRef } from 'react';
import { useReceiptQuota } from '../hooks/useReceiptQuota';
import { scanReceiptWithMindee } from '../utils/mindeeApi';
import { ParsedReceiptData } from '../types';

interface ReceiptScannerProps {
  onReceiptScanned: (data: ParsedReceiptData, imageFile: File) => void;
  onCancel: () => void;
}

const CameraIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M1 8a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 018.07 3h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0016.07 6H17a2 2 0 012 2v7a2 2 0 01-2 2H3a2 2 0 01-2-2V8zm13.5 3a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM10 14a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
  </svg>
);

const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
  </svg>
);

const SpinnerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const ReceiptScanner: React.FC<ReceiptScannerProps> = ({ onReceiptScanned, onCancel }) => {
  const { quotaStatus, incrementQuota, loading: quotaLoading } = useReceiptQuota();
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showQuotaWarning, setShowQuotaWarning] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, etc.)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image file is too large. Please select a file under 10MB.');
      return;
    }

    // Check quota status
    if (!quotaStatus) {
      setError('Unable to check scan quota. Please try again.');
      return;
    }

    if (quotaStatus.remaining <= 0) {
      setError(`Monthly scan limit reached (${quotaStatus.limit}/${quotaStatus.limit}). Resets on ${quotaStatus.nextReset.toLocaleDateString()}.`);
      return;
    }

    // Show warning if low on scans
    if (quotaStatus.remaining < 10) {
      setPendingFile(file);
      setShowQuotaWarning(true);
      return;
    }

    // Proceed with scanning
    await performScan(file);
  };

  const performScan = async (file: File) => {
    setScanning(true);
    setError(null);
    setShowQuotaWarning(false);

    try {
      // Call Mindee API
      const receiptData = await scanReceiptWithMindee(file);

      // Increment quota counter
      const quotaUpdated = await incrementQuota();
      
      if (!quotaUpdated) {
        throw new Error('Failed to update scan quota');
      }

      // Pass data back to parent
      onReceiptScanned(receiptData, file);
    } catch (err: any) {
      console.error('Receipt scan error:', err);
      setError(err.message || 'Failed to scan receipt. Please try again or enter manually.');
    } finally {
      setScanning(false);
      setPendingFile(null);
    }
  };

  const handleWarningConfirm = async () => {
    if (pendingFile) {
      await performScan(pendingFile);
    }
  };

  const handleWarningCancel = () => {
    setShowQuotaWarning(false);
    setPendingFile(null);
  };

  const getQuotaColor = () => {
    if (!quotaStatus) return 'text-slate-400';
    switch (quotaStatus.status) {
      case 'good': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'danger': return 'text-red-400';
      case 'exceeded': return 'text-red-500';
      default: return 'text-slate-400';
    }
  };

  const getQuotaIcon = () => {
    if (!quotaStatus) return '📊';
    switch (quotaStatus.status) {
      case 'good': return '✅';
      case 'warning': return '⚠️';
      case 'danger': return '🚨';
      case 'exceeded': return '❌';
      default: return '📊';
    }
  };

  if (quotaLoading) {
    return (
      <div className="bg-slate-800 p-6 rounded-lg text-center">
        <SpinnerIcon className="w-8 h-8 mx-auto text-cyan-400" />
        <p className="text-slate-400 mt-2">Loading scan quota...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-2xl">
      {/* Quota Display */}
      {quotaStatus && (
        <div className="mb-6 p-4 bg-slate-700 rounded-lg border border-slate-600">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getQuotaIcon()}</span>
              <span className="text-sm font-medium text-slate-300">Receipt Scans This Month</span>
            </div>
            <span className={`text-lg font-bold ${getQuotaColor()}`}>
              {quotaStatus.remaining}/{quotaStatus.limit}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-slate-600 rounded-full h-2.5 overflow-hidden">
            <div 
              className={`h-2.5 rounded-full transition-all duration-300 ${
                quotaStatus.status === 'good' ? 'bg-green-500' :
                quotaStatus.status === 'warning' ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${Math.min(quotaStatus.percentage, 100)}%` }}
            />
          </div>
          
          <p className="text-xs text-slate-400 mt-2">
            Resets on {quotaStatus.nextReset.toLocaleDateString()}
          </p>
        </div>
      )}

      {/* Warning Dialog */}
      {showQuotaWarning && quotaStatus && (
        <div className="mb-6 p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <h3 className="text-yellow-400 font-bold mb-2">Low Scan Quota Warning</h3>
              <p className="text-yellow-200 text-sm mb-3">
                You only have <strong>{quotaStatus.remaining} scans</strong> remaining this month. 
                Do you want to continue?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleWarningConfirm}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-md text-sm font-medium transition-colors"
                >
                  Yes, Continue
                </button>
                <button
                  onClick={handleWarningCancel}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-md text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Scanner UI */}
      {!scanning ? (
        <div>
          <h3 className="text-xl font-bold text-cyan-400 mb-4">Scan Receipt</h3>
          <p className="text-slate-400 text-sm mb-6">
            Take a photo or upload an image of your maintenance receipt. 
            We'll automatically extract the details for you.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Camera Capture (Mobile) */}
            <label className="flex flex-col items-center justify-center p-6 bg-slate-700 hover:bg-slate-600 border-2 border-dashed border-slate-500 hover:border-cyan-500 rounded-lg cursor-pointer transition-all duration-300 group">
              <CameraIcon className="w-12 h-12 text-slate-400 group-hover:text-cyan-400 mb-2" />
              <span className="text-slate-300 font-medium">Take Photo</span>
              <span className="text-slate-500 text-xs mt-1">Use camera</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
                className="hidden"
              />
            </label>

            {/* File Upload */}
            <label className="flex flex-col items-center justify-center p-6 bg-slate-700 hover:bg-slate-600 border-2 border-dashed border-slate-500 hover:border-cyan-500 rounded-lg cursor-pointer transition-all duration-300 group">
              <UploadIcon className="w-12 h-12 text-slate-400 group-hover:text-cyan-400 mb-2" />
              <span className="text-slate-300 font-medium">Upload Image</span>
              <span className="text-slate-500 text-xs mt-1">From gallery</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
                className="hidden"
              />
            </label>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-slate-300 hover:bg-slate-700 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <SpinnerIcon className="w-16 h-16 mx-auto text-cyan-400 mb-4" />
          <h3 className="text-xl font-bold text-cyan-400 mb-2">Scanning Receipt...</h3>
          <p className="text-slate-400 text-sm">
            Extracting maintenance details from your receipt
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-slate-500 text-xs">
            <span className="animate-pulse">●</span>
            <span>This usually takes 1-2 seconds</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiptScanner;