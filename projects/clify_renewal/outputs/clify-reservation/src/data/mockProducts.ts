import { Product } from '../types';

export const mockProductsIndividual: Product[] = [
  {
    id: 'product-1',
    name: '심리상담 1회권 (50분)',
    description: '전문 심리상담사와 1:1로 진행되는 맞춤형 심리상담 서비스입니다. (대면/비대면 선택 가능)',
    duration: 50,
    price: 80000,
    category: 'counseling',
    availability: 'individual',
  },
  {
    id: 'product-2',
    name: '부부/커플 상담 (80분)',
    description: '관계 개선과 소통을 위한 2인 동반 심리상담 프로그램입니다. (대면 상담 권장)',
    duration: 80,
    price: 150000,
    category: 'counseling',
    availability: 'individual',
  },
  {
    id: 'product-3',
    name: '청소년 상담 (50분)',
    description: '청소년을 위한 학업 상담 (비대면만 가능)',
    duration: 50,
    price: 80000,
    category: 'counseling',
    availability: 'individual',
  },
  {
    id: 'product-4',
    name: '외국인 상담 (50분)',
    description: '영어/일본어 상담 가능',
    duration: 50,
    price: 100000,
    category: 'counseling',
    availability: 'individual',
  },
];

export const mockProductsCorporate: Product[] = [
  {
    id: 'product-1',
    name: '심리상담 1회권 (50분)',
    description: '전문 심리상담사와 1:1로 진행되는 맞춤형 심리상담 서비스입니다. (대면/비대면 선택 가능)',
    duration: 50,
    price: 70000, // 기업 특가
    category: 'counseling',
    availability: 'corporate',
  },
  {
    id: 'product-2',
    name: '부부/커플 상담 (80분)',
    description: '관계 개선과 소통을 위한 2인 동반 심리상담 프로그램입니다. (대면 상담 권장)',
    duration: 80,
    price: 130000, // 기업 특가
    category: 'counseling',
    availability: 'corporate',
  },
  {
    id: 'product-3',
    name: '청소년 상담 (50분)',
    description: '청소년을 위한 학업 상담 (비대면만 가능)',
    duration: 50,
    price: 75000, // 기업 특가
    category: 'counseling',
    availability: 'corporate',
  },
  {
    id: 'product-4',
    name: '외국인 상담 (50분)',
    description: '영어/일본어 상담 가능',
    duration: 50,
    price: 90000, // 기업 특가
    category: 'counseling',
    availability: 'corporate',
  },
];
