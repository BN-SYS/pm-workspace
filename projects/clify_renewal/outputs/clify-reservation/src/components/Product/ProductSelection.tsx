import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useReservationStore } from '../../store/reservationStore';
import { mockProductsIndividual, mockProductsCorporate } from '../../data';
import { ProductCard } from './ProductCard';
import { Product } from '../../types';
import { StepIndicator } from '../Layout';

export const ProductSelection: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { updateReservationData, setCurrentStep } = useReservationStore();

  const products = useMemo(() => {
    return user?.userType === 'corporate' ? mockProductsCorporate : mockProductsIndividual;
  }, [user?.userType]);

  const handleSelectProduct = (product: Product) => {
    updateReservationData({
      productId: product.id,
      totalPrice: product.price,
    });
    setCurrentStep(3);
    navigate('/reservation/counselor');
  };

  const stepLabels = ['로그인', '상품선택', '상담사탐색', '일정선택', '예약확인', '결제', '완료'];

  return (
    <div className="min-h-screen bg-gray-50">
      <StepIndicator currentStep={2} totalSteps={7} stepLabels={stepLabels} />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            심리상담 상품을 선택해주세요
          </h1>
          <p className="text-gray-600">
            {user?.userType === 'corporate'
              ? '기업 고객을 위한 맞춤형 상품입니다.'
              : '본인의 필요에 맞는 상품을 선택하세요.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={handleSelectProduct}
            />
          ))}
        </div>

        {user?.userType === 'corporate' && user.points && (
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">보유 포인트:</span> {user.points.toLocaleString()}P
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
