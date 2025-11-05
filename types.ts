export interface MaintenanceRecord {
  id: string;
  date: string; // ISO date string e.g., "2023-10-27"
  description: string;
  kilometers: number;
  motorcycleName: string;
  motorcycleType: string;
}
