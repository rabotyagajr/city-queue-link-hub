
export interface Appointment {
  id: string;
  direction: string;
  officeId: string;
  date: string;
  time: string;
  userId: string;
  status: "active" | "completed" | "cancelled";
}

export interface Office {
  id: string;
  name: string;
  address: string;
  organizationId: string;
}

export interface Organization {
  id: string;
  name: string;
}

export interface TimeSlot {
  id: string;
  officeId: string;
  date: string;
  time: string;
  isAvailable: boolean;
}

export interface User {
  id: string;
  name: string;
  address: string;
  phone: string;
  activeAppointments: number;
}

export interface AppointmentFormData {
  direction: string;
  officeId: string;
  date: string;
  time: string;
}
