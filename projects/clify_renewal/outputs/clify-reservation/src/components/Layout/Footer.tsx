import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">CLIFY</h3>
            <p className="text-sm">전문가와 함께하는 심리상담 서비스</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">서비스</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">심리상담</a></li>
              <li><a href="#" className="hover:text-white transition">심리검사</a></li>
              <li><a href="#" className="hover:text-white transition">코칭</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">고객지원</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">공지사항</a></li>
              <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition">1:1 문의</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">연락처</h4>
            <p className="text-sm mb-2">고객센터: 1588-XXXX</p>
            <p className="text-sm">이메일: support@clify.co.kr</p>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center text-sm">
          <p>&copy; 2026 CLIFY. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
