
import React, { useState } from 'react';
import { offices, organizations, timeSlots, appointments } from '../utils/data';
import { Office, TimeSlot, Appointment } from '../utils/types';

interface AdminInterfaceProps {
  type: 'organization' | 'developer';
}

const AdminInterface: React.FC<AdminInterfaceProps> = ({ type }) => {
  const [selectedOrg, setSelectedOrg] = useState<string>('');
  const [selectedOffice, setSelectedOffice] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  
  // Generate available dates (next 7 days)
  const availableDates: string[] = [];
  const today = new Date();
  
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    availableDates.push(`${year}-${month}-${day}`);
  }
  
  // Filter offices by organization
  const filteredOffices = selectedOrg 
    ? offices.filter(office => office.organizationId === selectedOrg) 
    : [];
  
  // Filter time slots by office and date
  const filteredSlots = (selectedOffice && selectedDate) 
    ? timeSlots.filter(slot => 
        slot.officeId === selectedOffice && 
        slot.date === selectedDate
      )
    : [];
  
  // Filter appointments by office
  const filteredAppointments = selectedOffice
    ? appointments.filter(app => app.officeId === selectedOffice)
    : [];
  
  // Calculate slot statistics
  const totalSlots = filteredSlots.length;
  const bookedSlots = filteredSlots.filter(slot => !slot.isAvailable).length;
  const bookingPercentage = totalSlots > 0 
    ? Math.round((bookedSlots / totalSlots) * 100) 
    : 0;
  
  const handleToggleSlotAvailability = (slotId: string) => {
    // In a real app, this would update the availability in the database
    alert(`Изменение доступности слота ${slotId} (в реальном приложении это обновило бы базу данных)`);
  };
  
  const handleBlockAppointment = (appointmentId: string) => {
    // In a real app, this would block the appointment
    if (confirm('Вы уверены, что хотите заблокировать эту запись?')) {
      alert(`Запись ${appointmentId} заблокирована (в реальном приложении это обновило бы базу данных)`);
    }
  };
  
  return (
    <div>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">
          {type === 'organization' ? 'Панель администратора организации' : 'Панель администратора разработчика'}
        </h2>
        <p className="text-gray-600">
          {type === 'organization' 
            ? 'Управление слотами времени и мини-офисами, мониторинг нагрузки.' 
            : 'Полный доступ ко всем данным, управление ссылками.'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block mb-1">Организация:</label>
          <select
            value={selectedOrg}
            onChange={(e) => {
              setSelectedOrg(e.target.value);
              setSelectedOffice('');
            }}
            className="select-field"
          >
            <option value="">Выберите организацию</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block mb-1">Мини-офис:</label>
          <select
            value={selectedOffice}
            onChange={(e) => setSelectedOffice(e.target.value)}
            className="select-field"
            disabled={!selectedOrg}
          >
            <option value="">Выберите офис</option>
            {filteredOffices.map((office) => (
              <option key={office.id} value={office.id}>
                {office.name} - {office.address}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block mb-1">Дата:</label>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="select-field"
            disabled={!selectedOffice}
          >
            <option value="">Выберите дату</option>
            {availableDates.map((date) => {
              const [year, month, day] = date.split('-');
              const formattedDate = `${day}.${month}.${year}`;
              return (
                <option key={date} value={date}>
                  {formattedDate}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      
      {selectedOffice && selectedDate && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Управление слотами времени</h3>
            <div className="text-sm text-gray-600">
              Заполненность: {bookedSlots}/{totalSlots} ({bookingPercentage}%)
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Время</th>
                  <th className="border p-2 text-left">Статус</th>
                  <th className="border p-2 text-left">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredSlots.map((slot) => (
                  <tr key={slot.id} className="hover:bg-gray-50">
                    <td className="border p-2">{slot.time}</td>
                    <td className="border p-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        slot.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {slot.isAvailable ? 'Доступен' : 'Занят'}
                      </span>
                    </td>
                    <td className="border p-2">
                      <button
                        className="text-blue-600 hover:text-blue-800 text-sm"
                        onClick={() => handleToggleSlotAvailability(slot.id)}
                      >
                        {slot.isAvailable ? 'Сделать недоступным' : 'Сделать доступным'}
                      </button>
                    </td>
                  </tr>
                ))}
                
                {filteredSlots.length === 0 && (
                  <tr>
                    <td colSpan={3} className="border p-4 text-center text-gray-500">
                      Нет доступных слотов для выбранных параметров
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Developer-only section */}
      {type === 'developer' && selectedOffice && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Управление ссылками</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">ID</th>
                  <th className="border p-2 text-left">Направление</th>
                  <th className="border p-2 text-left">Дата и время</th>
                  <th className="border p-2 text-left">Статус</th>
                  <th className="border p-2 text-left">ID пользователя</th>
                  <th className="border p-2 text-left">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="border p-2">{app.id}</td>
                    <td className="border p-2">{app.direction}</td>
                    <td className="border p-2">{app.date} {app.time}</td>
                    <td className="border p-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        app.status === 'active' ? 'bg-green-100 text-green-800' : 
                        app.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {app.status === 'active' ? 'Активна' : 
                         app.status === 'cancelled' ? 'Отменена' : 'Завершена'}
                      </span>
                    </td>
                    <td className="border p-2">{app.userId}</td>
                    <td className="border p-2">
                      <button
                        className="text-red-600 hover:text-red-800 text-sm"
                        onClick={() => handleBlockAppointment(app.id)}
                        disabled={app.status !== 'active'}
                      >
                        Заблокировать
                      </button>
                    </td>
                  </tr>
                ))}
                
                {filteredAppointments.length === 0 && (
                  <tr>
                    <td colSpan={6} className="border p-4 text-center text-gray-500">
                      Нет записей для выбранного офиса
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInterface;
