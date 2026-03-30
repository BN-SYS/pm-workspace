import React from 'react';
import { Counselor } from '../../types';
import { Card, Badge } from '../Common';
import { Star, MapPin, Video, Phone } from 'lucide-react';

interface CounselorCardProps {
  counselor: Counselor;
  onSelect: (counselor: Counselor) => void;
  onTimeSelect?: (time: string) => void;
}

export const CounselorCard: React.FC<CounselorCardProps> = ({
  counselor,
  onSelect,
  onTimeSelect,
}) => {
  const availableTimes = counselor.availability
    .filter((slot) => slot.isAvailable)
    .map((slot) => slot.startTime);

  return (
    <Card
      onClick={() => onSelect(counselor)}
      isClickable
      className="hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">{counselor.name}</h3>
          <p className="text-sm text-gray-600">{counselor.title}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 justify-end">
            <Star size={16} className="text-yellow-400 fill-current" />
            <span className="font-semibold text-gray-900">{counselor.rating}</span>
            <span className="text-sm text-gray-500">({counselor.reviewCount})</span>
          </div>
          <p className="text-lg font-bold text-primary mt-1">
            {counselor.hourlyRate.toLocaleString()}원/50분
          </p>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{counselor.bio}</p>

      <div className="mb-4">
        <p className="text-xs font-medium text-gray-700 mb-2">전문 분야</p>
        <div className="flex flex-wrap gap-2">
          {counselor.specialties.map((specialty) => (
            <Badge key={specialty} variant="primary" size="sm">
              {specialty}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs font-medium text-gray-700 mb-2">상담 방식</p>
        <div className="flex flex-wrap gap-2">
          {counselor.serviceType.includes('offline') && (
            <Badge variant="secondary" size="sm">
              대면
            </Badge>
          )}
          {counselor.serviceType.includes('online-video') && (
            <Badge variant="secondary" size="sm">
              <Video size={12} className="inline mr-1" />
              화상
            </Badge>
          )}
          {counselor.serviceType.includes('online-phone') && (
            <Badge variant="secondary" size="sm">
              <Phone size={12} className="inline mr-1" />
              전화
            </Badge>
          )}
        </div>
      </div>

      {counselor.availableRegions && counselor.availableRegions.length > 0 && (
        <div className="mb-4 pb-4 border-b border-gray-200">
          <p className="text-xs font-medium text-gray-700 mb-2">가능 지역</p>
          <div className="flex flex-wrap gap-2">
            {counselor.availableRegions.map((region) => (
              <div key={region} className="flex items-center gap-1 text-sm text-gray-600">
                <MapPin size={14} />
                {region}
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-xs font-medium text-gray-700 mb-2">가능한 시간</p>
        <div className="grid grid-cols-4 gap-2">
          {availableTimes.slice(0, 8).map((time) => (
            <button
              key={time}
              onClick={(e) => {
                e.stopPropagation();
                onTimeSelect?.(time);
              }}
              className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium hover:bg-primary/20 transition"
            >
              {time}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
};
