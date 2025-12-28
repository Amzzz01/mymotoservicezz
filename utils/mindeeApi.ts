import { ParsedReceiptData } from '../types';

const MINDEE_API_KEY = import.meta.env.VITE_MINDEE_API_KEY;
const MINDEE_MODEL_ID = import.meta.env.VITE_MINDEE_MODEL_ID || '99e6dfb7-48cb-402d-b68d-9d8c331130fb';

// Mindee API v2 endpoints
const MINDEE_ENQUEUE_URL = 'https://api-v2.mindee.net/v2/inferences/enqueue';

// Mindee v2 API Response Types
interface MindeeV2Job {
  id: string;
  model_id: string;
  filename: string;
  created_at: string;
  status: 'Processing' | 'Failed' | 'Processed';
  polling_url: string;
  result_url?: string;
  error?: any;
}

interface MindeeV2JobResponse {
  job: MindeeV2Job;
}

interface MindeeV2InferenceResult {
  inference: {
    id: string;
    model: {
      id: string;
    };
    file: {
      name: string;
      page_count: number;
      mime_type: string;
    };
    result: {
      fields: {
        [key: string]: {
          value: any;
          confidence?: string;
          locations?: any[];
        };
      };
    };
  };
}

export const scanReceiptWithMindee = async (imageFile: File): Promise<ParsedReceiptData> => {
  if (!MINDEE_API_KEY) {
    throw new Error('Mindee API key is not configured. Please add VITE_MINDEE_API_KEY to your environment variables.');
  }

  if (!MINDEE_MODEL_ID) {
    throw new Error('Mindee Model ID is not configured. Please add VITE_MINDEE_MODEL_ID to your environment variables.');
  }

  try {
    console.log('Starting Mindee v2 API request...');
    console.log('Model ID:', MINDEE_MODEL_ID);
    
    // Step 1: Enqueue the file for processing
    const formData = new FormData();
    formData.append('model_id', MINDEE_MODEL_ID);
    formData.append('file', imageFile);
    
    // Optional: Enable additional features
    formData.append('confidence', 'true');
    formData.append('polygon', 'true');

    console.log('Enqueuing file to Mindee API v2...');
    
    const enqueueResponse = await fetch(MINDEE_ENQUEUE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${MINDEE_API_KEY}`
      },
      body: formData
    });

    if (!enqueueResponse.ok) {
      const errorText = await enqueueResponse.text();
      console.error('Enqueue failed:', errorText);
      throw new Error(`Mindee API error (${enqueueResponse.status}): ${errorText}`);
    }

    const jobResponse: MindeeV2JobResponse = await enqueueResponse.json();
    console.log('Job enqueued:', jobResponse.job.id);

    // Step 2: Poll for results
    const result = await pollForResults(jobResponse.job.polling_url, jobResponse.job.result_url);
    
    // Step 3: Parse the result
    const parsedData = parseReceiptData(result);
    
    return parsedData;
  } catch (error: any) {
    console.error('Error scanning receipt with Mindee:', error);
    throw new Error(error.message || 'Failed to scan receipt. Please try again.');
  }
};

const pollForResults = async (
  pollingUrl: string, 
  initialResultUrl?: string,
  maxAttempts: number = 30,
  interval: number = 2000
): Promise<MindeeV2InferenceResult> => {
  console.log('Starting to poll for results...');
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    console.log(`Polling attempt ${attempt + 1}/${maxAttempts}...`);
    
    // Wait before polling (except first attempt)
    if (attempt > 0) {
      await new Promise(resolve => setTimeout(resolve, interval));
    }

    const response = await fetch(pollingUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${MINDEE_API_KEY}`
      },
      redirect: 'manual' // Don't follow redirects automatically
    });

    if (response.status === 302 || response.status === 200) {
      const jobResponse: MindeeV2JobResponse = await response.json();
      
      console.log('Job status:', jobResponse.job.status);

      if (jobResponse.job.status === 'Processed' && jobResponse.job.result_url) {
        // Job is complete, fetch results
        console.log('Job complete! Fetching results from:', jobResponse.job.result_url);
        
        const resultResponse = await fetch(jobResponse.job.result_url, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${MINDEE_API_KEY}`
          }
        });

        if (!resultResponse.ok) {
          const errorText = await resultResponse.text();
          throw new Error(`Failed to fetch results: ${errorText}`);
        }

        const result: MindeeV2InferenceResult = await resultResponse.json();
        console.log('Results retrieved successfully');
        return result;
      }

      if (jobResponse.job.status === 'Failed') {
        throw new Error(`Processing failed: ${JSON.stringify(jobResponse.job.error || 'Unknown error')}`);
      }

      // Status is still 'Processing', continue polling
      console.log('Still processing...');
    } else {
      const errorText = await response.text();
      throw new Error(`Polling failed (${response.status}): ${errorText}`);
    }
  }

  throw new Error('Polling timeout: Document processing took too long');
};

const parseReceiptData = (result: MindeeV2InferenceResult): ParsedReceiptData => {
  const fields = result.inference.result.fields;
  
  console.log('Parsing receipt data. Available fields:', Object.keys(fields));

  // Extract date - try common field names
  const dateValue = fields.date?.value || 
                    fields.invoice_date?.value || 
                    fields.receipt_date?.value || 
                    new Date().toISOString().split('T')[0];

  // Extract total amount - try common field names
  const totalAmount = parseFloat(fields.total_amount?.value || 
                                 fields.total?.value || 
                                 fields.amount?.value || 
                                 '0');

  // Extract tax
  const totalTax = parseFloat(fields.total_tax?.value || 
                              fields.tax?.value || 
                              '0');

  // Calculate parts cost (total - tax)
  const partsCost = totalAmount > 0 ? totalAmount - totalTax : 0;

  // Build service description
  let serviceDescription = '';
  
  if (fields.description?.value) {
    serviceDescription = fields.description.value;
  } else if (fields.service_description?.value) {
    serviceDescription = fields.service_description.value;
  } else if (fields.line_items?.value) {
    // If line items exist, join them
    try {
      const items = Array.isArray(fields.line_items.value) 
        ? fields.line_items.value.map((item: any) => item.description || item.name || '').filter(Boolean)
        : [];
      serviceDescription = items.slice(0, 3).join(', ');
    } catch (e) {
      console.error('Error parsing line items:', e);
    }
  }

  if (!serviceDescription) {
    serviceDescription = 'Service/Maintenance';
  }

  // Build notes from supplier info
  const notes: string[] = [];
  
  if (fields.supplier_name?.value) {
    notes.push(`Supplier: ${fields.supplier_name.value}`);
  } else if (fields.vendor_name?.value) {
    notes.push(`Supplier: ${fields.vendor_name.value}`);
  }
  
  if (fields.supplier_address?.value) {
    notes.push(`Address: ${fields.supplier_address.value}`);
  } else if (fields.address?.value) {
    notes.push(`Address: ${fields.address.value}`);
  }

  // Calculate confidence (convert from string to number if needed)
  const dateConfidence = fields.date?.confidence === 'Certain' ? 0.95 : 
                        fields.date?.confidence === 'High' ? 0.8 : 
                        fields.date?.confidence === 'Medium' ? 0.6 : 0.5;
  
  const amountConfidence = fields.total_amount?.confidence === 'Certain' ? 0.95 : 
                          fields.total_amount?.confidence === 'High' ? 0.8 : 
                          fields.total_amount?.confidence === 'Medium' ? 0.6 : 0.5;

  const overallConfidence = (dateConfidence + amountConfidence) / 2;

  return {
    date: dateValue,
    serviceDescription: serviceDescription,
    partsCost: Math.round(partsCost * 100) / 100,
    laborCost: 0,
    totalCost: Math.round(totalAmount * 100) / 100,
    supplierName: fields.supplier_name?.value || fields.vendor_name?.value,
    notes: notes.length > 0 ? notes.join('\n') : undefined,
    confidence: {
      date: dateConfidence,
      amount: amountConfidence,
      overall: overallConfidence
    }
  };
};