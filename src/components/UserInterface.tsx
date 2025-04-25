import React, { useState } from 'react'
import AppointmentCard from './AppointmentCard'
import QRCodeDisplay from './QRCodeDisplay'
import AppointmentForm from './AppointmentForm'
import TimeBankExchange from './TimeBankExchange'
import ServiceSearch from './ServiceSearch'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Appointment, AppointmentFormData } from '../utils/types'
import { appointments as initialAppointments, currentUser, generateId } from '../utils/data'

const UserInterface: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments)
  const [showAppointmentForm, setShowAppointmentForm] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  const handleCreateAppointment = (formData: AppointmentFormData) => {
    const activeAppointments = appointments.filter((app) => app.userId === currentUser.id && app.status === 'active')

    if (activeAppointments.length >= 2) {
      alert('Вы не можете создать больше 2 активных записей.')
      return
    }

    const newAppointment: Appointment = {
      id: generateId(),
      ...formData,
      userId: currentUser.id,
      status: 'active',
    }

    setAppointments([...appointments, newAppointment])
    setShowAppointmentForm(false)
  }

  const handleCancelAppointment = (appointmentId: string) => {
    if (confirm('Вы уверены, что хотите отменить запись?')) {
      setAppointments(appointments.map((app) => (app.id === appointmentId ? { ...app, status: 'cancelled' } : app)))
    }
  }

  const handleDonateAppointment = (appointmentId: string) => {
    setAppointments(appointments.map((app) => (app.id === appointmentId ? { ...app, status: 'cancelled' } : app)))

    alert('Запись успешно добавлена в тайм-банк для других пользователей.')
  }

  const userAppointments = appointments.filter((app) => app.userId === currentUser.id)
  const activeAppointmentsCount = userAppointments.filter((app) => app.status === 'active').length

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
        <h2 className="text-2xl font-semibold mb-4">Добро пожаловать, {currentUser.name}!</h2>
        {/* <ServiceSearch /> */}
      </div>

      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Ваши записи</h2>
          <Button
            onClick={() => setShowAppointmentForm(true)}
            disabled={activeAppointmentsCount >= 2}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Получить ссылку
          </Button>
        </div>

        <div className="space-y-4">
          {userAppointments.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <p className="text-gray-500">У вас пока нет записей. Нажмите "Получить ссылку", чтобы создать запись.</p>
            </div>
          ) : (
            userAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onViewQR={setSelectedAppointment}
                onCancel={handleCancelAppointment}
              />
            ))
          )}
        </div>
      </div>

      <TimeBankExchange
        appointments={userAppointments}
        onDonate={handleDonateAppointment}
        onViewQR={setSelectedAppointment}
      />

      {showAppointmentForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full">
            <h3 className="text-xl font-semibold mb-4">Создание новой записи</h3>
            <AppointmentForm onSubmit={handleCreateAppointment} onCancel={() => setShowAppointmentForm(false)} />
          </div>
        </div>
      )}

      {selectedAppointment && (
        <QRCodeDisplay appointment={selectedAppointment} onClose={() => setSelectedAppointment(null)} />
      )}
    </div>
  )
}

export default UserInterface
