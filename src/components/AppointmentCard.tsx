
import React from 'react';
import { Appointment } from '../utils/types';
import { getOfficeById } from '../utils/data';

interface AppointmentCardProps {
  appointment: Appointment;
  onViewQR: (appointment: Appointment) => void;
  onCancel?: (appointmentId: string) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ 
  appointment, 
  onViewQR,
  onCancel
}) => {
  const office = getOfficeById(appointment.officeId);
  
  const formatDate = (dateString: string): string => {
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
  };
  
  return (
    <div className="card mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-lg">{appointment.direction}</h3>
          <p className="text-gray-600">{office?.name}</p>
          <p className="text-gray-600">{formatDate(appointment.date)} в {appointment.time}</p>
          <p className={`mt-2 ${appointment.status === 'active' ? 'text-green-600' : appointment.status === 'cancelled' ? 'text-red-600' : 'text-gray-600'}`}>
            {appointment.status === 'active' ? 'Активна' : appointment.status === 'cancelled' ? 'Отменена' : 'Завершена'}
          </p>
        </div>
        
        <div className="flex flex-col gap-2">
          <button 
            className="btn-primary text-sm" 
            onClick={() => onViewQR(appointment)}
          >
            Показать QR-код
          </button>
          
          {appointment.status === 'active' && onCancel && (
            <button 
              className="btn-outline text-sm text-red-500 border-red-500 hover:bg-red-50" 
              onClick={() => onCancel(appointment.id)}
            >
              Отменить
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
