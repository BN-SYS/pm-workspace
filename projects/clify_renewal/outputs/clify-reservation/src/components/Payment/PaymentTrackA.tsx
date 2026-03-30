import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useReservationStore } from '../../store/reservationStore';
import { Button, Card } from '../Common';
import { StepIndicator } from '../Layout';
import { AlertCircle, CheckCircle, Zap } from 'lucide-react';

export const PaymentTrackA: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { reservationData, completeReservation, setCurrentStep } = useReservationStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'points' | 'card'>('points');
  const [agreed, setAgreed] = useState(false);

  if (!user || !reservationData.totalPrice) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">결제 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  // 포인트 계산
  const pointsToUse = Math.min(user.points || 0, reservationData.totalPrice);
  const personalPayment = reservationData.totalPrice - pointsToUse;

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
        corporateSupport: pointsToUse,
        userPayment: personalPayment,
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">결제 방식 선택</h1>
          <p className="text-gray-600">기업 포인트를 우선으로 차감하고, 부족분은 개인 결제합니다.</p>
        </div>

        <div className="space-y-6">
          {/* 보유 포인트 정보 */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-900 mb-1">보유 포인트</p>
                <p className="text-3xl font-bold text-blue-900">
                  {(user.points || 0).toLocaleString()}P
                </p>
              </div>
              <Zap className="text-blue-500" size={48} />
            </div>
          </Card>

          {/* 결제 내역 */}
          <Card>
            <h3 className="text-lg font-bold text-gray-900 mb-4">결제 내역</h3>
            <div className="space-y-3 pb-4 border-b border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-600">상담료</span>
                <span className="font-semibold text-gray-900">
                  {reservationData.totalPrice?.toLocaleString()}원
                </span>
              </div>
            </div>
            <div className="pt-4 space-y-3">
              <div className="flex justify-between text-lg">
                <span className="font-semibold text-gray-900">기업 포인트 차감</span>
                <span className="font-bold text-green-600">-{pointsToUse.toLocaleString()}P</span>
              </div>
              {personalPayment > 0 && (
                <div className="flex justify-between text-lg">
                  <span className="font-semibold text-gray-900">개인 결제액</span>
                  <span className="font-bold text-primary">
                    {personalPayment.toLocaleString()}원
                  </span>
                </div>
              )}
            </div>
          </Card>

          {/* 결제 방식 선택 */}
          <Card>
            <h3 className="text-lg font-bold text-gray-900 mb-4">결제 방식</h3>

            {pointsToUse > 0 && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="font-semibold text-green-900">기업 포인트 우선 차감</p>
                    <p className="text-sm text-green-800 mt-1">
                      보유 포인트 {pointsToUse.toLocaleString()}P가 자동으로 차감됩니다.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {personalPayment > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">개인 결제 수단 선택</h4>
                <div className="space-y-3">
                  {[
                    { id: 'card', label: '신용/체크카드' },
                    { id: 'kakao', label: '카카오페이' },
                    { id: 'naver', label: '네이버페이' },
                    { id: 'toss', label: '토스' },
                  ].map(({ id, label }) => (
                    <label key={id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                      <input
                        type="radio"
                        name="personal-payment"
                        value={id}
                        defaultChecked={id === 'card'}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-700 font-medium">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {personalPayment === 0 && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="font-semibold text-blue-900">기업 포인트로 전액 결제</p>
                    <p className="text-sm text-blue-800 mt-1">
                      보유 포인트로 모든 비용이 충당되어 추가 결제가 필요하지 않습니다.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>

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
              variant="primary"
              fullWidth
              size="lg"
              onClick={handlePayment}
              isLoading={isProcessing}
              disabled={!agreed}
            >
              {personalPayment > 0
                ? `${personalPayment.toLocaleString()}원 결제하기`
                : '포인트로 예약하기'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
