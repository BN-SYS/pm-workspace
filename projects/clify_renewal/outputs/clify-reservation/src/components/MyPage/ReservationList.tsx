import React, { useMemo } from 'react';
import { useReservationStore } from '../../store/reservationStore';
import { Card, Badge, Button } from '../Common';
import { Calendar, User, Clock, MapPin, Trash2, RefreshCw } from 'lucide-react';

type FilterTab = 'all' | 'upcoming' | 'completed' | 'cancelled';

export const ReservationList: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<FilterTab>('all');
  const { getReservationHistory } = useReservationStore();
  const reservations = getReservationHistory();

  const filteredReservations = useMemo(() => {
    const now = new Date();
    return reservations.filter((res) => {
      if (activeTab === 'all') return true;
      if (activeTab === 'upcoming') {
        const reservationDate = new Date(res.data.reservationDate);
        return reservationDate > now && res.status === 'confirmed';
      }
      if (activeTab === 'completed') return res.status === 'completed';
      if (activeTab === 'cancelled') return res.status === 'cancelled';
      return true;
    });
  }, [reservations, activeTab]);

  const calculateDaysUntil = (dateString: string): number => {
    const reservationDate = new Date(dateString);
    const today = new Date();
    const diffTime = reservationDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} (${days[date.getDay()]})`;
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  const tabs: { id: FilterTab; label: string }[] = [
    { id: 'all', label: '전체' },
    { id: 'upcoming', label: '예약예정' },
    { id: 'completed', label: '상담완료' },
    { id: 'cancelled', label: '취소됨' },
  ];

  return (
    <div>
      {/* 탭 */}
      <div className="flex gap-2 border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-4 py-3 font-medium text-sm border-b-2 transition
              ${
                activeTab === tab.id
                  ? 'text-primary border-primary'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 예약 목록 */}
      {filteredReservations.length > 0 ? (
        <div className="space-y-4">
          {filteredReservations.map((reservation) => {
            const daysUntil = calculateDaysUntil(reservation.data.reservationDate);
            const isUpcoming =
              daysUntil > 0 && reservation.status === 'confirmed';

            return (
              <Card key={reservation.id}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {reservation.data.counselorName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {reservation.data.serviceType === 'offline' && '대면 상담'}
                      {reservation.data.serviceType === 'online-video' && '화상 상담'}
                      {reservation.data.serviceType === 'online-phone' && '전화 상담'}
                    </p>
                  </div>
                  <div className="text-right">
                    {isUpcoming && (
                      <Badge variant="success" size="md">
                        D-{daysUntil}
                      </Badge>
                    )}
                    {reservation.status === 'completed' && (
                      <Badge variant="success" size="md">
                        완료
                      </Badge>
                    )}
                    {reservation.status === 'cancelled' && (
                      <Badge variant="warning" size="md">
                        취소됨
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-700 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    <span>
                      {formatDate(reservation.data.reservationDate)}{' '}
                      {formatTime(reservation.data.reservationTime)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-gray-400" />
                    <span>{reservation.data.counselorName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    <span>50분</span>
                  </div>
                  {reservation.data.serviceType === 'offline' && (
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gray-400" />
                      <span>강남센터</span>
                    </div>
                  )}
                </div>

                {reservation.status === 'cancelled' && reservation.cancelReason && (
                  <div className="mb-4 p-3 bg-gray-100 rounded text-sm text-gray-700">
                    <p className="font-medium mb-1">취소 사유:</p>
                    <p>{reservation.cancelReason}</p>
                  </div>
                )}

                {/* 버튼 그룹 */}
                <div className="flex gap-2">
                  {isUpcoming && (
                    <>
                      <Button variant="outline" size="sm" fullWidth>
                        일정 변경
                      </Button>
                      <Button variant="danger" size="sm" fullWidth>
                        <Trash2 size={16} />
                        예약 취소
                      </Button>
                    </>
                  )}
                  {reservation.status === 'completed' && (
                    <>
                      <Button variant="outline" size="sm" fullWidth>
                        리포트 보기
                      </Button>
                      <Button variant="primary" size="sm" fullWidth>
                        <RefreshCw size={16} />
                        재예약
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Calendar className="mx-auto text-gray-400 mb-3" size={48} />
          <p className="text-gray-600 font-medium">예약 내역이 없습니다.</p>
          <p className="text-sm text-gray-500 mt-1">
            새로운 상담을 예약해보세요.
          </p>
        </div>
      )}
    </div>
  );
};
