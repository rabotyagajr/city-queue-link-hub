
import React, { useState } from 'react';
import Header from '../components/Header';
import UserInterface from '../components/UserInterface';
import AdminInterface from '../components/AdminInterface';
import { Button } from '@/components/ui/button';
import { Clock, Users, CalendarIcon, ArrowRight } from 'lucide-react';

const Index: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'user' | 'admin-org' | 'admin-dev'>('user');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {activeTab === 'user' && (
        <div className="bg-gradient-to-b from-white to-gray-50">
          {/* Hero Section */}
          <section className="app-container py-16 md:py-24">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Городской тайм-банк
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8">
                Современное решение для управления очередями в государственных учреждениях
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                >
                  Начать пользоваться
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                >
                  Узнать больше
                </Button>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 bg-white">
            <div className="app-container">
              <h2 className="text-3xl font-bold text-center mb-12">
                Преимущества сервиса
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="card p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Экономия времени</h3>
                  <p className="text-gray-600">
                    Записывайтесь онлайн и приходите точно к назначенному времени
                  </p>
                </div>
                <div className="card p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CalendarIcon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Удобное планирование</h3>
                  <p className="text-gray-600">
                    Выбирайте удобное время посещения из доступных слотов
                  </p>
                </div>
                <div className="card p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Обмен временем</h3>
                  <p className="text-gray-600">
                    Передавайте свою запись другим, если не можете прийти
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="py-16 bg-gray-50">
            <div className="app-container">
              <h2 className="text-3xl font-bold text-center mb-12">
                Как это работает
              </h2>
              <div className="max-w-3xl mx-auto">
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Выберите услугу</h3>
                      <p className="text-gray-600">
                        Укажите тип услуги и удобное для вас отделение
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Получите QR-код</h3>
                      <p className="text-gray-600">
                        После выбора времени вы получите персональный QR-код
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Приходите вовремя</h3>
                      <p className="text-gray-600">
                        Отсканируйте QR-код в отделении и получите услугу без очереди
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {activeTab === 'admin-org' && <AdminInterface type="organization" />}
      {activeTab === 'admin-dev' && <AdminInterface type="developer" />}
      
      <footer className="bg-white border-t py-8">
        <div className="app-container text-center">
          <p className="text-gray-600 text-sm">
            &copy; 2024 Городской тайм-банк. Все права защищены.
          </p>
          <div className="mt-4 space-x-4">
            <a href="#" className="text-gray-600 hover:text-primary text-sm">
              Помощь
            </a>
            <a href="#" className="text-gray-600 hover:text-primary text-sm">
              Правила использования
            </a>
            <a href="#" className="text-gray-600 hover:text-primary text-sm">
              Конфиденциальность
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
