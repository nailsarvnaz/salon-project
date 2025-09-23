export interface Service {
  value: string;
  label: string;
  price: number;
  duration: number;
}

export interface Booking {
  name: string;
  phone: string;
  service: string;
  date: string; // Format: YYYY/M/D
  time: string; // Format: HH:MM
  trackingCode: number;
}

export interface NotificationDetails {
  type: 'success' | 'error' | 'warning';
  title: string;
  message?: string;
  details?: { label: string; value: string }[];
}