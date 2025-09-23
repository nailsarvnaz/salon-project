import { Service } from './types';

export const SERVICES: Service[] = [
  { value: "کاشت", label: "کاشت - 500,000 تومان", price: 500000, duration: 120 },
  { value: "ترمیم و لمینت", label: "ترمیم و لمینت - 350,000 تومان", price: 350000, duration: 120 },
  { value: "ژلیش پا", label: "ژلیش پا - 180,000 تومان", price: 180000, duration: 60 },
  { value: "دست و پا", label: "دست و پا - 530,000 تومان", price: 530000, duration: 180 },
];

export const PERSIAN_MONTHS: string[] = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

export const PERSIAN_WEEK_DAYS_SHORT: string[] = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

// Note: JS Date.getDay() returns 0 for Sunday, 1 for Monday, ..., 6 for Saturday.
export const EVEN_DAYS_OF_WEEK = [6, 1, 3]; // شنبه (Sat), دوشنبه (Mon), چهارشنبه (Wed)
export const ODD_DAYS_OF_WEEK = [0, 2, 4]; // یکشنبه (Sun), سه‌شنبه (Tue), پنجشنبه (Thu)