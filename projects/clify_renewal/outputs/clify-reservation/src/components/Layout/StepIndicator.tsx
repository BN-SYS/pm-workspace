import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  stepLabels,
}) => {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center">
          {stepLabels.map((label, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;

            return (
              <div key={stepNumber} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                      transition-all duration-200
                      ${
                        isCompleted
                          ? 'bg-success text-white'
                          : isCurrent
                          ? 'bg-primary text-white ring-4 ring-primary/20'
                          : 'bg-gray-200 text-gray-500'
                      }
                    `}
                  >
                    {isCompleted ? <Check size={18} /> : stepNumber}
                  </div>
                  <p
                    className={`
                      text-xs font-medium mt-2 text-center
                      ${isCurrent || isCompleted ? 'text-primary' : 'text-gray-500'}
                    `}
                  >
                    {label}
                  </p>
                </div>
                {stepNumber < totalSteps && (
                  <div
                    className={`
                      flex-1 h-1 mx-4 rounded
                      ${isCompleted ? 'bg-success' : 'bg-gray-200'}
                    `}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
