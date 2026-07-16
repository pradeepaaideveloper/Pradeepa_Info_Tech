import React from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 selection:bg-sky-500/30 selection:text-sky-300">
      {/* Dynamic Global Navbar */}
      <Navbar />

      {/* Main Page Layout Wrapper */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10 animate-fade-in-up">
        {children}
      </main>

      {/* Dynamic Global Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
