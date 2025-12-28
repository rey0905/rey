import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Stock } from './types';

interface AppContextType {
  stocks: Stock[];
  addStock: (stock: Omit<Stock, 'id' | 'createdAt'>) => void;
  updateStock: (id: string, updates: Partial<Stock>) => void;
  deleteStock: (id: string) => void;
  renameSector: (oldName: string, newName: string) => void;
  deleteSector: (sectorName: string) => void;
  moveToMainline: (id: string) => void;
  notification: string | null;
  showNotification: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'stock_notes_v1';

const INITIAL_DATA: Stock[] = [];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setStocks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse stocks", e);
        setStocks(INITIAL_DATA);
      }
    } else {
      setStocks(INITIAL_DATA);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    // Save even if empty to persist deletions/clearing
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stocks));
  }, [stocks]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const addStock = (stockData: Omit<Stock, 'id' | 'createdAt'>) => {
    const newStock: Stock = {
      ...stockData,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };
    setStocks(prev => [newStock, ...prev]);
    showNotification('✅ 已保存成功');
  };

  const updateStock = (id: string, updates: Partial<Stock>) => {
    setStocks(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    showNotification('✅ 已保存成功');
  };

  const deleteStock = (id: string) => {
    if (window.confirm('确定要删除这条记录吗？')) {
      setStocks(prev => prev.filter(s => s.id !== id));
      showNotification('🗑️ 已删除');
    }
  };

  const renameSector = (oldName: string, newName: string) => {
    if (!newName.trim() || oldName === newName) return;
    setStocks(prev => prev.map(s => s.sector === oldName ? { ...s, sector: newName } : s));
    showNotification('✅ 赛道名称已修改');
  };

  const deleteSector = (sectorName: string) => {
    if (window.confirm(`确定要删除赛道 "${sectorName}" 及其下的所有股票吗？`)) {
      setStocks(prev => prev.filter(s => s.sector !== sectorName));
      showNotification('🗑️ 赛道已删除');
    }
  };

  const moveToMainline = (id: string) => {
    updateStock(id, { isPotential: false, status: 'watching' });
  };

  return (
    <AppContext.Provider value={{ stocks, addStock, updateStock, deleteStock, renameSector, deleteSector, moveToMainline, notification, showNotification }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppStore must be used within AppProvider');
  return context;
};