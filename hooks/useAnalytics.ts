import { useMemo } from 'react';
import { MaintenanceRecord, Vehicle } from '../types';

export interface ServicePattern {
  serviceType: string;
  count: number;
  averageInterval: number; // in km
  lastPerformed: string;
  lastKilometers: number;
  averageCost: number;
}

export interface PredictiveAlert {
  serviceType: string;
  predictedKilometers: number;
  distanceRemaining: number;
  confidence: 'high' | 'medium' | 'low';
  lastPerformed: string;
  averageInterval: number;
}

export interface CostEfficiency {
  totalDistance: number;
  totalCost: number;
  costPerKm: number;
  costPerService: number;
  partsPerKm: number;
  laborPerKm: number;
  monthlyAverage: number;
  rating: 'excellent' | 'good' | 'fair' | 'high';
}

export interface TimelineData {
  month: string;
  serviceCount: number;
  totalCost: number;
}

export interface ServiceBreakdown {
  serviceType: string;
  count: number;
  percentage: number;
  totalCost: number;
}

export interface AnalyticsData {
  servicePatterns: ServicePattern[];
  predictiveAlerts: PredictiveAlert[];
  costEfficiency: CostEfficiency | null;
  timeline: TimelineData[];
  serviceBreakdown: ServiceBreakdown[];
  costTrend: TimelineData[];
}

export function useAnalytics(
  records: MaintenanceRecord[],
  activeVehicle: Vehicle | null
): AnalyticsData {
  return useMemo(() => {
    if (!records || records.length === 0 || !activeVehicle) {
      return {
        servicePatterns: [],
        predictiveAlerts: [],
        costEfficiency: null,
        timeline: [],
        serviceBreakdown: [],
        costTrend: []
      };
    }

    // Sort records by date (oldest first for calculations)
    const sortedRecords = [...records].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Calculate service patterns
    const servicePatterns = calculateServicePatterns(sortedRecords);

    // Generate predictive alerts
    const predictiveAlerts = generatePredictiveAlerts(
      servicePatterns,
      activeVehicle.currentOdometer
    );

    // Calculate cost efficiency
    const costEfficiency = calculateCostEfficiency(
      sortedRecords,
      activeVehicle
    );

    // Generate timeline data
    const timeline = generateTimeline(sortedRecords);

    // Calculate service breakdown
    const serviceBreakdown = calculateServiceBreakdown(sortedRecords);

    // Generate cost trend
    const costTrend = generateCostTrend(sortedRecords);

    return {
      servicePatterns,
      predictiveAlerts,
      costEfficiency,
      timeline,
      serviceBreakdown,
      costTrend
    };
  }, [records, activeVehicle]);
}

function calculateServicePatterns(records: MaintenanceRecord[]): ServicePattern[] {
  const serviceMap = new Map<string, MaintenanceRecord[]>();

  // Group records by service type (extract from description)
  records.forEach(record => {
    const serviceType = extractServiceType(record.description);
    if (!serviceMap.has(serviceType)) {
      serviceMap.set(serviceType, []);
    }
    serviceMap.get(serviceType)!.push(record);
  });

  const patterns: ServicePattern[] = [];

  serviceMap.forEach((serviceRecords, serviceType) => {
    if (serviceRecords.length < 2) {
      // Need at least 2 records to calculate interval
      const record = serviceRecords[0];
      patterns.push({
        serviceType,
        count: 1,
        averageInterval: 0,
        lastPerformed: record.date,
        lastKilometers: record.kilometers,
        averageCost: (record.partsCost || 0) + (record.laborCost || 0)
      });
      return;
    }

    // Calculate intervals between services
    const intervals: number[] = [];
    for (let i = 1; i < serviceRecords.length; i++) {
      const kmDiff = serviceRecords[i].kilometers - serviceRecords[i - 1].kilometers;
      if (kmDiff > 0) {
        intervals.push(kmDiff);
      }
    }

    const averageInterval = intervals.length > 0
      ? Math.round(intervals.reduce((sum, val) => sum + val, 0) / intervals.length)
      : 0;

    const totalCost = serviceRecords.reduce(
      (sum, r) => sum + (r.partsCost || 0) + (r.laborCost || 0),
      0
    );
    const averageCost = totalCost / serviceRecords.length;

    const lastRecord = serviceRecords[serviceRecords.length - 1];

    patterns.push({
      serviceType,
      count: serviceRecords.length,
      averageInterval,
      lastPerformed: lastRecord.date,
      lastKilometers: lastRecord.kilometers,
      averageCost
    });
  });

  // Sort by count (most frequent first)
  return patterns.sort((a, b) => b.count - a.count);
}

