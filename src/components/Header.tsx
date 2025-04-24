
import React from 'react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  activeTab: 'user' | 'admin-org' | 'admin-dev';
  setActiveTab: (tab: 'user' | 'admin-org' | 'admin-dev') => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="app-container">
        <div className="flex flex-col md:flex-row md:justify-between items-center py-4">
          <h1 
            className="text-2xl font-bold text-primary mb-4 md:mb-0 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setActiveTab('user')}
          >
            Городской тайм-банк
          </h1>
          
          <nav className="flex flex-wrap justify-center gap-2">
            <Button
              variant={activeTab === 'user' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('user')}
              className="min-w-[140px]"
            >
              Личный кабинет
            </Button>
            <Button
              variant={activeTab === 'admin-org' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('admin-org')}
              className="min-w-[140px]"
            >
              Админ (Организация)
            </Button>
            <Button
              variant={activeTab === 'admin-dev' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('admin-dev')}
              className="min-w-[140px]"
            >
              Админ (Разработчик)
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
