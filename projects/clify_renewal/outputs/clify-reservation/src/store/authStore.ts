import { create } from 'zustand';
import { User, UserType, AuthState } from '../types';
import { getCompanyByDomain } from '../data';

interface AuthStore extends AuthState {
  setUser: (user: User | null) => void;
  setUserType: (userType: UserType | null) => void;
  logout: () => void;
  loginCorporate: (email: string, password: string) => Promise<boolean>;
  loginIndividual: (email: string, password: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoggedIn: false,
  userType: null,

  setUser: (user) => set({ user, isLoggedIn: !!user }),
  
  setUserType: (userType) => set({ userType }),

  logout: () => set({ user: null, isLoggedIn: false, userType: null }),

  loginCorporate: async (email: string, password: string) => {
    // Mock: 회사 이메일 도메인 검증
    const domain = email.split('@')[1];
    const company = getCompanyByDomain(domain);

    if (!company) {
      console.error('등록되지 않은 기업입니다');
      return false;
    }

    // Mock 로그인 (실제로는 API 호출)
    const mockUser: User = {
      id: `user-${Date.now()}`,
      email,
      name: '김철수',
      userType: 'corporate',
      companyId: company.id,
      companyName: company.name,
      points: company.pointBalance,
    };

    set({
      user: mockUser,
      isLoggedIn: true,
      userType: 'corporate',
    });

    return true;
  },

  loginIndividual: async (email: string, password: string) => {
    // Mock 로그인 (실제로는 API 호출)
    const mockUser: User = {
      id: `user-${Date.now()}`,
      email,
      name: '일반사용자',
      userType: 'individual',
      birthDate: '',
    };

    set({
      user: mockUser,
      isLoggedIn: true,
      userType: 'individual',
    });

    return true;
  },
}));
