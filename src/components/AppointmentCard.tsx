import React from 'react'
import { Appointment } from '../utils/types'
import { getOfficeById } from '../utils/data'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QrCode, X } from 'lucide-react'

interface AppointmentCardProps {
  appointment: Appointment
  onViewQR: (appointment: Appointment) => void
  onCancel?: (appointmentId: string) => void
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, onViewQR, onCancel }) => {
  const office = getOfficeById(appointment.officeId)

  const formatDate = (dateString: string): string => {
    const [year, month, day] = dateString.split('-')
    return `${day}.${month}.${year}`
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{appointment.direction}</h3>
            <p className="text-gray-600">{office?.name}</p>
            <p className="text-gray-600">
              {formatDate(appointment.date)} в {appointment.time}
            </p>
            <div className="mt-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  appointment.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : appointment.status === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                }`}
              >
                {appointment.status === 'active'
                  ? 'Активна'
                  : appointment.status === 'cancelled'
                    ? 'Отменена'
                    : 'Завершена'}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={() => onViewQR(appointment)}>
              <QrCode className="h-4 w-4" />
              QR-код
            </Button>

            {appointment.status === 'active' && onCancel && (
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-2"
                onClick={() => onCancel(appointment.id)}
              >
                <X className="h-4 w-4" />
                Отменить
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default AppointmentCard
