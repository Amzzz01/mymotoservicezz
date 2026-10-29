import { Vehicle } from '../types';
import { Translations } from '../translations';

// Road tax is valid through the whole expiry day; it counts as expired from the next day.
// 'soon' = expires within SOON_DAYS (alerts + Renew action shown), 'upcoming' = within
// UPCOMING_DAYS (colour hint only), 'valid' = nothing to show.
export type RoadTaxStatus = 'expired' | 'soon' | 'upcoming' | 'valid';

export const ROAD_TAX_SOON_DAYS = 7;
export const ROAD_TAX_UPCOMING_DAYS = 30;

export interface RoadTaxAlert {
  vehicle: Vehicle;
  status: 'expired' | 'soon';
  daysLeft: number; // negative once expired
}

// Parse 'YYYY-MM-DD' (or a full ISO string) as a LOCAL calendar date. `new Date('2026-10-29')`
// would be midnight UTC, i.e. 8am in Malaysia, which made the tax "expire" on its last valid day.
export const parseLocalDate = (value: string): Date => {
  const [y, m, d] = value.slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const toDateInputValue = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const startOfToday = (): Date => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

export const getRoadTaxDaysLeft = (expiry: string): number =>
  Math.round((parseLocalDate(expiry).getTime() - startOfToday().getTime()) / (1000 * 60 * 60 * 24));

export const getRoadTaxStatus = (expiry?: string): RoadTaxStatus | null => {
  if (!expiry) return null;
  const daysLeft = getRoadTaxDaysLeft(expiry);
  if (daysLeft < 0) return 'expired';
  if (daysLeft <= ROAD_TAX_SOON_DAYS) return 'soon';
  if (daysLeft <= ROAD_TAX_UPCOMING_DAYS) return 'upcoming';
  return 'valid';
};

// Every vehicle whose road tax needs action, most urgent first.
export const getRoadTaxAlerts = (vehicles: Vehicle[]): RoadTaxAlert[] =>
  vehicles
    .flatMap((vehicle): RoadTaxAlert[] => {
      const status = getRoadTaxStatus(vehicle.roadTaxExpiry);
      if (status !== 'expired' && status !== 'soon') return [];
      return [{ vehicle, status, daysLeft: getRoadTaxDaysLeft(vehicle.roadTaxExpiry!) }];
    })
    .sort((a, b) => a.daysLeft - b.daysLeft);

export const formatRoadTaxDate = (expiry: string): string =>
  parseLocalDate(expiry).toLocaleDateString();

export const addOneYear = (expiry: string): string => {
  const date = parseLocalDate(expiry);
  date.setFullYear(date.getFullYear() + 1);
  return toDateInputValue(date);
};

export const fillTemplate = (template: string, values: Record<string, string | number>): string =>
  template.replace(/\{(\w+)\}/g, (match, key) => (key in values ? String(values[key]) : match));

export const vehicleLabel = (vehicle: Vehicle): string =>
  vehicle.registrationNumber ? `${vehicle.name} · ${vehicle.registrationNumber}` : vehicle.name;

// "Expired 12 days ago (17/10/2026)" / "Expires tomorrow (30/10/2026)" etc.
export const describeRoadTax = (expiry: string, t: Translations): string => {
  const daysLeft = getRoadTaxDaysLeft(expiry);
  const date = formatRoadTaxDate(expiry);
  if (daysLeft < -1) return fillTemplate(t.roadTaxExpiredAgo, { days: -daysLeft, date });
  if (daysLeft === -1) return fillTemplate(t.roadTaxExpiredYesterday, { date });
  if (daysLeft === 0) return fillTemplate(t.roadTaxExpiresToday, { date });
  if (daysLeft === 1) return fillTemplate(t.roadTaxExpiresTomorrow, { date });
  return fillTemplate(t.roadTaxExpiresIn, { days: daysLeft, date });
};
