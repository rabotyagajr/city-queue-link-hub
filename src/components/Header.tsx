
import React from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'
import { User, ShieldCheck, Settings, Clock } from 'lucide-react'

interface HeaderProps {
  activeTab: 'user' | 'admin-org' | 'admin-dev' | 'staff'
  setActiveTab: (tab: 'user' | 'admin-org' | 'admin-dev' | 'staff') => void
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const isStaff = user?.role === 'staff'

  return (
    <motion.header
      className="bg-white border-b sticky top-0 z-50 shadow-sm"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="app-container">
        <div className="flex flex-col md:flex-row md:justify-between items-center py-4 space-y-4 md:space-y-0">
          <motion.h1
            className="text-xl md:text-2xl font-bold text-primary cursor-pointer hover:opacity-90 transition-opacity flex items-center gap-2"
            onClick={() => setActiveTab(isAdmin ? 'admin-org' : isStaff ? 'staff' : 'user')}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <Clock className="h-5 w-5 md:h-6 md:w-6" />
            Городской тайм-банк
          </motion.h1>

          <nav className="flex flex-wrap justify-center gap-2 w-full md:w-auto">
            {isAdmin ? (
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button
                  variant={activeTab === 'admin-org' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('admin-org')}
                  className="w-full sm:w-auto min-w-0 sm:min-w-[140px] gap-2"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span className="sm:inline">Панель организации</span>
                </Button>
                <Button
                  variant={activeTab === 'admin-dev' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('admin-dev')}
                  className="w-full sm:w-auto min-w-0 sm:min-w-[140px] gap-2"
                >
                  <Settings className="h-4 w-4" />
                  <span className="sm:inline">Разработка</span>
                </Button>
              </div>
            ) : isStaff ? (
              <Button
                variant={activeTab === 'staff' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('staff')}
                className="w-full sm:w-auto min-w-0 sm:min-w-[140px] gap-2"
              >
                <User className="h-4 w-4" />
                <span className="sm:inline">Панель сотрудника</span>
              </Button>
            ) : (
              <Button
                variant={activeTab === 'user' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('user')}
                className="w-full sm:w-auto min-w-0 sm:min-w-[140px] gap-2"
              >
                <User className="h-4 w-4" />
                <span className="sm:inline">Личный кабинет</span>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </motion.header>
  )
}

export default Header
