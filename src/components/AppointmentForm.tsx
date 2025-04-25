import React, { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Check, Search, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  directions,
  offices,
  organizations,
  getAvailableTimeSlots,
  currentUser,
} from '../utils/data';
import { AppointmentFormData } from '../utils/types';

interface AppointmentFormProps {
  onSubmit: (formData: AppointmentFormData) => void;
  onCancel: () => void;
  initialOfficeId?: string;
  initialOrgId?: string;
  initialDirection?: string;
}

interface ServiceResult {
  type: 'office' | 'service';
  title: string;
  id: string;
  organizationId?: string;
  isRecommended?: boolean;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  onSubmit,
  onCancel,
  initialOfficeId = '',
  initialOrgId = '',
  initialDirection = '',
}) => {
  const [formData, setFormData] = useState<AppointmentFormData>({
    direction: initialDirection,
    officeId: initialOfficeId,
    date: '',
    time: '',
  });
  const [selectedOrgId, setSelectedOrgId] = useState(initialOrgId);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ServiceResult[]>([]);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Инициализация начальных значений и сброс при изменении пропсов
  useEffect(() => {
    console.log('[AppointmentForm] Received props:', { initialOfficeId, initialOrgId, initialDirection });
    setFormData({
      direction: initialDirection,
      officeId: initialOfficeId,
      date: '',
      time: '',
    });
    setSelectedOrgId(initialOrgId);
    setSelectedDate(null);
  }, [initialOfficeId, initialOrgId, initialDirection]);

  // Генерация доступных дат
  useEffect(() => {
    const dates: Date[] = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    setAvailableDates(dates);
    console.log('[AppointmentForm] Available dates:', dates);
  }, []);

  // Получение доступных временных слотов
  useEffect(() => {
    if (formData.officeId && formData.date) {
      const slots = getAvailableTimeSlots(formData.officeId, formData.date);
      setAvailableTimes(slots.map((slot) => slot.time));
    } else {
      setAvailableTimes([]);
    }
    console.log('[AppointmentForm] Available times:', availableTimes);
  }, [formData.officeId, formData.date]);

  // Логика поиска
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();

    const matchingServices = directions
      .filter((direction) => direction.toLowerCase().includes(query))
      .map((direction) => ({
        type: 'service' as const,
        title: direction,
        id: direction,
      }));

    const isOfficeRecommended = (officeAddress: string) => {
      if (!currentUser?.address || typeof officeAddress !== 'string') return false;
      const userStreet = currentUser.address
        .toLowerCase()
        .split(',')
        .map((part) => part.trim())
        .find((part) => part.includes('ул.') || part.includes('пр.')) || '';
      const officeStreet = officeAddress
        .toLowerCase()
        .split(',')
        .map((part) => part.trim())
        .find((part) => part.includes('ул.') || part.includes('пр.')) || '';
      return userStreet && officeStreet && userStreet === officeStreet;
    };

    const matchingOffices = offices
      .filter(
        (office) =>
          office &&
          typeof office.name === 'string' &&
          typeof office.address === 'string' &&
          (office.name.toLowerCase().includes(query) || office.address.toLowerCase().includes(query))
      )
      .map((office) => ({
        type: 'office' as const,
        title: `${office.name} (${office.address})`,
        id: office.id,
        organizationId: office.organizationId,
        isRecommended: isOfficeRecommended(office.address),
      }));

    const combinedResults = [...matchingServices, ...matchingOffices];
    setSearchResults(combinedResults);
    console.log('[AppointmentForm] Search results:', combinedResults);
  }, [searchQuery]);

  const handleSearchSelect = (result: ServiceResult) => {
    console.log('[AppointmentForm] Selected search result:', result);
    if (result.type === 'office') {
      const office = offices.find((o) => o.id === result.id);
      if (office) {
        setFormData((prev) => ({ ...prev, officeId: office.id }));
        setSelectedOrgId(office.organizationId);
      } else {
        console.error('[AppointmentForm] Office not found:', result.id);
      }
    } else {
      setFormData((prev) => ({ ...prev, direction: result.title }));
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  const filteredOffices = selectedOrgId
    ? offices.filter((office) => office.organizationId === selectedOrgId)
    : [];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log('[AppointmentForm] Form change:', { name, value });

    if (name === 'organizationId') {
      setSelectedOrgId(value);
      setFormData((prev) => ({ ...prev, officeId: '', date: '', time: '' }));
      setSelectedDate(null);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    console.log('[AppointmentForm] Selected date:', date);

    if (!date) {
      setFormData((prev) => ({ ...prev, date: '', time: '' }));
      return;
    }

    const formattedDate = date.toISOString().split('T')[0];
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;

    setFormData((prev) => ({
      ...prev,
      date: formattedDate,
      time: formattedTime,
    }));
  };

  const filterTime = (time: Date) => {
    const formatted = time.toTimeString().slice(0, 5);
    return availableTimes.includes(formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[AppointmentForm] Form submitted:', formData);
    onSubmit(formData);

    toast({
      title: 'Запись создана',
      description: 'Ваша запись успешно добавлена в очередь',
      action: (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-green-500 text-white p-2 rounded-full"
        >
          <Check className="h-4 w-4" />
        </motion.div>
      ),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
      <div className="relative">
        <label className="block mb-2">Поиск услуг и офисов:</label>
        <div className="flex items-center gap-2 border rounded-md p-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Введите услугу или офис..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full focus:outline-none"
          />
        </div>
        {searchResults.length > 0 && (
          <div className="absolute z-10 w-full bg-white border rounded-md mt-1 max-h-60 overflow-auto shadow-md">
            {searchResults.map((result) => (
              <div
                key={`${result.type}-${result.id}`}
                onClick={() => handleSearchSelect(result)}
                className="flex items-center justify-between py-2 px-4 cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-3">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <span>{result.title}</span>
                </div>
                {result.isRecommended && (
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <Star className="h-3 w-3" />
                    Рекомендовано
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
        {searchQuery.trim() && searchResults.length === 0 && (
          <div className="absolute z-10 w-full bg-white border rounded-md mt-1 p-4 text-center text-sm text-gray-500 shadow-md">
            Ничего не найдено
          </div>
        )}
      </div>

      <div>
        <label className="block mb-2">Направление:</label>
        <select
          name="direction"
          value={formData.direction}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">Выберите направление</option>
          {directions.map((dir) => (
            <option key={dir} value={dir}>
              {dir}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-2">Организация:</label>
        <select
          name="organizationId"
          value={selectedOrgId}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
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
        <label className="block mb-2">Мини-офис:</label>
        <select
          name="officeId"
          value={formData.officeId}
          onChange={handleChange}
          required
          disabled={!selectedOrgId}
          className="w-full p-2 border rounded"
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
        <label className="block mb-2">Дата и время:</label>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          includeDates={availableDates}
          showTimeSelect
          timeIntervals={30}
          filterTime={filterTime}
          dateFormat="dd.MM.yyyy HH:mm"
          placeholderText="Выберите дату и время"
          disabled={!formData.officeId}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Отмена
        </button>
        <button
          type="submit"
          disabled={!formData.direction || !formData.officeId || !formData.date || !formData.time}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          Создать запись
        </button>
      </div>
    </form>
  );
};

export default AppointmentForm;