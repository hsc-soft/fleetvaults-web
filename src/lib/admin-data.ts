// Mock admin data. Replace with a real DB / VTS API later.

export type DeviceStatus = "Active" | "Idle" | "Offline";

export type Device = {
  id: string;
  imei: string;
  vendor: string;
  vehicle: string;
  status: DeviceStatus;
  lastSeen: string;
};

export type Vendor = {
  name: string;
  city: string;
  devices: number;
  contact: string;
  status: "Active" | "Suspended";
};

export const devices: Device[] = [
  { id: "RJ-12 AB 4471", imei: "356918840060767", vendor: "Marwar Logistics", vehicle: "Truck", status: "Active", lastSeen: "2 min ago" },
  { id: "RJ-14 CD 9032", imei: "356918840061224", vendor: "Pink City Cabs", vehicle: "Van", status: "Idle", lastSeen: "18 min ago" },
  { id: "RJ-04 EF 1188", imei: "356918840059913", vendor: "Shekhawati Travels", vehicle: "Bus", status: "Active", lastSeen: "1 min ago" },
  { id: "RJ-19 GH 7742", imei: "356918840062001", vendor: "Marwar Logistics", vehicle: "Truck", status: "Active", lastSeen: "4 min ago" },
  { id: "RJ-45 JK 3320", imei: "356918840060119", vendor: "Aravalli Movers", vehicle: "Car", status: "Offline", lastSeen: "3 days ago" },
  { id: "RJ-27 LM 5567", imei: "356918840061880", vendor: "Pink City Cabs", vehicle: "Car", status: "Active", lastSeen: "6 min ago" },
  { id: "RJ-06 NP 9081", imei: "356918840062340", vendor: "Desert Freight", vehicle: "Truck", status: "Idle", lastSeen: "42 min ago" },
  { id: "RJ-14 QR 2210", imei: "356918840059777", vendor: "Shekhawati Travels", vehicle: "Bus", status: "Active", lastSeen: "3 min ago" },
];

export const vendors: Vendor[] = [
  { name: "Marwar Logistics", city: "Jodhpur", devices: 312, contact: "ops@marwarlogistics.in", status: "Active" },
  { name: "Pink City Cabs", city: "Jaipur", devices: 268, contact: "fleet@pinkcitycabs.in", status: "Active" },
  { name: "Shekhawati Travels", city: "Sikar", devices: 197, contact: "support@shekhawatitravels.in", status: "Active" },
  { name: "Aravalli Movers", city: "Udaipur", devices: 156, contact: "info@aravallimovers.in", status: "Suspended" },
  { name: "Desert Freight", city: "Bikaner", devices: 214, contact: "dispatch@desertfreight.in", status: "Active" },
  { name: "Thar Transport", city: "Jaisalmer", devices: 93, contact: "hello@thartransport.in", status: "Active" },
];

// Headline figures for the dashboard (network-wide placeholders).
export const summary = {
  totalDevices: 1240,
  totalVendors: 48,
  activeDevices: 1087,
};
