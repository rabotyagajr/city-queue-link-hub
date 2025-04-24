
import React, { useState } from 'react';
import { Appointment } from '../utils/types';
import AppointmentCard from './AppointmentCard';

interface TimeBankExchangeProps {
  appointments: Appointment[];
  onDonate: (appointmentId: string) => void;
  onViewQR: (appointment: Appointment) => void;
}

const TimeBankExchange: React.FC<TimeBankExchangeProps> = ({ 
  appointments, 
  onDonate,
  onViewQR
}) => {
  const [showDonateForm, setShowDonateForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);
  
  const activeAppointments = appointments.filter(app => app.status === 'active');
  
  const handleDonate = () => {
    if (selectedAppointment) {
      onDonate(selectedAppointment);
      setShowDonateForm(false);
      setSelectedAppointment(null);
    }
  };
  
  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Система тайм-банка</h2>
        {activeAppointments.length > 0 && (
          <button 
            className="btn-outline"
            onClick={() => setShowDonateForm(true)}
          >
            Пожертвовать запись
          </button>
        )}
      </div>
      
      {/* Donation Form */}
      {showDonateForm && (
        <div className="card mb-6">
          <h3 className="font-medium mb-3">Выберите запись для пожертвования:</h3>
          
          <div className="space-y-2 mb-4">
            {activeAppointments.map(appointment => (
              <div key={appointment.id} className="flex items-center">
                <input
                  type="radio"
                  id={`donate-${appointment.id}`}
                  name="donateAppointment"
                  value={appointment.id}
                  checked={selectedAppointment === appointment.id}
                  onChange={() => setSelectedAppointment(appointment.id)}
                  className="mr-2"
                />
                <label htmlFor={`donate-${appointment.id}`} className="flex-grow">
                  {appointment.direction} - {appointment.date} в {appointment.time}
                </label>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              className="btn-secondary"
              onClick={() => {
                setShowDonateForm(false);
                setSelectedAppointment(null);
              }}
            >
              Отмена
            </button>
            <button
              className="btn-primary"
              onClick={handleDonate}
              disabled={!selectedAppointment}
            >
              Пожертвовать
            </button>
          </div>
        </div>
      )}
      
      <div className="rounded-lg border border-dashed border-gray-300 p-4 bg-gray-50">
        <h3 className="font-medium mb-3">Доступные пожертвованные записи:</h3>
        
        {/* This would show donated appointments from other users */}
        <div className="space-y-2">
          <div className="py-4 text-center text-gray-500 italic">
            В настоящий момент нет доступных пожертвованных записей
          </div>
          
          {/* Example of donated appointment - would be populated from API in real app */}
          {/*
          <AppointmentCard
            appointment={{
              id: "donated1",
              direction: "Оформление пособия",
              officeId: "office1",
              date: "2023-05-15",
              time: "14:30",
              userId: "user2",
              status: "active",
            }}
            onViewQR={onViewQR}
          />
          */}
        </div>
      </div>
    </div>
  );
};

export default TimeBankExchange;
