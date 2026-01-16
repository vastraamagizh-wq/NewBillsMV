
import { AppSettings } from './types';

export const DEFAULT_SETTINGS: AppSettings = {
  companyName: "Magizh Vasthraa",
  companyAddress: "123 Fashion Street\nChennai, Tamil Nadu 600001",
  companyPhone: "(044) 1234-5678",
  companyEmail: "info@magizhvasthraa.com",
  whatsappMessage: "Thank you for shopping with Magizh Vasthraa! Your bill has been generated successfully.",
  lastInvoiceNumber: 1000
};

export const STORAGE_KEYS = {
  CUSTOMERS: 'mv_customers',
  INVENTORY: 'mv_inventory',
  BILLS: 'mv_bills',
  SETTINGS: 'mv_settings',
  HELD_BILLS: 'mv_held_bills'
};
