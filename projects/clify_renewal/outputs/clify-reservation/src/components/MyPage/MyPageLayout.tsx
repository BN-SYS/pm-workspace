import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Card, Button } from '../Common';
import { ReservationList } from './ReservationList';
import { UserInfo } from './UserInfo';
import { Bell, LogOut } from 'lucide-react';

type Tab = 'reservations' | 'info';

export const MyPageLayout: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>('reservations');

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">로그인이 필요합니다.</p>
          <Button
            variant="primary"
            onClick={() => navigate('/login')}
          >
            로그인하기
          </Button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">마이페이지</h1>
              <p className="text-gray-600">
                {user.name}님 환영합니다!
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Bell size={18} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                로그아웃
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 사이드바 */}
          <div className="lg:col-span-1">
            <Card>
              <div className="space-y-2">
                {[
                  { id: 'reservations', label: '예약 관리' },
                  { id: 'info', label: '내 정보' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as Tab)}
                    className={`
                      w-full text-left px-4 py-3 rounded font-medium transition
                      ${
                        activeTab === item.id
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-3">
            {activeTab === 'reservations' && <ReservationList />}
            {activeTab === 'info' && <UserInfo />}
          </div>
        </div>
      </div>
    </div>
  );
};
