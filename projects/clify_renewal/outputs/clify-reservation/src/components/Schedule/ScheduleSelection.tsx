import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useReservationStore } from '../../store/reservationStore';
import { mockCounselors } from '../../data';
import { CounselorDetail } from '../Counselor/CounselorDetail';
import { CalendarPicker } from './CalendarPicker';
import { TimeSlotSelector } from './TimeSlotSelector';
import { InfoForm } from './InfoForm';
import { StepIndicator } from '../Layout';
import { Button } from '../Common';
import { ChevronLeft } from 'lucide-react';

export const ScheduleSelection: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { reservationData, updateReservationData, setCurrentStep } = useReservationStore();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const counselor = useMemo(() => {
    return mockCounselors.find((c) => c.id === reservationData.counselorId);
  }, [reservationData.counselorId]);

  const availableDates = useMemo(() => {
    if (!counselor) return [];
    const uniqueDates = new Set(
      counselor.availability
        .filter((slot) => slot.isAvailable)
        .map((slot) => slot.date)
    );
    return Array.from(uniqueDates);
  }, [counselor]);



  const availableTimes = useMemo(() => {
    if (!counselor || !selectedDate) return [];
    return counselor.availability
      .filter((slot) => slot.date === selectedDate && slot.isAvailable)
      .map((slot) => slot.startTime);
  }, [counselor, selectedDate]);

  const handleInfoFormSubmit = (data: {
    birthDate: string;
    topic: string;
    specialties: string[];
    serviceType: 'offline' | 'online-video' | 'online-phone';
  }) => {
    updateReservationData({
      userBirthDate: data.birthDate,
      consultationTopic: data.topic,
      specialties: data.specialties,
      serviceType: data.serviceType,
      reservationDate: selectedDate,
      reservationTime: selectedTime,
    });
    setCurrentStep(5);
    navigate('/reservation/confirmation');
  };

  const isFormValid = selectedDate && selectedTime && user;

  const stepLabels = ['로그인', '상품선택', '상담사탐색', '일정선택', '예약확인', '결제', '완료'];

  if (!counselor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">상담사 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StepIndicator currentStep={4} totalSteps={7} stepLabels={stepLabels} />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <button
          onClick={() => navigate('/reservation/counselor')}
          className="flex items-center gap-2 text-primary hover:underline font-medium mb-8"
        >
          <ChevronLeft size={20} />
          상담사 다시 선택
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 상담사 정보 */}
          <div className="lg:col-span-1">
            <CounselorDetail counselor={counselor} />
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">예상 결제 금액:</span>{' '}
                <span className="text-lg font-bold text-primary">
                  {reservationData.totalPrice?.toLocaleString()}원
                </span>
              </p>
            </div>
          </div>

          {/* 일정 선택 및 정보 입력 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 날짜 선택 */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">1. 날짜 선택</h3>
              <CalendarPicker
                availableDates={availableDates}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
            </div>

            {/* 시간 선택 */}
            {selectedDate && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">2. 시간 선택</h3>
                <TimeSlotSelector
                  availableTimes={availableTimes}
                  selectedTime={selectedTime}
                  onTimeSelect={setSelectedTime}
                />
              </div>
            )}

            {/* 정보 입력 */}
            {selectedDate && selectedTime && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">3. 추가 정보 입력</h3>
                <InfoForm onSubmit={handleInfoFormSubmit} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