function generatePredictiveAlerts(
  patterns: ServicePattern[],
  currentOdometer: number
): PredictiveAlert[] {
  const alerts: PredictiveAlert[] = [];

  patterns.forEach(pattern => {
    if (pattern.averageInterval === 0 || pattern.count < 2) {
      return; // Skip if no interval data
    }

    const distanceSinceLastService = currentOdometer - pattern.lastKilometers;
    const predictedKilometers = pattern.lastKilometers + pattern.averageInterval;
    const distanceRemaining = predictedKilometers - currentOdometer;

    // Only show alerts if within 1000km or overdue
    if (distanceRemaining > 1000) {
      return;
    }

    // Determine confidence based on number of data points
    let confidence: 'high' | 'medium' | 'low';
    if (pattern.count >= 5) {
      confidence = 'high';
    } else if (pattern.count >= 3) {
      confidence = 'medium';
    } else {
      confidence = 'low';
    }

    alerts.push({
      serviceType: pattern.serviceType,
      predictedKilometers,
      distanceRemaining,
      confidence,
      lastPerformed: pattern.lastPerformed,
      averageInterval: pattern.averageInterval
    });
  });

  // Sort by distance remaining (most urgent first)
  return alerts.sort((a, b) => a.distanceRemaining - b.distanceRemaining);
}

function calculateCostEfficiency(
  records: MaintenanceRecord[],
  vehicle: Vehicle
): CostEfficiency | null {
  if (records.length === 0) return null;

  const totalCost = records.reduce(
    (sum, r) => sum + (r.partsCost || 0) + (r.laborCost || 0),
    0
  );

  const totalPartsCost = records.reduce((sum, r) => sum + (r.partsCost || 0), 0);
  const totalLaborCost = records.reduce((sum, r) => sum + (r.laborCost || 0), 0);

  // Calculate total distance traveled
  const purchaseOdometer = vehicle.purchaseOdometer || 0;
  const totalDistance = vehicle.currentOdometer - purchaseOdometer;

  if (totalDistance <= 0) {
    return null;
  }

  const costPerKm = totalCost / totalDistance;
  const costPerService = totalCost / records.length;
  const partsPerKm = totalPartsCost / totalDistance;
  const laborPerKm = totalLaborCost / totalDistance;

  // Calculate monthly average (assuming records span months)
  const oldestDate = new Date(records[0].date);
  const newestDate = new Date(records[records.length - 1].date);
  const monthsDiff = Math.max(
    1,
    (newestDate.getTime() - oldestDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
  );
  const monthlyAverage = totalCost / monthsDiff;

  // Determine rating (based on cost per km)
  let rating: 'excellent' | 'good' | 'fair' | 'high';
  if (costPerKm < 0.10) {
    rating = 'excellent';
  } else if (costPerKm < 0.20) {
    rating = 'good';
  } else if (costPerKm < 0.35) {
    rating = 'fair';
  } else {
    rating = 'high';
  }

  return {
    totalDistance,
    totalCost,
    costPerKm,
    costPerService,
    partsPerKm,
    laborPerKm,
    monthlyAverage,
    rating
  };
}

function generateTimeline(records: MaintenanceRecord[]): TimelineData[] {
  const monthMap = new Map<string, { count: number; cost: number }>();

  records.forEach(record => {
    const date = new Date(record.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, { count: 0, cost: 0 });
    }

    const data = monthMap.get(monthKey)!;
    data.count++;
    data.cost += (record.partsCost || 0) + (record.laborCost || 0);
  });

  const timeline: TimelineData[] = [];
  monthMap.forEach((data, month) => {
    timeline.push({
      month,
      serviceCount: data.count,
      totalCost: data.cost
    });
  });

  // Sort by month
  return timeline.sort((a, b) => a.month.localeCompare(b.month));
}

function calculateServiceBreakdown(records: MaintenanceRecord[]): ServiceBreakdown[] {
  const serviceMap = new Map<string, { count: number; cost: number }>();

  records.forEach(record => {
    const serviceType = extractServiceType(record.description);
    if (!serviceMap.has(serviceType)) {
      serviceMap.set(serviceType, { count: 0, cost: 0 });
    }

    const data = serviceMap.get(serviceType)!;
    data.count++;
    data.cost += (record.partsCost || 0) + (record.laborCost || 0);
  });

  const totalRecords = records.length;
  const breakdown: ServiceBreakdown[] = [];

  serviceMap.forEach((data, serviceType) => {
    breakdown.push({
      serviceType,
      count: data.count,
      percentage: (data.count / totalRecords) * 100,
      totalCost: data.cost
    });
  });

  // Sort by count (most frequent first)
  return breakdown.sort((a, b) => b.count - a.count);
}

function generateCostTrend(records: MaintenanceRecord[]): TimelineData[] {
  // Same as timeline but focuses on cost visualization
  return generateTimeline(records);
}

function extractServiceType(description: string): string {
  // Extract service type from description
  // Common patterns: "Oil Change", "Tire Replacement", "Brake Service", etc.
  const lowerDesc = description.toLowerCase();

  // Common service keywords
  const keywords = [
    'oil change',
    'oil',
    'tire',
    'brake',
    'chain',
    'battery',
    'spark plug',
    'air filter',
    'coolant',
    'clutch',
    'suspension',
    'fork',
    'valve',
    'carb',
    'fuel',
    'inspection',
    'wash',
    'wax',
    'detail'
  ];

  for (const keyword of keywords) {
    if (lowerDesc.includes(keyword)) {
      // Capitalize first letter of each word
      return keyword
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
  }

  // If no keyword matched, use first 3 words or whole description if shorter
  const words = description.split(' ').slice(0, 3).join(' ');
  return words || 'Other Service';
}