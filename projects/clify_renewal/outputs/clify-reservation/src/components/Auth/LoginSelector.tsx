
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../Common';
import { Building2, User } from 'lucide-react';

export const LoginSelector: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-3">CLIFY</h1>
          <p className="text-lg text-gray-600">전문가와 함께하는 심리상담 서비스</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Track A: 기업 고객 */}
          <Card
            onClick={() => navigate('/login/corporate')}
            isClickable
            className="text-center hover:shadow-xl"
          >
            <div className="mb-6">
              <Building2 className="mx-auto text-primary mb-3" size={48} />
              <h2 className="text-2xl font-bold text-primary">기업 고객</h2>
            </div>
            <p className="text-gray-600 mb-6">
              회사 이메일로 로그인하고 기업 포인트로 결제하세요.
            </p>
            <Button variant="primary" fullWidth>
              기업 로그인
            </Button>
          </Card>

          {/* Track B: 일반 고객 */}
          <Card
            onClick={() => navigate('/login/individual')}
            isClickable
            className="text-center hover:shadow-xl"
          >
            <div className="mb-6">
              <User className="mx-auto text-secondary mb-3" size={48} />
              <h2 className="text-2xl font-bold text-secondary">일반 고객</h2>
            </div>
            <p className="text-gray-600 mb-6">
              카카오, Google 또는 이메일로 간편하게 시작하세요.
            </p>
            <Button variant="secondary" fullWidth>
              일반 로그인
            </Button>
          </Card>
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>로그인에 문제가 있으신가요?</p>
          <a href="tel:1588-0000" className="text-primary hover:underline font-medium">
            고객센터 1588-XXXX로 문의해주세요.
          </a>
        </div>
      </div>
    </div>
  );
};
