import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppStore } from './store';
import { Navigation } from './components/Navigation';
import { MainlineView } from './views/MainlineView';
import { PotentialView } from './views/PotentialView';
import { PortfolioView } from './views/PortfolioView';
import { ReviewView } from './views/ReviewView';
import { NotificationToast } from './components/UI';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { notification } = useAppStore();
  
  return (
    <div className="min-h-screen bg-[#F0F4F8] pb-24 md:pb-8">
      <NotificationToast message={notification} />
      <Navigation />
      <main className="md:ml-80 p-4 md:p-8 min-h-screen max-w-7xl mx-auto transition-all">
        {children}
      </main>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<MainlineView />} />
        <Route path="/portfolio" element={<PortfolioView />} />
        <Route path="/potential" element={<PotentialView />} />
        <Route path="/review" element={<ReviewView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AppProvider>
  );
};

export default App;