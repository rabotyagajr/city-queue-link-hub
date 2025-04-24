
import React from 'react';

interface HeaderProps {
  activeTab: 'user' | 'admin-org' | 'admin-dev';
  setActiveTab: (tab: 'user' | 'admin-org' | 'admin-dev') => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="app-container">
        <div className="flex flex-col md:flex-row md:justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-primary mb-4 md:mb-0">Городской тайм-банк</h1>
          
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('user')}
              className={`px-3 py-2 ${activeTab === 'user' ? 'tab-active' : 'tab-inactive'}`}
            >
              Личный кабинет
            </button>
            <button
              onClick={() => setActiveTab('admin-org')}
              className={`px-3 py-2 ${activeTab === 'admin-org' ? 'tab-active' : 'tab-inactive'}`}
            >
              Админ (Организация)
            </button>
            <button
              onClick={() => setActiveTab('admin-dev')}
              className={`px-3 py-2 ${activeTab === 'admin-dev' ? 'tab-active' : 'tab-inactive'}`}
            >
              Админ (Разработчик)
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
