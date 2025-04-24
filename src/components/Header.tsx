import React from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'
import { User, ShieldCheck, Settings, Clock } from 'lucide-react'

interface HeaderProps {
  activeTab: 'user' | 'admin-org' | 'admin-dev'
  setActiveTab: (tab: 'user' | 'admin-org' | 'admin-dev') => void
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  return (
    <motion.header
      className="bg-white border-b sticky top-0 z-50 shadow-sm"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="app-container">
        <div className="flex flex-col md:flex-row md:justify-between items-center py-4">
          <motion.h1
            className="text-2xl font-bold text-primary mb-4 md:mb-0 cursor-pointer hover:opacity-90 transition-opacity flex items-center gap-2"
            onClick={() => setActiveTab(isAdmin ? 'admin-org' : 'user')}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <Clock className="h-6 w-6" />
            Городской тайм-банк
          </motion.h1>

          <nav className="flex flex-wrap justify-center gap-2">
            {isAdmin ? (
              <>
                <Button
                  variant={activeTab === 'admin-org' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('admin-org')}
                  className="min-w-[140px] gap-2"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Панель организации
                </Button>
                <Button
                  variant={activeTab === 'admin-dev' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('admin-dev')}
                  className="min-w-[140px] gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Разработка
                </Button>
              </>
            ) : (
              <Button
                variant={activeTab === 'user' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('user')}
                className="min-w-[140px] gap-2"
              >
                <User className="h-4 w-4" />
                Личный кабинет
              </Button>
            )}
          </nav>
        </div>
      </div>
    </motion.header>
  )
}

export default Header
