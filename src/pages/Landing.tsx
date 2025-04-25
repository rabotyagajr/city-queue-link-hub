
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Clock, Users, Star, ArrowRight } from 'lucide-react'
import LoginForm from '../components/LoginForm'

const Landing: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="w-full py-4 px-4 md:px-8 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            <h1 className="text-lg md:text-2xl font-bold text-gray-900">Городской тайм-банк</h1>
          </div>
        </div>
      </header>

      <main className="pt-8 md:pt-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Управляйте своим временем <span className="text-primary">эффективно</span>
            </h2>
            <p className="text-base md:text-lg text-gray-700 max-w-lg">
              Городской тайм-банк помогает жителям города экономить время при получении государственных услуг без
              очередей и ожидания.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="w-full sm:w-auto group"
                onClick={() => document.getElementById('login-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Войти в систему
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: Clock, title: 'Экономия времени', desc: 'Бронируйте слоты заранее' },
                { icon: Users, title: 'Обмен слотами', desc: 'Делитесь с другими пользователями' },
                { icon: Star, title: 'Удобный сервис', desc: 'Простое управление записями' },
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * (idx + 1) }}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <feature.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-sm md:text-base text-gray-600 mt-1">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Login Section */}
          <motion.div
            id="login-section"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-4 md:p-8 mx-4 sm:mx-auto max-w-md w-full lg:w-auto"
          >
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">Вход в систему</h2>
            <LoginForm />

            <div className="mt-8 pt-6 border-t text-xs md:text-sm text-gray-500">
              <p className="mb-2">Тестовые аккаунты:</p>
              <p>• Пользователь: user@test.com / 123456</p>
              <p>• Администратор: admin@test.com / admin123</p>
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="mt-20 bg-white/70 backdrop-blur-sm py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600 text-xs md:text-sm">&copy; 2024 Городской тайм-банк. Все права защищены.</p>
          <div className="mt-4 space-x-4 flex flex-wrap justify-center gap-2">
            <a href="#" className="text-gray-600 hover:text-primary text-xs md:text-sm transition-colors">
              Помощь
            </a>
            <a href="#" className="text-gray-600 hover:text-primary text-xs md:text-sm transition-colors">
              Правила использования
            </a>
            <a href="#" className="text-gray-600 hover:text-primary text-xs md:text-sm transition-colors">
              Конфиденциальность
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
