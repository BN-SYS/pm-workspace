import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Card, Button, Badge } from '../Common';
import { User, Mail, Phone, Building2, Zap } from 'lucide-react';

export const UserInfo: React.FC = () => {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">사용자 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 기본 정보 */}
      <Card>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <User size={28} className="text-primary" />
              {user.name}
            </h3>
            <div className="mt-2 flex items-center gap-2">
              {user.userType === 'corporate' ? (
                <Badge variant="primary" size="md">
                  <Building2 className="inline mr-1" size={14} />
                  기업회원
                </Badge>
              ) : (
                <Badge variant="secondary" size="md">일반회원</Badge>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? '저장' : '수정'}
          </Button>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <Mail className="text-gray-400" size={20} />
            <div>
              <p className="text-sm text-gray-600">이메일</p>
              <p className="font-medium text-gray-900">{user.email}</p>
            </div>
          </div>

          {user.companyName && (
            <div className="flex items-center gap-3">
              <Building2 className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-600">소속 기업</p>
                <p className="font-medium text-gray-900">{user.companyName}</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* 기업회원 - 포인트 정보 */}
      {user.userType === 'corporate' && user.points !== undefined && (
        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                <Zap size={16} className="text-primary" />
                보유 포인트
              </p>
              <p className="text-3xl font-bold text-primary">
                {user.points.toLocaleString()}P
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-600 mb-2">조회일</p>
              <p className="text-sm text-gray-900">
                {new Date().toLocaleDateString('ko-KR')}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* 계정 설정 */}
      <Card>
        <h3 className="text-lg font-bold text-gray-900 mb-4">계정 설정</h3>
        <div className="space-y-3">
          <button className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded transition font-medium text-gray-700">
            비밀번호 변경
          </button>
          <button className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded transition font-medium text-gray-700">
            개인정보 수정
          </button>
          <button className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded transition font-medium text-gray-700">
            알림 설정
          </button>
          <button className="w-full text-left px-4 py-3 hover:bg-red-50 rounded transition font-medium text-red-600">
            회원탈퇴
          </button>
        </div>
      </Card>

      {/* 고객 지원 */}
      <Card>
        <h3 className="text-lg font-bold text-gray-900 mb-4">고객 지원</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600 mb-1">고객센터</p>
            <a href="tel:1588-0000" className="text-lg font-semibold text-primary hover:underline">
              1588-XXXX
            </a>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">이메일</p>
            <a href="mailto:support@clify.co.kr" className="text-lg font-semibold text-primary hover:underline">
              support@clify.co.kr
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
};
