import React, { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import 'leaflet-routing-machine'
import domtoimage from 'dom-to-image'
import { Appointment } from '../utils/types'
import { getOfficeById, currentUser } from '../utils/data'

interface QRCodeDisplayProps {
  appointment: Appointment
  onClose: () => void
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ appointment, onClose }) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const office = getOfficeById(appointment.officeId)
  const qrCodeValue = `https://citytimebank.app/appointment/${appointment.id}`

  // Имитация координат для адресов
  const addressCoordinates = {
    'ул. Ленина, 10': [55.7558, 37.6173],
    'ул. Центральная, 5': [55.7512, 37.6225],
  }

  const userCoords = addressCoordinates[currentUser.address] || [55.7558, 37.6173]
  const officeCoords = addressCoordinates[office?.address] || [55.7512, 37.6225]

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleShowMap = () => {
    setShowMap(true)
  }

  const handleCloseMap = () => {
    setShowMap(false)
  }

  const handleSaveQRCode = () => {
    const qrElement = document.getElementById('qr-code')
    
    if (!qrElement) {
      console.error('QR code element not found')
      return
    }

    // Ensure the element is visible and has proper dimensions
    qrElement.style.backgroundColor = 'white'
    qrElement.style.padding = '10px'

    domtoimage
      .toPng(qrElement, {
        quality: 1,
        bgcolor: '#ffffff',
        width: qrElement.offsetWidth,
        height: qrElement.offsetHeight,
      })
      .then((dataUrl) => {
        const link = document.createElement('a')
        link.download = `appointment_${appointment.id}_qrcode.png`
        link.href = dataUrl
        link.click()
      })
      .catch((error) => {
        console.error('Ошибка сохранения QR-кода:', error)
      })
  }

  useEffect(() => {
    if (showMap) {
      const map = L.map('map', {
        zoomControl: true,
        scrollWheelZoom: false,
      }).setView(userCoords, 13)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map)

      const DefaultIcon = L.Icon.extend({
        options: {
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        },
      })

      const userIcon = new DefaultIcon({
        className: 'user-icon',
        html: `<div style="filter: hue-rotate(200deg); transform: scale(0); transition: transform 0.5s ease-in-out;"></div>`,
      })

      const officeIcon = new DefaultIcon({
        className: 'office-icon',
        html: `<div style="filter: hue-rotate(120deg); transform: scale(0); transition: transform 0.5s ease-in-out;"></div>`,
      })

      const fallbackUserIcon = L.divIcon({
        className: 'custom-icon-user',
        html: `
          <div style="
            background-color: #3b82f6 !important;
            width: 24px !important;
            height: 24px !important;
            border-radius: 50% !important;
            border: 2px solid white !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3) !important;
            transform: scale(0) !important;
            transition: transform 0.5s ease-in-out !important;
            z-index: 1000 !important;
          "></div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12],
      })

      const fallbackOfficeIcon = L.divIcon({
        className: 'custom-icon-office',
        html: `
          <div style="
            background-color: #10b981 !important;
            width: 24px !important;
            height: 24px !important;
            border-radius: 50% !important;
            border: 2px solid white !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3) !important;
            transform: scale(0) !important;
            transition: transform 0.5s ease-in-out !important;
            z-index: 1000 !important;
          "></div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12],
      })

      const finalUserIcon = userIcon.options.iconUrl ? userIcon : fallbackUserIcon
      const finalOfficeIcon = officeIcon.options.iconUrl ? officeIcon : fallbackOfficeIcon

      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(userCoords[0], userCoords[1]),
          L.latLng(officeCoords[0], officeCoords[1])
        ],
        router: L.Routing.osrmv1({
          serviceUrl: 'https://router.project-osrm.org/route/v1'
        }),
        lineOptions: {
          styles: [{ color: 'blue', weight: 4, opacity: 0.8 }],
          extendToWaypoints: true,
          missingRouteTolerance: 100
        },
        createMarker: (i: number, waypoint: any, n: number) => {
          const icon = i === 0 ? finalUserIcon : finalOfficeIcon
          const popupText = i === 0 ? 'Ваше местоположение' : (office?.name || 'Офис')
          const marker = L.marker(waypoint.latLng, { icon })
          setTimeout(() => {
            if (marker._icon) {
              marker._icon.style.transform = 'scale(1)'
              marker._icon.style.zIndex = '1000'
            }
            if (i === 0) marker.openPopup()
          }, 500 + i * 500)
          return marker.bindPopup(popupText)
        },
        show: false,
        addWaypoints: false,
        fitSelectedRoutes: true,
        showAlternatives: false
      }).addTo(map)

      setTimeout(() => {
        map.fitBounds([userCoords, officeCoords], { animate: true, duration: 1 })
      }, 2000)

      return () => {
        routingControl.remove()
        map.remove()
      }
    }
  }, [showMap, userCoords, officeCoords])

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Ваша цифровая ссылка</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>

        <div
          className="relative h-64 cursor-pointer perspective"
          onClick={handleCardFlip}
          style={{ perspective: '1000px' }}
        >
          <div
            className="relative w-full h-full transition-transform duration-500 ease-in-out"
            style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
          >
            <div
              className="absolute w-full h-full flex flex-col items-center justify-center bg-white"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div id="qr-code">
                <QRCodeSVG value={qrCodeValue} size={200} />
              </div>
              <p className="mt-2 text-sm text-gray-500">Нажмите для просмотра деталей</p>
            </div>

            <div
              className="absolute w-full h-full bg-white p-4 overflow-y-auto"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <div className="h-full flex flex-col justify-center">
                <h4 className="font-medium mb-2">Личная информация:</h4>
                <p>Имя: {currentUser.name}</p>
                <p>Адрес: {currentUser.address}</p>
                <p>Телефон: {currentUser.phone || 'Не указан'}</p>

                <h4 className="font-medium mt-4 mb-2">Информация о записи:</h4>
                <p>Направление: {appointment.direction}</p>
                <p>Офис: {office?.name}</p>
                <p>Адрес: {office?.address}</p>
                <p>Дата: {appointment.date}</p>
                <p>Время: {appointment.time}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <button
            className="flex items-center justify-center gap-2 border-2 border-blue-500 text-blue-500 bg-white px-4 py-2 rounded-md hover:bg-blue-500 hover:text-white transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-300"
            onClick={handleSaveQRCode}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Сохранить QR-код
          </button>
          <button
            className="flex items-center justify-center gap-2 border-2 border-green-500 text-green-500 bg-white px-4 py-2 rounded-md hover:bg-green-500 hover:text-white transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-green-300"
            onClick={handleShowMap}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447-2.724A1 1 0 0021 13.382V2.618a1 1 0 00-1.447-.894L15 4m0 13l-6-3"
              />
            </svg>
            Проложить маршрут
          </button>
          <button
            className="flex items-center justify-center gap-2 border-2 border-gray-500 text-gray-500 bg-white px-4 py-2 rounded-md hover:bg-gray-500 hover:text-white transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-gray-300"
            onClick={onClose}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
            </svg>
            Закрыть
          </button>
        </div>
      </div>

      {showMap && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full animate-slideInScale">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Маршрут к офису</h3>
              <button onClick={handleCloseMap} className="text-gray-500 hover:text-gray-700">
                ×
              </button>
            </div>
            <div id="map" className="w-full h-64 rounded shadow-md" style={{ zIndex: 10 }}></div>
            <p className="mt-2 text-sm text-gray-500">
              От: {currentUser.address} <br />
              До: {office?.address}
            </p>
            <button
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 w-full"
              onClick={handleCloseMap}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default QRCodeDisplay

// Стили для анимации
const styles = `
  .animate-slideInScale {
    animation: slideInScale 0.5s ease-in-out;
  }
  @keyframes slideInScale {
    from {
      transform: translateY(-100%) scale(0.8);
      opacity: 0;
    }
    to {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  }
  .leaflet-routing-container {
    display: none;
  }
  .custom-icon-user, .custom-icon-office {
    margin: 0 !important;
    z-index: 1000 !important;
  }
  .user-icon, .office-icon {
    z-index: 1000 !important;
  }
  #map {
    z-index: 10 !important;
  }
  #qr-code {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`

// Добавление стилей в документ
const styleSheet = document.createElement('style')
styleSheet.innerText = styles
document.head.appendChild(styleSheet)