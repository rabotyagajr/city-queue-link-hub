
import { Appointment, Office, Organization, TimeSlot, User } from './types';

// Sample user
export const currentUser: User = {
  id: "user1",
  name: "Иван Иванов",
  address: "г. Москва, ул. Ленина, д. 10, кв. 5",
  phone: "+7 (999) 123-45-67",
  activeAppointments: 1,
};

// Sample organizations
export const organizations: Organization[] = [
  { id: "org1", name: "Департамент социальной защиты" },
  { id: "org2", name: "Земельный комитет" },
  { id: "org3", name: "МФЦ" },
];

// Sample offices
export const offices: Office[] = [
  { id: "office1", name: "Отделение №1", address: "ул. Пушкина, д. 5", organizationId: "org1" },
  { id: "office2", name: "Отделение №2", address: "ул. Гоголя, д. 12", organizationId: "org1" },
  { id: "office3", name: "Земельный отдел", address: "пр. Мира, д. 33", organizationId: "org2" },
  { id: "office4", name: "МФЦ Центральный", address: "ул. Ленина, д. 15", organizationId: "org3" },
];

// Sample directions
export const directions = [
  "Оформление пособия",
  "Консультация по жилищным вопросам",
  "Оформление земельного участка",
  "Получение справки",
  "Оформление документов",
];

// Generate time slots for the next 7 days
const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const today = new Date();
  
  for (let dayOffset = 1; dayOffset <= 7; dayOffset++) {
    const date = new Date(today);
    date.setDate(today.getDate() + dayOffset);
    const dateString = date.toISOString().split('T')[0];
    
    for (const office of offices) {
      // Generate slots from 9:00 to 16:00 with 30-minute intervals
      for (let hour = 9; hour <= 16; hour++) {
        for (let minute of [0, 30]) {
          if (hour === 16 && minute === 30) continue; // Skip 16:30
          
          const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          slots.push({
            id: `slot-${office.id}-${dateString}-${timeString}`,
            officeId: office.id,
            date: dateString,
            time: timeString,
            isAvailable: Math.random() > 0.3, // 70% of slots are available
          });
        }
      }
    }
  }
  
  return slots;
};

export const timeSlots = generateTimeSlots();

// Sample appointments
export const appointments: Appointment[] = [
  {
    id: "app1",
    direction: "Оформление пособия",
    officeId: "office1",
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // Two days from now
    time: "10:30",
    userId: "user1",
    status: "active",
  },
];

// Function to get office details by ID
export const getOfficeById = (id: string): Office | undefined => {
  return offices.find(office => office.id === id);
};

// Function to get organization details by ID
export const getOrganizationById = (id: string): Organization | undefined => {
  return organizations.find(org => org.id === id);
};

// Function to get available time slots for a specific office and date
export const getAvailableTimeSlots = (officeId: string, date: string): TimeSlot[] => {
  return timeSlots.filter(
    slot => slot.officeId === officeId && slot.date === date && slot.isAvailable
  );
};

// Function to generate a unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};
