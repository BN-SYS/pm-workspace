import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarPickerProps {
  onDateSelect: (date: string) => void;
  selectedDate?: string;
  availableDates: string[];
}

export const CalendarPicker: React.FC<CalendarPickerProps> = ({
  onDateSelect,
  selectedDate,
  availableDates,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date(new Date().getTime() + 24 * 60 * 60 * 1000));

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  // 이전 달의 빈 칸
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // 현재 달의 날짜
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
    days.push(formatDate(date));
  }

  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded transition"
        >
          <ChevronLeft size={20} />
        </button>
        <h3 className="text-lg font-bold">
          {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
        </h3>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded transition"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-2 mb-3">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center font-semibold text-gray-600 text-sm py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 칸 */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((date, index) => {
          const isAvailable = date ? availableDates.includes(date) : false;
          const isSelected = date === selectedDate;

          return (
            <button
              key={index}
              disabled={!isAvailable}
              onClick={() => date && onDateSelect(date)}
              className={`
                aspect-square rounded-lg font-medium text-sm transition
                ${!date ? 'opacity-0 cursor-default' : ''}
                ${!isAvailable && date ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}
                ${isAvailable && !isSelected ? 'bg-gray-50 text-gray-900 hover:bg-gray-100' : ''}
                ${isSelected ? 'bg-primary text-white' : ''}
              `}
            >
              {date ? new Date(date).getDate() : ''}
            </button>
          );
        })}
      </div>
    </div>
  );
};
