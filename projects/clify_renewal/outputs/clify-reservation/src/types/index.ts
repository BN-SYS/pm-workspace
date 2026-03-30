// 사용자 타입
export type UserType = 'corporate' | 'individual';

export interface User {
  id: string;
  email: string;
  name: string;
  birthDate?: string;
  userType: UserType;
  companyId?: string;
  companyName?: string;
  points?: number;
}

// 인증 관련
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  userType: UserType | null;
}

// 상품 타입
export interface Product {
  id: string;
  name: string;
  description: string;
  duration: number; // 분 단위
  price: number;
  category: 'counseling' | 'test' | 'coaching';
  availability: 'individual' | 'corporate' | 'both';
  image?: string;
}

// 상담사 타입
export interface Counselor {
  id: string;
  name: string;
  title: string; // 자격증/직급
  bio: string;
  specialties: string[]; // '#우울', '#불안' 등
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  availability: AvailabilitySlot[];
  serviceType: ('offline' | 'online-video' | 'online-phone')[];
  availableRegions?: string[]; // 대면 상담 가능 지역
}

// 가용 시간 슬롯
export interface AvailabilitySlot {
  date: string; // 'YYYY-MM-DD'
  startTime: string; // 'HH:mm'
  endTime: string; // 'HH:mm'
  isAvailable: boolean;
}

// 예약 관련
export interface ReservationData {
  productId: string;
  counselorId: string;
  counselorName: string;
  reservationDate: string; // 'YYYY-MM-DD'
  reservationTime: string; // 'HH:mm'
  userBirthDate: string;
  consultationTopic?: string;
  specialties: string[];
  serviceType: 'offline' | 'online-video' | 'online-phone';
  totalPrice: number;
  corporateSupport?: number; // 기업 지원금
  userPayment?: number; // 개인 결제액
}

export interface Reservation {
  id: string;
  reservationNumber: string;
  userId: string;
  data: ReservationData;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  cancelReason?: string;
}

// 결제 관련
export interface PaymentInfo {
  amount: number;
  method: 'credit-card' | 'debit-card' | 'kakao-pay' | 'naver-pay' | 'toss';
  cardBrand?: string;
  pointUsed?: number;
  personalPayment?: number;
}

// 필터 관련
export interface CounselorFilters {
  date?: string;
  serviceType?: 'offline' | 'online-video' | 'online-phone';
  region?: string; // 대면 선택 시
  specialties?: string[];
}

// 정렬 옵션
export type SortOption = 'rating' | 'review' | 'price';
