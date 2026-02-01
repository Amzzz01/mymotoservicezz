import React, { useState, useRef, useEffect } from 'react';
import { useReceiptQuota } from '../hooks/useReceiptQuota';
import { useReceiptScanner } from '../hooks/useReceiptScanner';
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

const WrenchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M19 5.5a4.5 4.5 0 01-4.791 4.49c-.873-.055-1.808.128-2.368.8l-6.024 7.23a2.724 2.724 0 11-3.837-3.837L9.21 8.16c.672-.56.855-1.495.8-2.368a4.5 4.5 0 015.873-4.575c.324.105.39.51.15.752L13.34 4.66a.455.455 0 00-.11.494 3.01 3.01 0 001.617 1.617c.17.07.363.02.493-.111l2.692-2.692c.241-.241.647-.174.752.15.14.435.216.9.216 1.382zM4 17a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
  </svg>
);

const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
  </svg>
);

const ExclamationTriangleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
  </svg>
);

const ReceiptScanner: React.FC<ReceiptScannerProps> = ({ onReceiptScanned, onCancel }) => {
  const { quotaStatus, incrementQuota, loading: quotaLoading } = useReceiptQuota();
  const { scanning, error: scanError, scannedData, scanReceiptImage, clearError } = useReceiptScanner();
  
  const [displayError, setDisplayError] = useState<string | null>(null);
  const [showQuotaWarning, setShowQuotaWarning] = useState(false);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle scanned data from the hook
  useEffect(() => {
    if (scannedData && currentFile) {
      console.log('✅ Receipt scanned successfully:', scannedData);
      
      // Convert ScannedReceiptData to ParsedReceiptData format
      const parsedData: ParsedReceiptData = {
        date: scannedData.date || new Date().toISOString().split('T')[0], // Fallback to today
        serviceDescription: scannedData.description || scannedData.serviceType || 'Maintenance Service', // Detailed items or service type
        partsCost: scannedData.cost || 0, // ✅ Put total cost here so it shows in form
        laborCost: 0, // User can split manually
        totalCost: scannedData.cost || 0,
        supplierName: (scannedData as any).vendor, // Vendor/shop name
        notes: scannedData.mileage ? `Mileage: ${scannedData.mileage} km` : undefined,
        confidence: {
          date: scannedData.date ? 0.8 : 0.3, // High confidence if date found
          amount: scannedData.cost ? 0.85 : 0.2, // High confidence if cost found
          overall: calculateOverallConfidence(scannedData),
        },
      };

      // Increment quota counter
      incrementQuota().then((quotaUpdated) => {
        if (!quotaUpdated) {
          console.warn('Failed to update scan quota');
        }
      });

      // Pass data back to parent
      onReceiptScanned(parsedData, currentFile);
      setCurrentFile(null);
    }
  }, [scannedData, currentFile, incrementQuota, onReceiptScanned]);

  // Calculate overall confidence based on what was extracted
  const calculateOverallConfidence = (data: typeof scannedData): number => {
    if (!data) return 0;
    
    let foundFields = 0;
    let totalFields = 5;
    
    if (data.date) foundFields++;
    if (data.cost) foundFields++;
    if (data.serviceType) foundFields++;
    if (data.description) foundFields++;
    if (data.mileage) foundFields++;
    
    return foundFields / totalFields;
  };

  // Handle errors from the hook
  useEffect(() => {
    if (scanError) {
      console.error('❌ Receipt scan error:', scanError);
      
      // Enhanced error message
      let userMessage = scanError;
      
      // Add helpful context for common errors
      if (scanError.includes('API key')) {
        userMessage = `${scanError}\n\n💡 Troubleshooting:\n• Check if VITE_GOOGLE_VISION_API_KEY is set in .env\n• Verify the API key is correct\n• Ensure Cloud Vision API is enabled in Google Cloud Console`;
      } else if (scanError.includes('quota') || scanError.includes('limit')) {
        userMessage = `${scanError}\n\n💡 You may have exceeded the free tier limit for this month.`;
      }
      
      setDisplayError(userMessage);
    }
  }, [scanError]);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Clear previous errors
    setDisplayError(null);
    clearError();

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setDisplayError('Please select an image file (JPG, PNG, etc.)');
      return;
    }

    // Validate file size (max 4MB for Google Vision API)
    if (file.size > 4 * 1024 * 1024) {
      setDisplayError('Image file is too large. Please select a file under 4MB.');
      return;
    }

    // Check quota status
    if (!quotaStatus) {
      setDisplayError('Unable to check scan quota. Please try again.');
      return;
    }

    if (quotaStatus.remaining <= 0) {
      setDisplayError(`Monthly scan limit reached (${quotaStatus.limit}/${quotaStatus.limit}). Resets on ${quotaStatus.nextReset.toLocaleDateString()}.`);
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
    setShowQuotaWarning(false);
    setDisplayError(null);
    clearError();
    setCurrentFile(file);

    console.log('🔍 Starting receipt scan with Google Cloud Vision...');
    console.log('📄 File:', file.name, `(${(file.size / 1024).toFixed(2)} KB)`);

    // Call the hook's scan function
    await scanReceiptImage(file);
  };

  const handleQuotaWarningContinue = () => {
    if (pendingFile) {
      performScan(pendingFile);
      setPendingFile(null);
    }
  };

  if (quotaLoading) {
    return (
      <div className="text-center py-8">
        <SpinnerIcon className="w-12 h-12 mx-auto text-cyan-400 mb-4" />
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  // Quota warning modal
  if (showQuotaWarning && quotaStatus) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-yellow-400">
          <ExclamationTriangleIcon className="w-8 h-8" />
          <h3 className="text-xl font-bold">Low Scan Quota</h3>
        </div>
        
        <div className="bg-slate-700/50 rounded-lg p-4 space-y-2">
          <p className="text-slate-300">
            You have only <strong className="text-yellow-400">{quotaStatus.remaining}</strong> scans remaining this month.
          </p>
          <p className="text-sm text-slate-400">
            Your quota will reset on {quotaStatus.nextReset.toLocaleDateString()}.
          </p>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={() => {
              setShowQuotaWarning(false);
              setPendingFile(null);
            }}
            className="px-4 py-2 text-slate-300 hover:bg-slate-700 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleQuotaWarningContinue}
            className="px-4 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-md hover:bg-cyan-400 transition-colors"
          >
            Continue Anyway
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Quota Status */}
      {quotaStatus && (
        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-slate-300">Receipt Scans This Month</h4>
            <button
              onClick={() => setShowDebugPanel(!showDebugPanel)}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <WrenchIcon className="w-4 h-4" />
              {showDebugPanel ? 'Hide' : 'Show'} Debug
            </button>
          </div>
          <div className="flex items-center justify-between text-lg font-bold">
            <span className={quotaStatus.status === 'danger' ? 'text-red-400' : quotaStatus.status === 'warning' ? 'text-yellow-400' : 'text-green-400'}>
              {quotaStatus.used}/{quotaStatus.limit}
            </span>
            <span className="text-slate-400 text-sm">
              Resets {quotaStatus.nextReset.toLocaleDateString()}
            </span>
          </div>
          <div className="mt-2 bg-slate-600 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full transition-all ${
                quotaStatus.status === 'danger' ? 'bg-red-500' : 
                quotaStatus.status === 'warning' ? 'bg-yellow-500' : 
                'bg-green-500'
              }`}
              style={{ width: `${quotaStatus.percentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Debug Panel */}
      {showDebugPanel && (
        <div className="bg-slate-700/50 rounded-lg p-4 space-y-3 border border-slate-600">
          <h4 className="text-sm font-semibold text-cyan-400 flex items-center gap-2">
            <WrenchIcon className="w-4 h-4" />
            Google Cloud Vision API Info
          </h4>
          
          <div className="text-xs text-slate-400 space-y-1">
            <p>💡 <strong>Tip:</strong> Check browser console (F12) for detailed logs</p>
            <p>📋 <strong>API:</strong> Google Cloud Vision API (Text Detection)</p>
            <p>🔑 <strong>Auth:</strong> API Key authentication</p>
            <p>📊 <strong>Free Tier:</strong> 1,000 units/month (~200 receipt scans)</p>
            <p>📏 <strong>Max Size:</strong> 4MB per image</p>
          </div>

          <div className="p-3 rounded-md bg-cyan-900/30 border border-cyan-600">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircleIcon className="w-5 h-5 text-cyan-400" />
              <span className="font-semibold text-cyan-300">Using Google Cloud Vision</span>
            </div>
            <p className="text-sm text-slate-300">Receipt scanning powered by Google Cloud Vision API for accurate OCR extraction.</p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {displayError && (
        <div className="bg-red-900/30 border border-red-600 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-red-300 mb-1">Scan Failed</h4>
              <p className="text-sm text-red-200 whitespace-pre-line">{displayError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Scanner Interface */}
      {!scanning ? (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-bold text-cyan-400 mb-2">Scan Receipt</h3>
            <p className="text-slate-400 text-sm mb-4">
              Take a photo or upload an image of your maintenance receipt. We'll automatically extract the details for you.
            </p>
          </div>

          {/* Camera Button */}
          <div className="bg-slate-700/30 border-2 border-dashed border-slate-600 rounded-lg p-6 hover:border-cyan-500 transition-colors group cursor-pointer">
            <label htmlFor="camera-input" className="cursor-pointer flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-slate-700 group-hover:bg-slate-600 transition-colors flex items-center justify-center mb-3">
                <CameraIcon className="w-12 h-12 text-cyan-400" />
              </div>
              <span className="text-lg font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">
                Take Photo
              </span>
              <span className="text-sm text-slate-400 mt-1">Use camera</span>
              <input
                id="camera-input"
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
          </div>

          {/* Upload Button */}
          <div className="bg-slate-700/30 border-2 border-dashed border-slate-600 rounded-lg p-6 hover:border-cyan-500 transition-colors group cursor-pointer">
            <label htmlFor="file-input" className="cursor-pointer flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-slate-700 group-hover:bg-slate-600 transition-colors flex items-center justify-center mb-3">
                <UploadIcon className="w-12 h-12 text-cyan-400" />
              </div>
              <span className="text-lg font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">
                Upload Image
              </span>
              <span className="text-sm text-slate-400 mt-1">From gallery</span>
              <input
                id="file-input"
                ref={fileInputRef}
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
            Extracting maintenance details from your receipt using Google Cloud Vision
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-slate-500 text-xs">
            <span className="animate-pulse">●</span>
            <span>This usually takes 1-3 seconds</span>
          </div>
          <div className="mt-4 text-xs text-slate-500">
            Check console for detailed progress...
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiptScanner;