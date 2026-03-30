import React, { useState } from 'react';
import { CounselorFilters } from '../../types';
import { Button, Badge } from '../Common';
import { X, Filter } from 'lucide-react';

interface FilterBarProps {
  onFiltersChange: (filters: CounselorFilters) => void;
  selectedFilters: CounselorFilters;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  onFiltersChange,
  selectedFilters,
}) => {
  const [showMore, setShowMore] = useState(false);

  const specialtyOptions = [
    '#우울',
    '#불안',
    '#직무스트레스',
    '#번아웃',
    '#대인관계',
    '#자존감',
  ];

  const regions = ['전체', '서울', '경기', '부산', '대구'];

  const handleDateChange = (date: string) => {
    onFiltersChange({ ...selectedFilters, date });
  };

  const handleServiceTypeChange = (type: 'offline' | 'online-video' | 'online-phone') => {
    onFiltersChange({
      ...selectedFilters,
      serviceType: selectedFilters.serviceType === type ? undefined : type,
    });
  };

  const handleRegionChange = (region: string) => {
    onFiltersChange({
      ...selectedFilters,
      region: selectedFilters.region === region ? undefined : region,
    });
  };

  const handleSpecialtyToggle = (specialty: string) => {
    const specialties = selectedFilters.specialties || [];
    const updated = specialties.includes(specialty)
      ? specialties.filter((s) => s !== specialty)
      : [...specialties, specialty];
    onFiltersChange({
      ...selectedFilters,
      specialties: updated.length > 0 ? updated : undefined,
    });
  };

  const hasActiveFilters = Object.values(selectedFilters).some((v) => v);

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-primary" />
          <h3 className="font-semibold text-gray-900">필터</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={() => onFiltersChange({})}
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            <X size={16} />
            초기화
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* 날짜 필터 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">날짜</label>
          <input
            type="date"
            value={selectedFilters.date || ''}
            onChange={(e) => handleDateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* 상담 방식 필터 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">상담 방식</label>
          <div className="flex gap-2">
            <button
              onClick={() => handleServiceTypeChange('offline')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                selectedFilters.serviceType === 'offline'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              대면
            </button>
            <button
              onClick={() => handleServiceTypeChange('online-video')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                selectedFilters.serviceType === 'online-video'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              비대면(화상)
            </button>
            <button
              onClick={() => handleServiceTypeChange('online-phone')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                selectedFilters.serviceType === 'online-phone'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              비대면(전화)
            </button>
          </div>
        </div>

        {/* 지역 필터 (대면 선택 시에만) */}
        {selectedFilters.serviceType === 'offline' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">지역</label>
            <div className="flex flex-wrap gap-2">
              {regions.map((region) => (
                <button
                  key={region}
                  onClick={() => handleRegionChange(region)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    selectedFilters.region === region
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 전문 분야 필터 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            상담 주제
          </label>
          <div className="flex flex-wrap gap-2">
            {specialtyOptions.map((specialty) => (
              <button
                key={specialty}
                onClick={() => handleSpecialtyToggle(specialty)}
                className={`transition ${
                  selectedFilters.specialties?.includes(specialty)
                    ? 'opacity-100'
                    : 'opacity-50 hover:opacity-75'
                }`}
              >
                <Badge
                  variant={
                    selectedFilters.specialties?.includes(specialty)
                      ? 'primary'
                      : 'secondary'
                  }
                  size="md"
                >
                  {specialty}
                </Badge>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
