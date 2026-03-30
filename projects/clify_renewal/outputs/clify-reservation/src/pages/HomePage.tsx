import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/Common';
import { ArrowRight, Heart, Users, TrendingUp, MessageCircle } from 'lucide-react';

export const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuthStore();

    return (
        <div className="min-h-screen">
            {/* 히어로 섹션 */}
            <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent py-24 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        전문가와 함께하는
                        <br />
                        <span className="text-primary">심리상담 서비스</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                        마음이 힘든 당신을 위해 준비했습니다.
                        <br />
                        CLIFY와 함께 따뜻한 상담을 경험해보세요.
                    </p>
                    <div className="flex gap-4 justify-center flex-wrap">
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={() => navigate(isLoggedIn ? '/reservation/product' : '/login')}
                            className="gap-2"
                        >
                            상담 예약하기
                            <ArrowRight size={20} />
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                        >
                            서비스 소개 보기
                        </Button>
                    </div>
                </div>
            </section>

            {/* 서비스 특징 */}
            <section className="py-24 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
                        CLIFY만의 특징
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: Users,
                                title: '전문 상담사',
                                description: '경험 많은 전문가들이 당신의 이야기를 듣습니다',
                            },
                            {
                                icon: Heart,
                                title: '맞춤형 상담',
                                description: '개인의 상황에 맞춘 전문적인 상담 제공',
                            },
                            {
                                icon: TrendingUp,
                                title: '신뢰와 안전',
                                description: '개인정보 보호 및 비밀유지 최우선',
                            },
                            {
                                icon: MessageCircle,
                                title: '편리한 예약',
                                description: '대면/비대면 선택 가능한 자유로운 상담',
                            },
                        ].map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div key={index} className="text-center">
                                    <div className="flex justify-center mb-4">
                                        <div className="p-4 bg-primary/10 rounded-full">
                                            <Icon className="text-primary" size={40} />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 상담 유형 */}
            <section className="py-24 px-4 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
                        우리가 제공하는 상담
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            {
                                title: '1:1 맞춤형 심리상담',
                                description: '직무 스트레스, 대인관계, 우울감 등 다양한 주제의 상담',
                                duration: '50분',
                            },
                            {
                                title: '부부/커플 상담',
                                description: '관계 개선과 소통을 위한 전문적 상담 프로그램',
                                duration: '80분',
                            },
                            {
                                title: '청소년 상담',
                                description: '학업 스트레스와 또래관계 문제 해결을 위한 상담',
                                duration: '50분',
                            },
                            {
                                title: '외국인 상담',
                                description: '영어, 일본어로 진행하는 맞춤형 상담 서비스',
                                duration: '50분',
                            },
                        ].map((service, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {service.title}
                                </h3>
                                <p className="text-gray-600 mb-4">{service.description}</p>
                                <p className="text-sm font-medium text-primary">
                                    {service.duration} 상담
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA 섹션 */}
            <section className="py-24 px-4 bg-gradient-to-br from-primary to-secondary">
                <div className="max-w-4xl mx-auto text-center text-white">
                    <h2 className="text-4xl font-bold mb-6">
                        지금 바로 시작해보세요
                    </h2>
                    <p className="text-xl mb-8 text-white/90">
                        전문가와의 상담을 통해 더 나은 마음 건강을 찾아보세요.
                    </p>
                    <div className="flex justify-center">
                        <button
                            onClick={() => navigate(isLoggedIn ? '/reservation/product' : '/login')}
                            className="px-6 py-3 text-lg font-medium bg-white text-primary rounded-lg hover:bg-gray-100 transition flex items-center gap-2"
                        >
                            상담 예약하기
                            <ArrowRight size={20} />
                        </button>
                    </div>


                </div>
            </section>
        </div>
    );
};
