
import React, { useState, useEffect } from 'react';
import { 
  directions, 
  offices, 
  getAvailableTimeSlots, 
  organizations 
} from '../utils/data';
import { AppointmentFormData } from '../utils/types';

interface AppointmentFormProps {
  onSubmit: (formData: AppointmentFormData) => void;
  onCancel: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<AppointmentFormData>({
    direction: '',
    officeId: '',
    date: '',
    time: '',
  });
  
  const [selectedOrgId, setSelectedOrgId] = useState<string>('');
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  
  // Generate available dates (next 7 days)
  useEffect(() => {
    const dates: string[] = [];
    const today = new Date();
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      
      dates.push(`${year}-${month}-${day}`);
    }
    
    setAvailableDates(dates);
  }, []);
  
  // Filter offices by organization
  const filteredOffices = selectedOrgId 
    ? offices.filter(office => office.organizationId === selectedOrgId) 
    : [];
  
  // Update available times when office and date change
  useEffect(() => {
    if (formData.officeId && formData.date) {
      const slots = getAvailableTimeSlots(formData.officeId, formData.date);
      setAvailableTimes(slots.map(slot => slot.time));
    } else {
      setAvailableTimes([]);
    }
  }, [formData.officeId, formData.date]);
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'organizationId') {
      setSelectedOrgId(value);
      setFormData(prev => ({ ...prev, officeId: '' })); // Reset office when org changes
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-group">
        <label className="block mb-1">Направление:</label>
        <select
          name="direction"
          value={formData.direction}
          onChange={handleChange}
          className="select-field"
          required
        >
          <option value="">Выберите направление</option>
          {directions.map((direction) => (
            <option key={direction} value={direction}>
              {direction}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="block mb-1">Организация:</label>
        <select
          name="organizationId"
          value={selectedOrgId}
          onChange={handleChange}
          className="select-field"
          required
        >
          <option value="">Выберите организацию</option>
          {organizations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="block mb-1">Мини-офис:</label>
        <select
          name="officeId"
          value={formData.officeId}
          onChange={handleChange}
          className="select-field"
          required
          disabled={!selectedOrgId}
        >
          <option value="">Выберите офис</option>
          {filteredOffices.map((office) => (
            <option key={office.id} value={office.id}>
              {office.name} - {office.address}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="block mb-1">Дата:</label>
        <select
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="select-field"
          required
          disabled={!formData.officeId}
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

      <div className="form-group">
        <label className="block mb-1">Время:</label>
        <select
          name="time"
          value={formData.time}
          onChange={handleChange}
          className="select-field"
          required
          disabled={!formData.date}
        >
          <option value="">Выберите время</option>
          {availableTimes.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Отмена
        </button>
        <button type="submit" className="btn-primary">
          Создать запись
        </button>
      </div>
    </form>
  );
};

export default AppointmentForm;
