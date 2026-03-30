import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../Common';
import { LogOut, User } from 'lucide-react';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleMyPage = () => {
    navigate('/mypage');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div
          onClick={() => navigate('/')}
          className="text-2xl font-bold text-primary cursor-pointer hover:opacity-80 transition"
        >
          CLIFY
        </div>

        <nav className="flex items-center gap-6">
          <button
            onClick={() => navigate('/')}
            className="text-gray-700 hover:text-primary transition font-medium"
          >
            예약
          </button>
          <button
            onClick={() => navigate('/')}
            className="text-gray-700 hover:text-primary transition font-medium"
          >
            소개
          </button>

          {isLoggedIn && user ? (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">{user.name}</p>
                {user.userType === 'corporate' && (
                  <p className="text-xs text-gray-500">기업회원</p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleMyPage}
                className="gap-2"
              >
                <User size={18} />
                마이페이지
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut size={18} />
                로그아웃
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/login')}
            >
              로그인
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};
