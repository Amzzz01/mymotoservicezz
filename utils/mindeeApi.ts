import { MindeeApiResponse, ParsedReceiptData } from '../types';

const MINDEE_API_KEY = import.meta.env.VITE_MINDEE_API_KEY;
const MINDEE_API_URL = 'https://api.mindee.net/v1/products/mindee/expense_receipts/v5/predict';

export const scanReceiptWithMindee = async (imageFile: File): Promise<ParsedReceiptData> => {
  if (!MINDEE_API_KEY) {
    throw new Error('Mindee API key is not configured. Please add VITE_MINDEE_API_KEY to your environment variables.');
  }

  try {
    // Prepare form data
    const formData = new FormData();
    formData.append('document', imageFile);

    // Call Mindee API
    const response = await fetch(MINDEE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${MINDEE_API_KEY}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Mindee API error (${response.status}): ${errorText}`);
    }

    const data: MindeeApiResponse = await response.json();
    const prediction = data.document.inference.prediction;

    // Parse and structure the data for MyMotoLog
    const parsedData = parseReceiptData(prediction);
    
    return parsedData;
  } catch (error: any) {
    console.error('Error scanning receipt with Mindee:', error);
    throw new Error(error.message || 'Failed to scan receipt. Please try again.');
  }
};

const parseReceiptData = (prediction: any): ParsedReceiptData => {
  // Extract date
  const dateValue = prediction.date?.value || new Date().toISOString().split('T')[0];
  const dateConfidence = prediction.date?.confidence || 0;

  // Extract costs
  const totalAmount = prediction.total_amount?.value || 0;
  const totalNet = prediction.total_net?.value;
  const totalTax = prediction.total_tax?.value || 0;
  const amountConfidence = prediction.total_amount?.confidence || 0;

  // Determine parts vs labor cost
  // If we have net amount, use it as parts cost
  const partsCost = totalNet !== undefined ? totalNet : totalAmount - totalTax;
  const laborCost = 0; // Usually needs manual input

  // Build service description from line items or category
  let serviceDescription = '';
  
  if (prediction.line_items && prediction.line_items.length > 0) {
    // Use line items to build description
    const items = prediction.line_items
      .map((item: any) => item.description)
      .filter((desc: string) => desc && desc.trim().length > 0)
      .slice(0, 3); // Take first 3 items
    
    serviceDescription = items.join(', ');
  }
  
  // Fallback to category/subcategory if no line items
  if (!serviceDescription) {
    const category = prediction.category?.value || '';
    const subcategory = prediction.subcategory?.value || '';
    serviceDescription = subcategory || category || 'Service/Maintenance';
  }

  // Build notes from supplier info and other details
  const notes: string[] = [];
  
  if (prediction.supplier_name?.value) {
    notes.push(`Supplier: ${prediction.supplier_name.value}`);
  }
  
  if (prediction.supplier_address?.value) {
    notes.push(`Address: ${prediction.supplier_address.value}`);
  }
  
  if (prediction.taxes && prediction.taxes.length > 0) {
    const tax = prediction.taxes[0];
    if (tax.code) {
      notes.push(`Tax (${tax.code}): ${tax.amount || 0}`);
    }
  }

  // Calculate overall confidence
  const overallConfidence = (dateConfidence + amountConfidence) / 2;

  return {
    date: dateValue,
    serviceDescription: serviceDescription || 'Service/Maintenance',
    partsCost: Math.round(partsCost * 100) / 100, // Round to 2 decimals
    laborCost: 0,
    totalCost: Math.round(totalAmount * 100) / 100,
    supplierName: prediction.supplier_name?.value,
    notes: notes.length > 0 ? notes.join('\n') : undefined,
    confidence: {
      date: dateConfidence,
      amount: amountConfidence,
      overall: overallConfidence
    }
  };
};