
import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Appointment } from '../utils/types';
import { getOfficeById, currentUser } from '../utils/data';

interface QRCodeDisplayProps {
  appointment: Appointment;
  onClose: () => void;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ appointment, onClose }) => {
  const [showDetails, setShowDetails] = useState(false);
  const office = getOfficeById(appointment.officeId);
  
  // Create unique URL/content for QR code
  const qrCodeValue = `https://citytimebank.app/appointment/${appointment.id}`;
  
  const handleQRCodeClick = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Ваша цифровая ссылка</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        
        <div 
          className="flex flex-col items-center cursor-pointer" 
          onClick={handleQRCodeClick}
        >
          <QRCodeSVG value={qrCodeValue} size={200} />
          <p className="mt-2 text-sm text-gray-500">Нажмите на QR-код для {showDetails ? "скрытия" : "просмотра"} деталей</p>
        </div>
        
        {showDetails && (
          <div className="mt-4 border-t pt-4">
            <h4 className="font-medium">Личная информация:</h4>
            <p>Имя: {currentUser.name}</p>
            <p>Адрес: {currentUser.address}</p>
            <p>Телефон: {currentUser.phone}</p>
            <hr className="my-2" />
            <h4 className="font-medium">Информация о записи:</h4>
            <p>Направление: {appointment.direction}</p>
            <p>Офис: {office?.name}</p>
            <p>Адрес: {office?.address}</p>
            <p>Дата: {appointment.date}</p>
            <p>Время: {appointment.time}</p>
          </div>
        )}
        
        <div className="mt-6 flex flex-col gap-2">
          <button 
            className="btn-primary"
            onClick={() => {
              // In a real app, this would trigger download or sharing
              alert("QR-код сохранен");
            }}
          >
            Сохранить QR-код
          </button>
          <button className="btn-outline" onClick={onClose}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeDisplay;
