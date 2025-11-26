export enum UserRole {
  PASSENGER = 'PASSENGER',
  DRIVER = 'DRIVER',
  ADMIN = 'ADMIN',
  AGENT = 'AGENT',
  GUEST = 'GUEST'
}

export enum RideStatus {
  IDLE = 'IDLE',
  SEARCHING = 'SEARCHING',
  ACCEPTED = 'ACCEPTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  SCHEDULED = 'SCHEDULED'
}

export enum RideType {
  QUICK = 'Rápida',
  SAFE = 'Segura',
  ECO = 'Econômica',
  SHARED = 'Compartilhada'
}

export interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export interface RideRequest {
  id?: string;
  userId?: string; // Foreign key to User
  driverId?: string; // Foreign key to Driver
  pickup: Location;
  dropoff: Location;
  type: RideType;
  price: number;
  distance: number; // km
  scheduledTime?: string; // ISO Date string
  createdAt?: string;
  status?: RideStatus;
}

export interface Driver {
  id: string;
  name: string;
  rating: number;
  ridesCompleted: number;
  vehiclePlate: string;
  avatar: string;
  isOnline: boolean;
  location: Location;
  points: number;
  level: 'Bronze' | 'Prata' | 'Ouro' | 'Diamante';
}

export interface Reward {
  id: string;
  title: string;
  cost: number;
  description: string;
  icon: string;
}

export interface SafetyAlert {
  level: 'low' | 'medium' | 'high';
  message: string;
  tip: string;
}

export interface IncidentReport {
  id: string;
  agentId?: string; // Foreign key to User (Agent)
  type: 'Acidente' | 'Infração' | 'Via Danificada' | 'Outro';
  description: string;
  location: string;
  time: string;
  status: 'Pendente' | 'Resolvido';
}

export interface UserSettings {
  theme: 'light' | 'dark';
  language: 'pt' | 'en';
  notifications: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  password?: string; // Only used for simulated auth check
  settings?: UserSettings; // New settings field
  privacyConsent?: boolean;
}

export interface AuditLog {
  id: string;
  action: string;
  entityId: string;
  authorId: string;
  timestamp: string;
  details: string;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  description: string;
  timestamp: string;
}