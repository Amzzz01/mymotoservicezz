import { ScannedReceiptData } from '../types';

const GOOGLE_VISION_API_KEY = import.meta.env.VITE_GOOGLE_VISION_API_KEY;
const GOOGLE_VISION_ENDPOINT = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`;

interface VisionApiResponse {
  responses: Array<{
    textAnnotations?: Array<{
      description: string;
      locale?: string;
    }>;
    fullTextAnnotation?: {
      text: string;
    };
    error?: {
      code: number;
      message: string;
    };
  }>;
}

/**
 * Convert image file to base64 string for Vision API
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Convert various date formats to YYYY-MM-DD format
 */
function convertToStandardDate(dateStr: string): string {
  // Try DD/MM/YYYY format (Malaysian/European)
  const ddmmyyyyMatch = dateStr.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (ddmmyyyyMatch) {
    const day = ddmmyyyyMatch[1].padStart(2, '0');
    const month = ddmmyyyyMatch[2].padStart(2, '0');
    const year = ddmmyyyyMatch[3];
    return `${year}-${month}-${day}`;
  }

  // Try YYYY/MM/DD or YYYY-MM-DD format (already standard or close)
  const yyyymmddMatch = dateStr.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
  if (yyyymmddMatch) {
    const year = yyyymmddMatch[1];
    const month = yyyymmddMatch[2].padStart(2, '0');
    const day = yyyymmddMatch[3].padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Try text dates like "Jan 15, 2024" or "15 Jan 2024"
  const monthNames = {
    jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
    jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12'
  };

  const textDateMatch1 = dateStr.match(/(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d{4})/i);
  if (textDateMatch1) {
    const day = textDateMatch1[1].padStart(2, '0');
    const month = monthNames[textDateMatch1[2].toLowerCase().substring(0, 3) as keyof typeof monthNames];
    const year = textDateMatch1[3];
    return `${year}-${month}-${day}`;
  }

  const textDateMatch2 = dateStr.match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d{1,2}),?\s+(\d{4})/i);
  if (textDateMatch2) {
    const month = monthNames[textDateMatch2[1].toLowerCase().substring(0, 3) as keyof typeof monthNames];
    const day = textDateMatch2[2].padStart(2, '0');
    const year = textDateMatch2[3];
    return `${year}-${month}-${day}`;
  }

  // If no match, return original (fallback)
  return dateStr;
}

/**
 * Extract date from text using various patterns
 */
function extractDate(text: string): string | undefined {
  const datePatterns = [
    // DD/MM/YYYY HH:MM:SS (with timestamp) - Malaysian format
    /\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})\s+\d{1,2}:\d{2}(?::\d{2})?\b/,
    // DD/MM/YYYY or DD-MM-YYYY
    /\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})\b/,
    // YYYY/MM/DD or YYYY-MM-DD
    /\b(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})\b/,
    // DD MMM YYYY (e.g., 15 Jan 2024)
    /\b(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{4})\b/i,
    // MMM DD, YYYY (e.g., Jan 15, 2024)
    /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{1,2}),?\s+(\d{4})\b/i,
  ];

  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      // Extract just the date part (remove time if present)
      const dateStr = match[0].split(' ')[0];
      // Convert to standard YYYY-MM-DD format
      return convertToStandardDate(dateStr);
    }
  }

  return undefined;
}

/**
 * Extract cost/amount from text
 */
function extractCost(text: string): number | undefined {
  const costPatterns = [
    // Grand Total / Grant Total (Malaysian receipts often misspell)
    /(?:grand|grant)\s*total[:\s]*[RM$€£¥]*\s*(\d+[,.]?\d*\.?\d{2})/i,
    // Total: RM 150.00 or Total: $150.00
    /total[:\s]*[RM$€£¥]*\s*(\d+[,.]?\d*\.?\d{2})/i,
    // Amount: 150.00
    /amount[:\s]*[RM$€£¥]*\s*(\d+[,.]?\d*\.?\d{2})/i,
    // RM 150.00 or $150.00 (standalone) - last resort
    /[RM$€£¥]\s*(\d+[,.]?\d*\.?\d{2})/,
    // Just numbers with 2 decimal places (very last resort)
    /\b(\d+\.\d{2})\b/,
  ];

  for (const pattern of costPatterns) {
    const match = text.match(pattern);
    if (match) {
      const numStr = match[1].replace(/,/g, '');
      const num = parseFloat(numStr);
      if (!isNaN(num) && num > 0) {
        return num;
      }
    }
  }

  return undefined;
}

/**
 * Extract service type from text
 */
function extractServiceType(text: string): string | undefined {
  const serviceKeywords = [
    'oil change',
    'engine oil',
    'brake',
    'tire',
    'tyre',
    'battery',
    'chain',
    'filter',
    'spark plug',
    'coolant',
    'service',
    'maintenance',
    'repair',
    'inspection',
    'labour',
    'labor',
  ];

  const lowerText = text.toLowerCase();
  for (const keyword of serviceKeywords) {
    if (lowerText.includes(keyword)) {
      // Capitalize first letter of each word
      return keyword.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
  }

  return undefined;
}

/**
 * Extract detailed service description from line items
 * Looks for itemized lists and combines them into a readable description
 */
function extractDetailedDescription(text: string): string | undefined {
  const lines = text.split('\n');
  const items: string[] = [];
  
  // Patterns for line items (common in receipts)
  const itemPatterns = [
    // Pattern: 1) LB21 - HONDA FULLY 4T 10W40...
    /^\s*\d+\)\s*[A-Z0-9]+\s*[-–]\s*([A-Z0-9\s\-\/\(\)]+?)(?:\s+\d+\.\d{2}|$)/i,
    // Pattern: number) ITEM NAME (without code)
    /^\s*\d+\)\s*([A-Z][A-Z0-9\s\-\/\(\)]{8,})(?:\s+\d+\.\d{2}|$)/i,
    // Pattern: - ITEM NAME RM XX.XX
    /^[\-\*]\s*([A-Z0-9\s\-\/\(\)]+?)(?:\s+RM|\s+\d+\.\d{2})/i,
  ];

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Skip empty lines and lines that are too short
    if (!trimmedLine || trimmedLine.length < 8) continue;
    
    // Skip headers and footers
    if (/^(item|description|qty|quantity|price|total|subtotal|tax|discount|summary|count|thank\s*you)/i.test(trimmedLine)) continue;
    
    // Try each pattern
    for (const pattern of itemPatterns) {
      const match = trimmedLine.match(pattern);
      if (match) {
        let itemName = match[1].trim();
        
        // Clean up the item name
        itemName = itemName
          .replace(/\s+/g, ' ')  // Multiple spaces to single
          .replace(/[_]+/g, ' ')  // Underscores to spaces
          .replace(/\s*-\s*/g, ' ')  // Normalize dashes
          .trim();
        
        // Skip if it's too short after cleanup
        if (itemName.length < 5) continue;
        
        // Clean up case: capitalize first letter of each word
        itemName = itemName
          .toLowerCase()
          .split(' ')
          .map(word => {
            // Keep acronyms like RM, FS, SL/MA uppercase
            if (word.length <= 3 && /^[A-Z]+$/.test(word.toUpperCase())) {
              return word.toUpperCase();
            }
            return word.charAt(0).toUpperCase() + word.slice(1);
          })
          .join(' ');
        
        // Avoid duplicates
        if (!items.some(existing => existing.toLowerCase() === itemName.toLowerCase())) {
          items.push(itemName);
        }
        break;
      }
    }
  }

  // Return combined description
  if (items.length > 0) {
    return items.join(', ');
  }

  return undefined;
}

/**
 * Extract mileage from text
 */
function extractMileage(text: string): number | undefined {
  const mileagePatterns = [
    /(?:mileage|odometer|odo)[:\s]*(\d+[,]?\d*)\s*(?:km|miles?)?/i,
    /(\d+[,]?\d*)\s*(?:km|miles?)/i,
  ];

  for (const pattern of mileagePatterns) {
    const match = text.match(pattern);
    if (match) {
      const numStr = match[1].replace(/,/g, '');
      const num = parseInt(numStr, 10);
      if (!isNaN(num) && num > 0 && num < 1000000) { // Reasonable range
        return num;
      }
    }
  }

  return undefined;
}

/**
 * Extract shop/vendor name from text (usually near the top)
 */
function extractVendorName(text: string): string | undefined {
  // Get first few lines of text
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  
  // Skip very short lines and common headers/words
  const skipWords = ['receipt', 'invoice', 'bill', 'tax', 'date', 'cashier', 'bill no', 'sales to', 'vehicle', 'clerk'];
  const skipPatterns = [
    /^\d+$/,  // Just numbers
    /^bill\s*no/i,
    /^cashier/i,
    /^clerk/i,
    /^vehicle/i,
    /^sales\s*to/i,
  ];
  
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    const line = lines[i].trim();
    
    // Check if line is long enough and contains business keywords
    if (line.length > 10 && line.length < 80) {
      const lowerLine = line.toLowerCase();
      
      // Check skip words
      const hasSkipWord = skipWords.some(word => lowerLine.includes(word));
      if (hasSkipWord) continue;
      
      // Check skip patterns
      const matchesSkipPattern = skipPatterns.some(pattern => pattern.test(line));
      if (matchesSkipPattern) continue;
      
      // Look for business indicators (SDN BHD, PLT, etc.)
      if (/sdn\.?\s*bhd|plt|pte|ltd|inc|corp|company|enterprise/i.test(line)) {
        return line;
      }
      
      // If line has multiple capital letters (likely a business name)
      const capitalCount = (line.match(/[A-Z]/g) || []).length;
      if (capitalCount >= 3 && capitalCount > line.length * 0.3) {
        return line;
      }
    }
  }

  return undefined;
}

/**
 * Scan receipt using Google Cloud Vision API
 */
export async function scanReceipt(imageFile: File): Promise<ScannedReceiptData> {
  if (!GOOGLE_VISION_API_KEY) {
    throw new Error('Google Vision API key is not configured. Please add VITE_GOOGLE_VISION_API_KEY to your .env file');
  }

  try {
    // Convert image to base64
    const base64Image = await fileToBase64(imageFile);

    // Prepare Vision API request
    const requestBody = {
      requests: [
        {
          image: {
            content: base64Image,
          },
          features: [
            {
              type: 'TEXT_DETECTION',
              maxResults: 1,
            },
          ],
        },
      ],
    };

    // Call Vision API
    const response = await fetch(GOOGLE_VISION_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Vision API Error:', response.status, errorText);
      throw new Error(`Failed to scan receipt: ${response.status} ${response.statusText}`);
    }

    const data: VisionApiResponse = await response.json();
    const result = data.responses[0];

    // Check for API errors
    if (result.error) {
      throw new Error(`Vision API Error: ${result.error.message}`);
    }

    // Extract full text
    const fullText = result.fullTextAnnotation?.text || 
                     result.textAnnotations?.[0]?.description || 
                     '';

    if (!fullText) {
      throw new Error('No text detected in the image. Please ensure the receipt is clear and well-lit.');
    }

    console.log('Extracted text:', fullText); // For debugging

    // Parse the text to extract receipt data
    const detailedDesc = extractDetailedDescription(fullText);
    const vendorName = extractVendorName(fullText);
    
    const scannedData: ScannedReceiptData = {
      date: extractDate(fullText),
      cost: extractCost(fullText),
      serviceType: extractServiceType(fullText),
      description: detailedDesc,  // Detailed list of items/services
      vendor: vendorName,          // Shop/vendor name
      mileage: extractMileage(fullText),
    };

    console.log('Extracted data:', scannedData); // For debugging

    return scannedData;
  } catch (error) {
    console.error('Receipt scanning error:', error);
    throw error;
  }
}