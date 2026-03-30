import React from 'react';
import { Product } from '../../types';
import { Card, Button } from '../Common';
import { Clock, DollarSign } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      <div className="flex-1">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{product.description}</p>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock size={16} className="text-primary" />
            <span>{product.duration}분</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign size={16} className="text-success" />
            <span className="font-semibold text-gray-900">
              {product.price.toLocaleString()}원
            </span>
          </div>
        </div>
      </div>

      <Button
        variant="primary"
        fullWidth
        size="md"
        onClick={() => onSelect(product)}
        className="mt-4"
      >
        선택하기
      </Button>
    </Card>
  );
};
