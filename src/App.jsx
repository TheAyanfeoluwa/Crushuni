
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import FAQ from './pages/FAQ';
import SignIn from './pages/Auth/SignIn';
import SignUp from './pages/Auth/SignUp';
import ResetPassword from './pages/Auth/ResetPassword';
import NotFound from './pages/NotFound';
import DashboardLayout from './components/DashboardLayout';
import Chatbot from './pages/Chatbot';

// Flashcards
import FlashcardDashboard from './pages/Flashcards/Dashboard';
import CreateFlashcardDeck from './pages/Flashcards/Create';
import FlashcardStudy from './pages/Flashcards/Study';

// Concepts
import ConceptDashboard from './pages/Concepts/Dashboard';
import CreateConcept from './pages/Concepts/Create';
import ConceptView from './pages/Concepts/View';
import AccountSettings from './pages/AccountSettings';
import DashboardOverview from './pages/DashboardOverview';
import { LayoutProvider } from './context/LayoutContext';

import './App.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import { Loader2 } from 'lucide-react';

const LandingLayout = ({ children }) => (
  <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <Header />
    {children}
    <Footer />
  </div>
);

const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" size={40} color="var(--color-primary)" />
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } } .animate-spin { animation: spin 1s linear infinite; }`}</style>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <LayoutProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingLayout><Home /></LandingLayout>} />
            <Route path="/pricing" element={<LandingLayout><Pricing /></LandingLayout>} />
            <Route path="/faq" element={<LandingLayout><FAQ /></LandingLayout>} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected App Routes */}
            <Route path="/app" element={
              <RequireAuth>
                <DashboardLayout />
              </RequireAuth>
            }>
              <Route index element={<Navigate to="/app/overview" replace />} />
              <Route path="overview" element={<DashboardOverview />} />

              {/* Flashcards */}
              <Route path="flashcards" element={<FlashcardDashboard />} />
              <Route path="flashcards/create" element={<CreateFlashcardDeck />} />
              <Route path="flashcards/study/:id" element={<FlashcardStudy />} />

              {/* Chatbot */}
              <Route path="chatbot" element={<Chatbot />} />

              {/* Concept Extractor */}
              <Route path="extractor" element={<ConceptDashboard />} />
              <Route path="extractor/create" element={<CreateConcept />} />
              <Route path="extractor/view/:id" element={<ConceptView />} />
              <Route path="settings" element={<AccountSettings />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LayoutProvider>
    </AuthProvider>
  );
}

export default App;
