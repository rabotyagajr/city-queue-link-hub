
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowRight } from 'lucide-react'

interface FormData {
  phone: string
  firstName: string
  lastName: string
  middleName: string
  passportSeries: string
  passportNumber: string
  city: string
  address: string
  snils: string
  password: string
}

const RegistrationForm: React.FC = () => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    phone: '',
    firstName: '',
    lastName: '',
    middleName: '',
    passportSeries: '',
    passportNumber: '',
    city: '',
    address: '',
    snils: '',
    password: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Here you would typically make an API call to register the user
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {step === 1 ? (
        <motion.form
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          onSubmit={handlePhoneSubmit}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="phone">Номер телефона</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+7 (___) ___-__-__"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full"
            />
          </div>
          <Button type="submit" className="w-full group">
            Продолжить
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.form>
      ) : (
        <motion.form
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="lastName">Фамилия</Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="firstName">Имя</Label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="middleName">Отчество</Label>
            <Input
              id="middleName"
              name="middleName"
              type="text"
              value={formData.middleName}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="passportSeries">Серия паспорта</Label>
              <Input
                id="passportSeries"
                name="passportSeries"
                type="text"
                maxLength={4}
                value={formData.passportSeries}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passportNumber">Номер паспорта</Label>
              <Input
                id="passportNumber"
                name="passportNumber"
                type="text"
                maxLength={6}
                value={formData.passportNumber}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">Город</Label>
            <Input
              id="city"
              name="city"
              type="text"
              value={formData.city}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Адрес проживания</Label>
            <Input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="snils">СНИЛС</Label>
            <Input
              id="snils"
              name="snils"
              type="text"
              placeholder="XXX-XXX-XXX XX"
              value={formData.snils}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
              className="w-1/2"
            >
              Назад
            </Button>
            <Button type="submit" className="w-1/2">
              Зарегистрироваться
            </Button>
          </div>
        </motion.form>
      )}
    </div>
  )
}

export default RegistrationForm
