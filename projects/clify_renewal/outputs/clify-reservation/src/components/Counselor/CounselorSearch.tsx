import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockCounselors } from '../../data';
import { useReservationStore } from '../../store/reservationStore';
import { CounselorCard } from './CounselorCard';
import { FilterBar } from './FilterBar';
import { StepIndicator } from '../Layout';
import { CounselorFilters, Counselor } from '../../types';
import { Search } from 'lucide-react';

type SortOption = 'rating' | 'review' | 'price';

export const CounselorSearch: React.FC = () => {
  const navigate = useNavigate();
  const { updateReservationData, setCurrentStep } = useReservationStore();
  const [filters, setFilters] = useState<CounselorFilters>({});
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAndSortedCounselors = useMemo(() => {
    let result = [...mockCounselors];

    // 검색 필터
    if (searchTerm) {
      result = result.filter(
        (c) =>
          c.name.includes(searchTerm) ||
          c.title.includes(searchTerm) ||
          c.specialties.some((s) => s.includes(searchTerm))
      );
    }

    // 날짜 필터
    if (filters.date) {
      result = result.filter((c) =>
        c.availability.some((slot) => slot.date === filters.date && slot.isAvailable)
      );
    }

    // 상담 방식 필터
    if (filters.serviceType) {
      result = result.filter((c) => c.serviceType.includes(filters.serviceType!));
    }

    // 지역 필터
    if (filters.region && filters.region !== '전체') {
      result = result.filter(
        (c) => c.availableRegions && c.availableRegions.includes(filters.region!)
      );
    }

    // 전문 분야 필터
    if (filters.specialties && filters.specialties.length > 0) {
      result = result.filter((c) =>
        filters.specialties!.some((s) => c.specialties.includes(s))
      );
    }

    // 정렬
    result.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'review') return b.reviewCount - a.reviewCount;
      if (sortBy === 'price') return a.hourlyRate - b.hourlyRate;
      return 0;
    });

    return result;
  }, [filters, sortBy, searchTerm]);

  const handleCounselorSelect = (counselor: Counselor) => {
    updateReservationData({
      counselorId: counselor.id,
      counselorName: counselor.name,
    });
    setCurrentStep(4);
    navigate('/reservation/schedule');
  };

  const stepLabels = ['로그인', '상품선택', '상담사탐색', '일정선택', '예약확인', '결제', '완료'];

  return (
    <div className="min-h-screen bg-gray-50">
      <StepIndicator currentStep={3} totalSteps={7} stepLabels={stepLabels} />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            나에게 맞는 상담사를 찾아보세요
          </h1>
          <p className="text-gray-600">
            필터를 사용하여 원하는 상담사를 찾을 수 있습니다.
          </p>
        </div>

        {/* 검색 바 */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="상담사 이름, 자격증, 전문분야로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 필터 사이드바 */}
          <div className="lg:col-span-1">
            <FilterBar selectedFilters={filters} onFiltersChange={setFilters} />
          </div>

          {/* 상담사 목록 */}
          <div className="lg:col-span-3">
            {/* 정렬 옵션 */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">
                {filteredAndSortedCounselors.length}명의 상담사
              </p>
              <div className="flex gap-2">
                {(['rating', 'review', 'price'] as SortOption[]).map((option) => (
                  <button
                    key={option}
                    onClick={() => setSortBy(option)}
                    className={`px-3 py-1.5 text-sm font-medium rounded transition ${
                      sortBy === option
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {option === 'rating' && '평점순'}
                    {option === 'review' && '리뷰순'}
                    {option === 'price' && '가격순'}
                  </button>
                ))}
              </div>
            </div>

            {filteredAndSortedCounselors.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {filteredAndSortedCounselors.map((counselor) => (
                  <CounselorCard
                    key={counselor.id}
                    counselor={counselor}
                    onSelect={handleCounselorSelect}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-3">조건에 맞는 상담사가 없습니다.</p>
                <button
                  onClick={() => setFilters({})}
                  className="text-primary hover:underline font-medium"
                >
                  필터 초기화
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
