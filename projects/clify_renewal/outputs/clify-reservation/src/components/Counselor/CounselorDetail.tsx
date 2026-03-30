import React from 'react';
import { Counselor } from '../../types';
import { Card, Badge } from '../Common';
import { Star, MapPin, Video, Phone, Home } from 'lucide-react';

interface CounselorDetailProps {
  counselor: Counselor;
}

export const CounselorDetail: React.FC<CounselorDetailProps> = ({ counselor }) => {
  return (
    <Card>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{counselor.name}</h2>
          <p className="text-gray-600 font-medium">{counselor.title}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 justify-end mb-2">
            <Star size={18} className="text-yellow-400 fill-current" />
            <span className="font-bold text-lg text-gray-900">{counselor.rating}</span>
            <span className="text-sm text-gray-500">({counselor.reviewCount} 리뷰)</span>
          </div>
          <p className="text-xl font-bold text-primary">
            {counselor.hourlyRate.toLocaleString()}원/50분
          </p>
        </div>
      </div>

      <p className="text-gray-700 mb-6 leading-relaxed">{counselor.bio}</p>

      <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-200">
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">전문 분야</h4>
          <div className="flex flex-wrap gap-2">
            {counselor.specialties.map((specialty) => (
              <Badge key={specialty} variant="primary" size="md">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3">상담 방식</h4>
          <div className="flex flex-wrap gap-2">
            {counselor.serviceType.includes('offline') && (
              <Badge variant="secondary" size="md">
                <Home size={14} className="inline mr-1" />
                대면 상담
              </Badge>
            )}
            {counselor.serviceType.includes('online-video') && (
              <Badge variant="secondary" size="md">
                <Video size={14} className="inline mr-1" />
                화상 상담
              </Badge>
            )}
            {counselor.serviceType.includes('online-phone') && (
              <Badge variant="secondary" size="md">
                <Phone size={14} className="inline mr-1" />
                전화 상담
              </Badge>
            )}
          </div>
        </div>
      </div>

      {counselor.availableRegions && counselor.availableRegions.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">가능 지역</h4>
          <div className="flex flex-wrap gap-2">
            {counselor.availableRegions.map((region) => (
              <div
                key={region}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-700"
              >
                <MapPin size={16} />
                {region}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
