
import React, { useState } from 'react';
import Header from '../components/Header';
import UserInterface from '../components/UserInterface';
import AdminInterface from '../components/AdminInterface';
import { Card } from '@/components/ui/card';
import { Calendar, Users, Clock } from 'lucide-react';

const Index: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'user' | 'admin-org' | 'admin-dev'>('user');
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="app-container py-8">
        {activeTab === 'user' ? (
          <div className="max-w-5xl mx-auto">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Текущие записи</p>
                    <h3 className="text-2xl font-semibold text-gray-900">2/2</h3>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Время ожидания</p>
                    <h3 className="text-2xl font-semibold text-gray-900">15 мин</h3>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">В тайм-банке</p>
                    <h3 className="text-2xl font-semibold text-gray-900">5</h3>
                  </div>
                </div>
              </Card>
            </div>
            
            <UserInterface />
          </div>
        ) : (
          <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <AdminInterface type={activeTab === 'admin-org' ? 'organization' : 'developer'} />
          </div>
        )}
      </div>
      
      {/* Footer */}
      <footer className="bg-white border-t mt-auto py-8">
        <div className="app-container text-center">
          <p className="text-gray-600 text-sm">
            &copy; 2024 Городской тайм-банк. Все права защищены.
          </p>
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
    </div>
  );
};

export default Index;
