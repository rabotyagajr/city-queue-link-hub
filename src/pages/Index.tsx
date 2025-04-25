import React, { useState } from 'react'
import Header from '../components/Header'
import UserInterface from '../components/UserInterface'
import AdminInterface from '../components/AdminInterface'
import StaffInterface from '../components/StaffInterface'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Calendar, Users, Clock, LogOut } from 'lucide-react'

const Index: React.FC = () => {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<'user' | 'admin-org' | 'admin-dev' | 'staff'>(() => {
    if (user?.role === 'admin') return 'admin-org'
    if (user?.role === 'staff') return 'staff'
    return 'user'
  })

  const handleLogout = () => {
    logout()
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-primary/5 dark:bg-primary/10 py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Добро пожаловать, {user?.name || 'Пользователь'}!
          </div>
          <Button variant="ghost" size="sm" onClick={logout} className="text-gray-600 dark:text-gray-400 gap-1">
            <LogOut className="h-4 w-4" />
            Выйти
          </Button>
        </div>
      </div>

      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="app-container py-8">
        {activeTab === 'user' && <UserInterface />}
        {activeTab === 'staff' && <StaffInterface />}
        {(activeTab === 'admin-org' || activeTab === 'admin-dev') && (
          <AdminInterface type={activeTab === 'admin-org' ? 'organization' : 'developer'} />
        )}
      </div>

      <footer className="bg-white border-t mt-auto py-8">
        <div className="app-container text-center">
          <p className="text-gray-600 text-sm">&copy; 2024 Городской тайм-банк. Все права защищены.</p>
          <div className="mt-4 space-x-4">
            <a href="#" className="text-gray-600 hover:text-primary text-sm transition-colors">
              Помощь
            </a>
            <a href="#" className="text-gray-600 hover:text-primary text-sm transition-colors">
              Правила использования
            </a>
            <a href="#" className="text-gray-600 hover:text-primary text-sm transition-colors">
              Конфиденциальность
            </a>
          </div>
        </div>
      </footer>
    </motion.div>
  )
}

export default Index
