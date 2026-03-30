import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useReservationStore } from '../../store/reservationStore';
import { mockCounselors, mockProductsIndividual, mockProductsCorporate } from '../../data';
import { Button, Card } from '../Common';
import { StepIndicator } from '../Layout';
import { ChevronLeft, AlertCircle, CheckCircle } from 'lucide-react';

export const ReservationReview: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { reservationData, setCurrentStep } = useReservationStore();

  const counselor = mockCounselors.find((c) => c.id === reservationData.counselorId);
  const allProducts = user?.userType === 'corporate' ? mockProductsCorporate : mockProductsIndividual;
  const product = allProducts.find((p) => p.id === reservationData.productId);

  if (!counselor || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">예약 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${days[date.getDay()]})`;
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  // 기업 고객의 경우 포인트 계산
  let corporateSupport = 0;
  let userPayment = reservationData.totalPrice || 0;

  if (user?.userType === 'corporate' && user.points) {
    corporateSupport = Math.min(user.points, reservationData.totalPrice || 0);
    userPayment = (reservationData.totalPrice || 0) - corporateSupport;
  }

  const handleProceedToPayment = () => {
    setCurrentStep(6);
    navigate('/reservation/payment');
  };

  const handleModify = (step: number) => {
    setCurrentStep(step);
    if (step === 2) navigate('/reservation/product');
    else if (step === 3) navigate('/reservation/counselor');
    else if (step === 4) navigate('/reservation/schedule');
  };

  const stepLabels = ['로그인', '상품선택', '상담사탐색', '일정선택', '예약확인', '결제', '완료'];

  return (
    <div className="min-h-screen bg-gray-50">
      <StepIndicator currentStep={5} totalSteps={7} stepLabels={stepLabels} />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">예약 내용을 확인해주세요</h1>
          <p className="text-gray-600">모든 정보가 올바른지 다시 한 번 확인한 후 결제를 진행해주세요.</p>
        </div>

        <div className="space-y-6">
          {/* 상담 상품 */}
          <Card>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">상담 상품</p>
                <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                <p className="text-gray-600 text-sm mt-2">{product.description}</p>
              </div>
              <button
                onClick={() => handleModify(2)}
                className="text-primary hover:underline font-medium text-sm"
              >
                수정
              </button>
            </div>
          </Card>

          {/* 심리상담사 */}
          <Card>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">심리상담사</p>
                <h3 className="text-xl font-bold text-gray-900">{counselor.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{counselor.title}</p>
              </div>
              <button
                onClick={() => handleModify(3)}
                className="text-primary hover:underline font-medium text-sm"
              >
                수정
              </button>
            </div>
          </Card>

          {/* 예약 일정 */}
          <Card>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">예약 일정</p>
                <h3 className="text-xl font-bold text-gray-900">
                  {formatDate(reservationData.reservationDate!)} {formatTime(reservationData.reservationTime!)}
                </h3>
              </div>
              <button
                onClick={() => handleModify(4)}
                className="text-primary hover:underline font-medium text-sm"
              >
                수정
              </button>
            </div>
          </Card>

          {/* 상담 방식 */}
          <Card>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">상담 방식</p>
                <h3 className="text-xl font-bold text-gray-900">
                  {reservationData.serviceType === 'offline' && '대면 상담'}
                  {reservationData.serviceType === 'online-video' && '비대면 (화상상담 - Zoom)'}
                  {reservationData.serviceType === 'online-phone' && '비대면 (전화상담)'}
                </h3>
              </div>
              <button
                onClick={() => handleModify(4)}
                className="text-primary hover:underline font-medium text-sm"
              >
                수정
              </button>
            </div>
          </Card>

          {/* 결제 금액 */}
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-lg">
                <span className="font-medium text-gray-900">최종 결제 금액</span>
                <span className="font-bold text-primary text-2xl">
                  {reservationData.totalPrice?.toLocaleString()}원
                </span>
              </div>

              {user?.userType === 'corporate' && (
                <>
                  <div className="pt-3 border-t border-primary/20 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">기업 포인트 지원</span>
                      <span className="font-semibold text-gray-900">-{corporateSupport.toLocaleString()}P</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">본인 부담금</span>
                      <span className="font-semibold text-gray-900">
                        {userPayment === 0 ? '0원' : userPayment.toLocaleString() + '원'}
                      </span>
                    </div>
                    {userPayment === 0 && (
                      <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-2 rounded mt-2">
                        <CheckCircle size={16} />
                        기업 지원 100% 적용, 본인 부담금 0원
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* 취소 정책 안내 */}
          <div className="flex gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
            <div className="text-sm text-yellow-800">
              <p className="font-semibold mb-1">취소 정책 안내</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>상담 시작 24시간 전까지 변경/취소 가능</li>
                <li>당일 취소 시 환불이 어려운 점 참고 부탁드립니다</li>
                <li>노쇼(No-Show) 시 전액 차감됩니다</li>
              </ul>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-4 pt-6">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              <ChevronLeft className="inline mr-2" size={20} />
              이전 단계
            </button>
            <Button
              variant="primary"
              fullWidth
              size="lg"
              onClick={handleProceedToPayment}
            >
              결제하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
