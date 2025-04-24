
import React, { useState } from 'react';
import Header from '../components/Header';
import UserInterface from '../components/UserInterface';
import AdminInterface from '../components/AdminInterface';

const Index: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'user' | 'admin-org' | 'admin-dev'>('user');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="app-container py-6">
        {activeTab === 'user' && <UserInterface />}
        {activeTab === 'admin-org' && <AdminInterface type="organization" />}
        {activeTab === 'admin-dev' && <AdminInterface type="developer" />}
      </main>
      
      <footer className="bg-white border-t py-4">
        <div className="app-container text-center text-gray-600 text-sm">
          &copy; 2023 Городской тайм-банк. Все права защищены.
        </div>
      </footer>
    </div>
  );
};

export default Index;
