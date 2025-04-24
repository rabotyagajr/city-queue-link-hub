
import React, { useState } from 'react';
import AppointmentCard from './AppointmentCard';
import QRCodeDisplay from './QRCodeDisplay';
import AppointmentForm from './AppointmentForm';
import TimeBankExchange from './TimeBankExchange';
import { Appointment, AppointmentFormData } from '../utils/types';
import { appointments as initialAppointments, currentUser, generateId } from '../utils/data';

const UserInterface: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  
  const handleCreateAppointment = (formData: AppointmentFormData) => {
    // Check if user has reached the limit of 2 active appointments
    const activeAppointments = appointments.filter(
      app => app.userId === currentUser.id && app.status === 'active'
    );
    
    if (activeAppointments.length >= 2) {
      alert('Вы не можете создать больше 2 активных записей.');
      return;
    }
    
    const newAppointment: Appointment = {
      id: generateId(),
      ...formData,
      userId: currentUser.id,
      status: 'active',
    };
    
    setAppointments([...appointments, newAppointment]);
    setShowAppointmentForm(false);
  };
  
  const handleCancelAppointment = (appointmentId: string) => {
    if (confirm('Вы уверены, что хотите отменить запись?')) {
      setAppointments(appointments.map(app => 
        app.id === appointmentId ? { ...app, status: 'cancelled' } : app
      ));
    }
  };
  
  const handleDonateAppointment = (appointmentId: string) => {
    // In a real app, this would mark the appointment as donated to the time bank
    setAppointments(appointments.map(app => 
      app.id === appointmentId ? { ...app, status: 'cancelled' } : app
    ));
    
    alert('Запись успешно добавлена в тайм-банк для других пользователей.');
  };
  
  const userAppointments = appointments.filter(app => app.userId === currentUser.id);
  const activeAppointmentsCount = userAppointments.filter(app => app.status === 'active').length;
  
  return (
    <div className="mb-8">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">Добро пожаловать, {currentUser.name}</h2>
        <p>У вас {activeAppointmentsCount} активных записей из 2 возможных.</p>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Ваши записи</h2>
        <button 
          className="btn-primary"
          onClick={() => setShowAppointmentForm(true)}
          disabled={activeAppointmentsCount >= 2}
        >
          Получить ссылку
        </button>
      </div>
      
      {/* Appointments list */}
      <div>
        {userAppointments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            У вас пока нет записей. Нажмите "Получить ссылку", чтобы создать запись.
          </div>
        ) : (
          userAppointments.map(appointment => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onViewQR={setSelectedAppointment}
              onCancel={handleCancelAppointment}
            />
          ))
        )}
      </div>
      
      {/* Time bank section */}
      <TimeBankExchange
        appointments={userAppointments}
        onDonate={handleDonateAppointment}
        onViewQR={setSelectedAppointment}
      />
      
      {/* Appointment form modal */}
      {showAppointmentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-lg font-bold mb-4">Создание новой записи</h3>
            <AppointmentForm
              onSubmit={handleCreateAppointment}
              onCancel={() => setShowAppointmentForm(false)}
            />
          </div>
        </div>
      )}
      
      {/* QR code display modal */}
      {selectedAppointment && (
        <QRCodeDisplay
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      )}
    </div>
  );
};

export default UserInterface;
