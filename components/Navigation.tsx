import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PieChart, TrendingUp, Star, RefreshCw } from 'lucide-react';

const NavItem: React.FC<{ 
  to: string; 
  icon: React.ReactNode; 
  label: string; 
  isActive: boolean;
  mobile?: boolean;
}> = ({ to, icon, label, isActive, mobile }) => {
  const navigate = useNavigate();
  
  if (mobile) {
    return (
      <button
        onClick={() => navigate(to)}
        className={`flex flex-col items-center justify-center w-full py-2 transition-colors ${
          isActive ? 'text-brand-dark' : 'text-gray-400'
        }`}
      >
        <div className={`mb-1 ${isActive ? 'text-brand-red' : ''}`}>
          {React.cloneElement(icon as React.ReactElement<{ size: number }>, { size: 28 })}
        </div>
        <span className={`text-xs font-bold ${isActive ? 'text-brand-dark' : 'text-gray-500'}`}>{label}</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => navigate(to)}
      className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl transition-all mb-4 ${
        isActive 
          ? 'bg-white text-brand-dark shadow-lg font-bold scale-105' 
          : 'text-blue-100 hover:bg-blue-800 hover:text-white'
      }`}
    >
      <div className={`${isActive ? 'text-brand-red' : 'text-blue-300'}`}>
        {icon}
      </div>
      <span className="text-2xl tracking-wide">{label}</span>
    </button>
  );
};

export const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { to: '/', icon: <PieChart size={32} />, label: '主线' },
    { to: '/portfolio', icon: <TrendingUp size={32} />, label: '持仓' },
    { to: '/potential', icon: <Star size={32} />, label: '潜力' },
    { to: '/review', icon: <RefreshCw size={32} />, label: '复盘' },
  ];

  return (
    <>
      {/* Desktop Sidebar (HP 20" optimized) */}
      <div className="hidden md:flex h-screen w-80 bg-brand-dark flex-col p-6 fixed left-0 top-0 z-40 shadow-2xl overflow-y-auto">
        <div className="mb-12 mt-4 px-2">
          <h1 className="text-4xl font-black text-white tracking-widest flex items-center gap-2">
            <TrendingUp className="text-brand-red" size={40} />
            股经笔记
          </h1>
          <p className="text-blue-300 text-lg mt-2 opacity-80">稳健复利 · 快乐投资</p>
        </div>

        <nav className="flex-1">
          {navItems.map(item => (
            <NavItem 
              key={item.to}
              {...item}
              isActive={location.pathname === item.to}
            />
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-blue-800">
          <p className="text-blue-400 text-center text-lg">
            v1.1 适老版
          </p>
        </div>
      </div>

      {/* Mobile Bottom Nav (Huawei Mate 50 optimized) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
        <div className="flex justify-around items-center h-[80px]">
          {navItems.map(item => (
            <NavItem 
              key={item.to}
              {...item}
              isActive={location.pathname === item.to}
              mobile
            />
          ))}
        </div>
      </div>
    </>
  );
};