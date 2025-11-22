export interface MaintenanceRecord {
  id: string;
  date: string; // ISO date string e.g., "2023-10-27"
  description: string;
  kilometers: number;
  motorcycleName: string;
  motorcycleType: string;
  // Cost tracking
  partsCost?: number;
  laborCost?: number;
  // Photos and notes
  photos?: string[]; // Array of base64 or URLs
  notes?: string;
  vehicleId: string; // Link to specific vehicle
}

export interface Vehicle {
  id: string;
  userId: string;
  name: string; // e.g., "Nightster"
  type: string; // e.g., "Harley-Davidson Sportster"
  year?: number;
  model?: string;
  currentOdometer: number;
  purchaseDate?: string;
  purchaseOdometer?: number;
  isActive: boolean; // For switching between vehicles
  createdAt: string;
  // New fields
  registrationNumber?: string; // Vehicle registration/plate number
  tyrePressureFront?: number; // Front tyre pressure in PSI
  tyrePressureRear?: number; // Rear tyre pressure in PSI
  roadTaxExpiry?: string; // Road tax expiry date (ISO format)
  customIcon?: string; // Custom icon/image URL or emoji
  iconType?: 'emoji' | 'image'; // Type of custom icon
}

export interface Reminder {
  id: string;
  vehicleId: string;
  userId: string;
  title: string;
  description?: string;
  // Time-based reminder
  dueDate?: string; // ISO date string
  repeatInterval?: 'monthly' | 'quarterly' | 'biannually' | 'yearly' | 'custom';
  customIntervalDays?: number;
  // Mileage-based reminder
  dueMileage?: number;
  mileageInterval?: number; // e.g., every 5000 km
  // Status
  isActive: boolean;
  lastTriggered?: string;
  dismissed?: boolean;
  createdAt: string;
}

export interface MaintenanceScheduleItem {
  id: string;
  vehicleId: string;
  serviceType: string; // e.g., "Oil Change", "Brake Inspection"
  description: string;
  recommendedMileage: number;
  recommendedInterval: number; // in km
  isCompleted: boolean;
  lastCompletedDate?: string;
  lastCompletedMileage?: number;
  priority: 'low' | 'medium' | 'high';
}

export interface VehicleModelTemplate {
  make: string;
  model: string;
  scheduleItems: Omit<MaintenanceScheduleItem, 'id' | 'vehicleId' | 'isCompleted' | 'lastCompletedDate' | 'lastCompletedMileage'>[];
}

export interface User {
  username: string;
  password: string;
}

export interface CostSummary {
  totalParts: number;
  totalLabor: number;
  totalCost: number;
  recordCount: number;
  averageCostPerService: number;
}