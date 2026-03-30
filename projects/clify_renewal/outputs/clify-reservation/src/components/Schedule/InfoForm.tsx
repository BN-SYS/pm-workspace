import React, { useState } from 'react';
import { Button } from '../Common';
import { Calendar, FileText, Tag, Video } from 'lucide-react';

interface InfoFormProps {
  onSubmit: (data: {
    birthDate: string;
    topic: string;
    specialties: string[];
    serviceType: 'offline' | 'online-video' | 'online-phone';
  }) => void;
  isLoading?: boolean;
}

export const InfoForm: React.FC<InfoFormProps> = ({ onSubmit, isLoading = false }) => {
  const [birthDate, setBirthDate] = useState('');
  const [topic, setTopic] = useState('');
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [serviceType, setServiceType] = useState<'offline' | 'online-video' | 'online-phone'>('online-video');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const specialtyOptions = [
    '#우울/불안',
    '#대인관계',
    '#직무스트레스',
    '#자존감',
    '#부부상담',
    '#기타',
  ];

  const handleSpecialtyToggle = (specialty: string) => {
    setSpecialties((prev) =>
      prev.includes(specialty)
        ? prev.filter((s) => s !== specialty)
        : [...prev, specialty]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!birthDate) {
      newErrors.birthDate = '생년월일을 입력해주세요.';
    }
    if (specialties.length === 0) {
      newErrors.specialties = '상담 주제를 선택해주세요.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      birthDate,
      topic,
      specialties,
      serviceType,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      {/* 생년월일 */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          <Calendar className="inline mr-2" size={16} />
          생년월일 (필수)
        </label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => {
            setBirthDate(e.target.value);
            setErrors((prev) => ({ ...prev, birthDate: '' }));
          }}
          className={`
            w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50
            ${errors.birthDate ? 'border-red-500' : 'border-gray-300'}
          `}
        />
        {errors.birthDate && (
          <p className="text-sm text-red-500 mt-1">{errors.birthDate}</p>
        )}
      </div>

      {/* 상담 내용 */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          <FileText className="inline mr-2" size={16} />
          상담 받고 싶은 내용 (선택)
        </label>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="예: 직장에서의 스트레스로 인한 번아웃 증상..."
          rows={4}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
        />
      </div>

      {/* 전문 분야 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-3">
          <Tag className="inline mr-2" size={16} />
          전문 분야 선택 (필수)
        </label>
        <div className="flex flex-wrap gap-2">
          {specialtyOptions.map((specialty) => (
            <button
              key={specialty}
              type="button"
              onClick={() => handleSpecialtyToggle(specialty)}
              className={`
                px-4 py-2 rounded-lg font-medium text-sm transition
                ${
                  specialties.includes(specialty)
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {specialty}
            </button>
          ))}
        </div>
        {errors.specialties && (
          <p className="text-sm text-red-500 mt-2">{errors.specialties}</p>
        )}
      </div>

      {/* 상담 방식 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-3">
          <Video className="inline mr-2" size={16} />
          상담 방식 선택
        </label>
        <div className="space-y-2">
          {[
            { value: 'offline', label: '대면 상담' },
            { value: 'online-video', label: '비대면 (화상)' },
            { value: 'online-phone', label: '비대면 (전화)' },
          ].map(({ value, label }) => (
            <label key={value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="serviceType"
                value={value}
                checked={serviceType === value}
                onChange={(e) => setServiceType(e.target.value as any)}
                className="w-4 h-4 text-primary"
              />
              <span className="text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        fullWidth
        size="lg"
        isLoading={isLoading}
      >
        예약하기
      </Button>
    </form>
  );
};
