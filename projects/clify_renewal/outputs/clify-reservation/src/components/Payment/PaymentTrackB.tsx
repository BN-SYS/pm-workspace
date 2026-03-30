import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useReservationStore } from '../../store/reservationStore';
import { Button, Card } from '../Common';
import { StepIndicator } from '../Layout';
import { CreditCard, AlertCircle } from 'lucide-react';

export const PaymentTrackB: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { reservationData, completeReservation, setCurrentStep } = useReservationStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'kakao' | 'naver' | 'toss'>('card');
  const [agreed, setAgreed] = useState(false);

  if (!user || !reservationData.totalPrice) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">결제 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  const handlePayment = async () => {
    if (!agreed) {
      alert('약관에 동의해주세요.');
      return;
    }

    setIsProcessing(true);

    // Mock 결제 처리 (실제로는 PG 연동)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const reservation = {
      id: `res-${Date.now()}`,
      reservationNumber: `RES-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      userId: user.id,
      data: {
        ...reservationData,
        userPayment: reservationData.totalPrice,
      } as any,
      status: 'confirmed' as const,
      createdAt: new Date().toISOString(),
    };

    completeReservation(reservation);
    setCurrentStep(7);
    navigate('/reservation/complete', { state: { reservation } });
    setIsProcessing(false);
  };

  const stepLabels = ['로그인', '상품선택', '상담사탐색', '일정선택', '예약확인', '결제', '완료'];

  return (
    <div className="min-h-screen bg-gray-50">
      <StepIndicator currentStep={6} totalSteps={7} stepLabels={stepLabels} />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">결제하기</h1>
          <p className="text-gray-600">신용카드 또는 간편결제로 안전하게 결제하세요.</p>
        </div>

        <div className="space-y-6">
          {/* 결제 금액 */}
          <Card className="bg-gradient-to-br from-secondary/5 to-primary/5 border-secondary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">결제 금액</p>
                <p className="text-3xl font-bold text-primary">
                  {reservationData.totalPrice?.toLocaleString()}원
                </p>
              </div>
              <CreditCard className="text-secondary" size={48} />
            </div>
          </Card>

          {/* 결제 방식 선택 */}
          <Card>
            <h3 className="text-lg font-bold text-gray-900 mb-4">결제 방식 선택</h3>
            <div className="space-y-3">
              {[
                { id: 'card', label: '신용/체크카드', icon: '💳' },
                { id: 'kakao', label: '카카오페이', icon: '🟨' },
                { id: 'naver', label: '네이버페이', icon: '🟢' },
                { id: 'toss', label: '토스', icon: '🔵' },
              ].map(({ id, label, icon }) => (
                <label
                  key={id}
                  className={`
                    flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition
                    ${
                      paymentMethod === id
                        ? 'border-secondary bg-secondary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="payment-method"
                    value={id}
                    checked={paymentMethod === id}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-4 h-4"
                  />
                  <span className="text-2xl">{icon}</span>
                  <span className="text-gray-900 font-medium">{label}</span>
                </label>
              ))}
            </div>
          </Card>

          {/* 카드 입력 (선택 시 표시) */}
          {paymentMethod === 'card' && (
            <Card>
              <h4 className="font-semibold text-gray-900 mb-4">카드 정보 입력</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    카드번호
                  </label>
                  <input
                    type="text"
                    placeholder="0000-0000-0000-0000"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      유효기간
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVC
                    </label>
                    <input
                      type="text"
                      placeholder="000"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50"
                    />
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* 보안 안내 */}
          <div className="flex gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <AlertCircle className="text-blue-600 flex-shrink-0" size={20} />
            <p className="text-sm text-blue-900">
              모든 결제 정보는 암호화되어 안전하게 처리됩니다. PG사를 통해 안전한 결제 서비스를 제공합니다.
            </p>
          </div>

          {/* 약관 동의 */}
          <Card>
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-4 h-4 mt-1"
                />
                <div>
                  <p className="font-medium text-gray-900">
                    주문 내용을 확인하였으며, 정보 제공에 동의합니다.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    취소 정책 및 개인정보 처리방침에 동의합니다.
                  </p>
                </div>
              </label>
            </div>
          </Card>

          {/* 버튼 */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              이전
            </button>
            <Button
              variant="secondary"
              fullWidth
              size="lg"
              onClick={handlePayment}
              isLoading={isProcessing}
              disabled={!agreed}
            >
              {reservationData.totalPrice?.toLocaleString()}원 결제하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
