import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Stock } from '../types';
import { Card, ButtonPrimary, ButtonSecondary, Input, Textarea, Badge } from '../components/UI';
import { Plus, ArrowRight, X, Sparkles } from 'lucide-react';

const PotentialCard: React.FC<{ stock: Stock }> = ({ stock }) => {
  const { moveToMainline, deleteStock } = useAppStore();

  return (
    <Card className="border-l-4 border-l-yellow-400 hover:shadow-lg transition-all">
      <div className="flex flex-col md:flex-row gap-6 justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Badge color="gray">{stock.sector}</Badge>
            <h3 className="text-2xl font-bold text-gray-900">{stock.name}</h3>
            {stock.code && <span className="text-xl text-gray-500 font-mono">{stock.code}</span>}
          </div>
          
          <div className="mt-4 bg-yellow-50 p-4 rounded-lg border border-yellow-100">
             <h4 className="text-yellow-700 font-bold text-lg mb-2 flex items-center gap-2">
              <Sparkles size={20} /> 潜力逻辑
            </h4>
            <p className="text-xl text-gray-800 leading-relaxed">
              {stock.buyLogic}
            </p>
          </div>
        </div>

        <div className="flex flex-row md:flex-col gap-3 justify-center min-w-[160px] border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
          <button 
            onClick={() => moveToMainline(stock.id)}
            className="flex-1 bg-brand-dark text-white p-4 rounded-lg font-bold text-lg shadow hover:bg-blue-900 flex items-center justify-center gap-2"
          >
            转为主线 <ArrowRight />
          </button>
          <button 
            onClick={() => deleteStock(stock.id)}
            className="px-4 py-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded text-lg font-semibold transition-colors"
          >
            删除
          </button>
        </div>
      </div>
    </Card>
  );
};

export const PotentialView: React.FC = () => {
  const { stocks, addStock } = useAppStore();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', sector: '', logic: '' });

  const potentialStocks = stocks.filter(s => s.isPotential);

  const handleSubmit = () => {
    if (!form.name || !form.logic) return;
    addStock({
      name: form.name,
      code: '',
      sector: form.sector || '未分类',
      buyLogic: form.logic,
      sellLogic: '', // Not needed yet
      isPotential: true,
      status: 'watching',
      reviewType: 'none'
    });
    setForm({ name: '', sector: '', logic: '' });
    setShowAdd(false);
  };

  return (
    <div className="pb-20">
      <div className="flex flex-col items-center mb-10 text-center">
        <h1 className="text-4xl font-bold text-brand-dark mb-3">🌟 潜力挖掘</h1>
        <p className="text-gray-500 text-xl mb-6">观察中，等待时机成熟</p>
        <ButtonPrimary 
          onClick={() => setShowAdd(true)}
          className="w-full md:w-auto px-12 min-w-[280px] shadow-xl hover:scale-105 transition-transform"
        >
          <Plus size={28} /> 记一个潜力股
        </ButtonPrimary>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {potentialStocks.map(stock => (
          <PotentialCard key={stock.id} stock={stock} />
        ))}
        {potentialStocks.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
            <p className="text-2xl text-gray-400 mb-4">还没有潜力股记录</p>
          </div>
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-brand-dark">记录潜力股</h2>
              <button onClick={() => setShowAdd(false)}><X size={32} className="text-gray-400" /></button>
            </div>
            
            <div className="space-y-6">
              <Input 
                label="行业领域" 
                placeholder="例如：机器人" 
                value={form.sector}
                onChange={e => setForm({...form, sector: e.target.value})}
              />
              <Input 
                label="股票名称" 
                placeholder="例如：鸣志电器" 
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
              />
              <Textarea 
                label="为什么觉得有潜力？" 
                placeholder="逻辑记录..."
                value={form.logic}
                onChange={e => setForm({...form, logic: e.target.value})}
              />
              <ButtonPrimary onClick={handleSubmit} className="w-full mt-4">
                保存
              </ButtonPrimary>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};