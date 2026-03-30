import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Layout
import { Header, Footer } from './components/Layout';

// Pages
import { HomePage, CompletionPage } from './pages';

// Auth Components
import { LoginSelector, LoginTrackA, LoginTrackB } from './components/Auth';

// Reservation Flow Components
import { ProductSelection } from './components/Product';
import { CounselorSearch } from './components/Counselor';
import { ScheduleSelection } from './components/Schedule';
import { ReservationReview } from './components/Confirmation';
import { PaymentTrackA, PaymentTrackB } from './components/Payment';

// MyPage
import { MyPageLayout } from './components/MyPage';

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiresAuth = false 
}) => {
  const { isLoggedIn } = useAuthStore();

  if (requiresAuth && !isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  const { isLoggedIn, user } = useAuthStore();

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            {/* 홈 */}
            <Route path="/" element={<HomePage />} />

            {/* 로그인 */}
            <Route path="/login" element={<LoginSelector />} />
            <Route path="/login/corporate" element={<LoginTrackA />} />
            <Route path="/login/individual" element={<LoginTrackB />} />

            {/* 예약 플로우 */}
            <Route
              path="/reservation/product"
              element={
                <ProtectedRoute requiresAuth>
                  <ProductSelection />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reservation/counselor"
              element={
                <ProtectedRoute requiresAuth>
                  <CounselorSearch />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reservation/schedule"
              element={
                <ProtectedRoute requiresAuth>
                  <ScheduleSelection />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reservation/confirmation"
              element={
                <ProtectedRoute requiresAuth>
                  <ReservationReview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reservation/payment"
              element={
                <ProtectedRoute requiresAuth>
                  {user?.userType === 'corporate' ? (
                    <PaymentTrackA />
                  ) : (
                    <PaymentTrackB />
                  )}
                </ProtectedRoute>
              }
            />
            <Route
              path="/reservation/complete"
              element={
                <ProtectedRoute requiresAuth>
                  <CompletionPage />
                </ProtectedRoute>
              }
            />

            {/* 마이페이지 */}
            <Route
              path="/mypage"
              element={
                <ProtectedRoute requiresAuth>
                  <MyPageLayout />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
