import React, { Suspense, lazy, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useToast } from './components/Toast';

// Eager load landing, login, and apartments pages
import RoomyLanding from './LandingPage/RoomyLanding';
import Login from './Login/Login';
import ApartmentsClean from './Apartments/ApartmentsClean';

export const ToastContext = createContext();

// Lazy load other pages for better performance
const Dashboard = lazy(() => import('./Dashboard/Dashboard'));
const SignUp = lazy(() => import('./SignUp/SignUp'));
const Chores = lazy(() => import('./Chores/Chores'));
const Payments = lazy(() => import('./Payments/Payments'));
const Roommates = lazy(() => import('./Roommates/Roommates'));
const ForgotPassword = lazy(() => import('./Login/ForgotPassword'));
const EmailSent = lazy(() => import('./Login/EmailSent'));
const Calculator = lazy(() => import('./Calculator/Calculator'));
const Groceries = lazy(() => import('./Groceries/Groceries'));
const Profile = lazy(() => import('./Profile/Profile'));

// Loading fallback component
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    flexDirection: 'column',
    gap: '1rem'
  }}>
    <div className="spinner"></div>
    <p style={{ color: '#6b7280' }}>Loading...</p>
  </div>
);

export default function App() {
  const { showToast, ToastContainer } = useToast();

  return (
    <ToastContext.Provider value={showToast}>
      <Router>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<RoomyLanding />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/apartments" element={<ApartmentsClean />} />
            <Route path="/chores" element={<Chores />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/roommates" element={<Roommates />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/emailsent" element={<EmailSent />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/groceries" element={<Groceries />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Suspense>
        <ToastContainer />
      </Router>
    </ToastContext.Provider>
  );
}
