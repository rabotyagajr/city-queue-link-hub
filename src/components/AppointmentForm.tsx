import React, { useState, useEffect } from 'react'
import { toast } from '@/components/ui/use-toast'
import { Check } from 'lucide-react'
import { motion } from 'framer-motion'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { directions, offices, getAvailableTimeSlots, organizations } from '../utils/data'
import { AppointmentFormData } from '../utils/types'

interface AppointmentFormProps {
  onSubmit: (formData: AppointmentFormData) => void
  onCancel: () => void
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<AppointmentFormData>({
    direction: '',
    officeId: '',
    date: '',
    time: '',
  })

  const [selectedOrgId, setSelectedOrgId] = useState<string>('')
  const [availableDates, setAvailableDates] = useState<Date[]>([])
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null)
  const [availableTimes, setAvailableTimes] = useState<string[]>([])

  // Generate available dates (next 7 days)
  useEffect(() => {
    const dates: Date[] = []
    const today = new Date()

    for (let i = 1; i <= 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(date)
    }

    setAvailableDates(dates)
  }, [])

  // Filter offices by organization
  const filteredOffices = selectedOrgId ? offices.filter((office) => office.organizationId === selectedOrgId) : []

  // Update available times when office changes
  useEffect(() => {
    if (formData.officeId && formData.date) {
      const slots = getAvailableTimeSlots(formData.officeId, formData.date)
      setAvailableTimes(slots.map((slot) => slot.time))
    } else {
      setAvailableTimes([])
    }
  }, [formData.officeId, formData.date])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name === 'organizationId') {
      setSelectedOrgId(value)
      setFormData((prev) => ({ ...prev, officeId: '', date: '', time: '' }))
      setSelectedDateTime(null)
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleDateTimeChange = (date: Date | null) => {
    setSelectedDateTime(date)
    if (date) {
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const formattedDate = `${year}-${month}-${day}`
      const formattedTime = `${hours}:${minutes}`
      setFormData((prev) => ({ ...prev, date: formattedDate, time: formattedTime }))
    } else {
      setFormData((prev) => ({ ...prev, date: '', time: '' }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)

    toast({
      title: 'Запись создана',
      description: 'Ваша запись успешно добавлена в очередь',
      action: (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-green-500 text-white p-2 rounded-full">
          <Check className="h-4 w-4" />
        </motion.div>
      ),
    })
  }

  // Filter available times for the date picker
  const filterTime = (time: Date) => {
    const formattedTime = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`
    return availableTimes.includes(formattedTime)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-lg shadow-md">
      <div className="form-group">
        <label className="block mb-2 text-sm font-medium text-gray-700">Направление:</label>
        <select
          name="direction"
          value={formData.direction}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
        <label className="block mb-2 text-sm font-medium text-gray-700">Организация:</label>
        <select
          name="organizationId"
          value={selectedOrgId}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
        <label className="block mb-2 text-sm font-medium text-gray-700">Мини-офис:</label>
        <select
          name="officeId"
          value={formData.officeId}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
        <label className="block mb-2 text-sm font-medium text-gray-700">Дата и время:</label>
        <DatePicker
          selected={selectedDateTime}
          onChange={handleDateTimeChange}
          includeDates={availableDates}
          showTimeSelect
          timeIntervals={30}
          filterTime={filterTime}
          dateFormat="dd.MM.yyyy HH:mm"
          placeholderText="Выберите дату и время"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          wrapperClassName="w-full"
          required
          disabled={!formData.officeId}
          popperClassName="z-50"
          calendarClassName="bg-white border border-gray-200 rounded-lg shadow-lg"
          customInput={
            <input
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Выберите дату и время"
            />
          }
        />
      </div>

      <div className="flex justify-end gap-3 mt-8">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          Отмена
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          disabled={!formData.date || !formData.time}
        >
          Создать запись
        </button>
      </div>

      <style jsx global>{`
        .react-datepicker {
          font-family: 'Inter', sans-serif;
          border: none;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .react-datepicker__header {
          background-color: #3b82f6;
          color: white;
          border-bottom: none;
          padding: 12px;
        }
        .react-datepicker__day-name,
        .react-datepicker__day,
        .react-datepicker__time-name {
          color: #1f2937;
        }
        .react-datepicker__day--selected,
        .react-datepicker__day--keyboard-selected {
          background-color: #3b82f6;
          color: white !important;
          border-radius: 4px;
        }
        .react-datepicker__day:hover {
          background-color: #e5e7eb;
          border-radius: 4px;
        }
        .react-datepicker__time-container {
          border-left: 1px solid #e5e7eb;
        }
        .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item {
          padding: 8px;
          color: #1f2937;
        }
        .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item:hover {
          background-color: #e5e7eb;
        }
        .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--selected {
          background-color: #3b82f6;
          color: white !important;
        }
        .react-datepicker__navigation-icon::before {
          border-color: white;
        }
      `}</style>
    </form>
  )
}

export default AppointmentForm;