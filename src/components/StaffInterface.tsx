
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { QrCode, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import QrScanner from 'qr-scanner';

interface Appointment {
  id: string;
  userId: string;
  userName: string;
  direction: string;
  date: string;
  time: string;
  status: 'active' | 'completed' | 'cancelled';
}

const StaffInterface = () => {
  const [scanning, setScanning] = useState(false);
  const [scannedAppointment, setScannedAppointment] = useState<Appointment | null>(null);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const [scanner, setScanner] = useState<QrScanner | null>(null);

  const startScanning = async () => {
    setScanning(true);
    const video = document.createElement('video');
    setVideoElement(video);

    try {
      const newScanner = new QrScanner(
        video,
        (result) => handleScanResult(result.data),
        { returnDetailedScanResult: true }
      );
      
      await newScanner.start();
      setScanner(newScanner);
    } catch (err) {
      toast({
        title: "Ошибка",
        description: "Не удалось получить доступ к камере",
        variant: "destructive"
      });
      setScanning(false);
    }
  };

  const stopScanning = () => {
    if (scanner) {
      scanner.destroy();
      setScanner(null);
    }
    if (videoElement) {
      videoElement.remove();
      setVideoElement(null);
    }
    setScanning(false);
  };

  const handleScanResult = (qrData: string) => {
    try {
      // In a real app, this would be an API call to validate the QR code
      // For demo, we'll simulate finding the appointment
      const appointmentId = qrData.split('/').pop();
      const mockAppointment: Appointment = {
        id: appointmentId || '123',
        userId: 'user123',
        userName: 'Иван Петров',
        direction: 'Консультация',
        date: '2024-04-25',
        time: '14:00',
        status: 'active'
      };

      setScannedAppointment(mockAppointment);
      stopScanning();
      
      toast({
        title: "QR-код успешно отсканирован",
        description: "Информация о записи получена",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Недействительный QR-код",
        variant: "destructive"
      });
    }
  };

  const completeAppointment = () => {
    if (scannedAppointment) {
      // In a real app, this would be an API call
      toast({
        title: "Встреча завершена",
        description: "Статус записи обновлен",
      });
      setScannedAppointment(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800">
          <h2 className="text-2xl font-semibold mb-2">Панель сотрудника</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Отсканируйте QR-код клиента для проверки записи
          </p>
        </div>

        <div className="grid gap-6">
          {!scanning && !scannedAppointment && (
            <Button onClick={startScanning} className="w-full gap-2">
              <QrCode className="h-4 w-4" />
              Сканировать QR-код
            </Button>
          )}

          {scanning && (
            <Card className="p-6 text-center">
              <div className="mb-4">
                <div id="scanner-container" className="aspect-square max-w-sm mx-auto bg-black rounded-lg overflow-hidden">
                  {/* Video element will be inserted here by QR Scanner */}
                </div>
              </div>
              <Button onClick={stopScanning} variant="outline">
                Отменить сканирование
              </Button>
            </Card>
          )}

          {scannedAppointment && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Информация о записи</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Клиент:</span> {scannedAppointment.userName}</p>
                  <p><span className="font-medium">Направление:</span> {scannedAppointment.direction}</p>
                  <p><span className="font-medium">Дата:</span> {scannedAppointment.date}</p>
                  <p><span className="font-medium">Время:</span> {scannedAppointment.time}</p>
                  <p><span className="font-medium">Статус:</span> {
                    scannedAppointment.status === 'active' ? 
                      'Активна' : 
                      scannedAppointment.status === 'completed' ? 
                        'Завершена' : 
                        'Отменена'
                  }</p>
                </div>
                
                {scannedAppointment.status === 'active' && (
                  <Button 
                    onClick={completeAppointment}
                    className="w-full mt-4 gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Завершить встречу
                  </Button>
                )}
              </Card>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default StaffInterface;
