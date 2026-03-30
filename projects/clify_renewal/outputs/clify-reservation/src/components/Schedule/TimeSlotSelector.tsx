import React from 'react';

interface TimeSlotSelectorProps {
  availableTimes: string[];
  selectedTime?: string;
  onTimeSelect: (time: string) => void;
}

export const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  availableTimes,
  selectedTime,
  onTimeSelect,
}) => {
  const groupedByPeriod = {
    morning: availableTimes.filter((t) => {
      const hour = parseInt(t.split(':')[0]);
      return hour < 12;
    }),
    afternoon: availableTimes.filter((t) => {
      const hour = parseInt(t.split(':')[0]);
      return hour >= 12 && hour < 18;
    }),
    evening: availableTimes.filter((t) => {
      const hour = parseInt(t.split(':')[0]);
      return hour >= 18;
    }),
  };

  const renderPeriod = (label: string, times: string[]) => {
    if (times.length === 0) return null;

    return (
      <div key={label} className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">
          {label === 'morning' && '오전'}
          {label === 'afternoon' && '오후'}
          {label === 'evening' && '저녁'}
        </h4>
        <div className="grid grid-cols-4 gap-2">
          {times.map((time) => (
            <button
              key={time}
              onClick={() => onTimeSelect(time)}
              className={`
                py-2 px-3 rounded-lg font-medium text-sm transition
                ${
                  selectedTime === time
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }
              `}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">가능한 시간을 선택해주세요</h3>
      {renderPeriod('morning', groupedByPeriod.morning)}
      {renderPeriod('afternoon', groupedByPeriod.afternoon)}
      {renderPeriod('evening', groupedByPeriod.evening)}
    </div>
  );
};
