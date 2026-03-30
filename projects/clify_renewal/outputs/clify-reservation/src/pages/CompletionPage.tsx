import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card } from '../components/Common';
import { CheckCircle, Download, Share2, Home } from 'lucide-react';
import { Reservation } from '../types';

export const CompletionPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const reservation = (location.state as { reservation: Reservation })?.reservation;

  if (!reservation) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-success/5 to-primary/5">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* 성공 메시지 */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-success/20 rounded-full animate-pulse"></div>
              <CheckCircle className="text-success" size={80} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            예약이 완료되었습니다!
          </h1>
          <p className="text-lg text-gray-600">
            예약번호: <span className="font-bold text-primary">{reservation.reservationNumber}</span>
          </p>
        </div>

        {/* 예약 정보 카드 */}
        <Card className="mb-6">
          <div className="space-y-6">
            {/* 상품명 */}
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">상품명</p>
              <p className="text-lg font-bold text-gray-900">
                [심리상담] {reservation.data.consultationTopic || '1회권 (50분)'}
              </p>
            </div>

            {/* 상담사 */}
            <div className="pb-6 border-b border-gray-200">
              <p className="text-sm font-medium text-gray-600 mb-1">심리상담사</p>
              <p className="text-lg font-bold text-gray-900">
                {reservation.data.counselorName} 전문가
              </p>
            </div>

            {/* 예약 일정 */}
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">예약 일정</p>
              <p className="text-lg font-bold text-gray-900">
                {formatDate(reservation.data.reservationDate)}{' '}
                {formatTime(reservation.data.reservationTime)}
              </p>
            </div>

            {/* 상담 방식 */}
            <div className="pb-6 border-b border-gray-200">
              <p className="text-sm font-medium text-gray-600 mb-1">상담 방식</p>
              <p className="text-lg font-bold text-gray-900">
                {reservation.data.serviceType === 'offline' && '대면 상담'}
                {reservation.data.serviceType === 'online-video' && '비대면 (화상상담)'}
                {reservation.data.serviceType === 'online-phone' && '비대면 (전화상담)'}
              </p>
            </div>
          </div>
        </Card>

        {/* 알림 안내 */}
        <Card className="bg-blue-50 border-blue-200 mb-6">
          <div className="space-y-3">
            <h3 className="font-bold text-blue-900">📌 카카오톡 알림 발송</h3>
            <p className="text-sm text-blue-800">
              예약 확정 알림이 카카오톡으로 발송되었습니다.
            </p>
            <p className="text-sm text-blue-800">
              상담 24시간 전에 리마인더 메시지를 받게 됩니다.
            </p>
          </div>
        </Card>

        {/* 다음 단계 안내 */}
        <Card className="bg-yellow-50 border-yellow-200 mb-6">
          <div className="space-y-3">
            <h3 className="font-bold text-yellow-900">⏰ 다음 단계</h3>
            <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
              <li>상담 시작 24시간 전까지 일정 변경/취소 가능</li>
              <li>마이페이지에서 예약 상태를 확인할 수 있습니다</li>
              <li>상담 완료 후 결과 리포트를 받게 됩니다</li>
            </ul>
          </div>
        </Card>

        {/* 버튼 그룹 */}
        <div className="space-y-3">
          <Button
            variant="primary"
            fullWidth
            size="lg"
            onClick={() => navigate('/mypage')}
          >
            마이페이지로 이동
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              fullWidth
              size="lg"
              className="gap-2"
            >
              <Download size={20} />
              영수증 다운로드
            </Button>
            <Button
              variant="outline"
              fullWidth
              size="lg"
              className="gap-2"
            >
              <Share2 size={20} />
              공유하기
            </Button>
          </div>
          <Button
            variant="outline"
            fullWidth
            size="lg"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <Home size={20} />
            홈으로
          </Button>
        </div>
      </div>
    </div>
  );
};
