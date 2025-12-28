import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store';
import { Stock } from '../types';
import { Card, Input, ButtonPrimary, ButtonSecondary, Badge } from '../components/UI';
import { Calendar, Tag, Briefcase, Plus, X, CheckSquare, Square } from 'lucide-react';

const HoldingCard: React.FC<{ stock: Stock }> = ({ stock }) => {
  const { updateStock } = useAppStore();

  const handleUpdate = (field: keyof Stock, value: string) => {
    updateStock(stock.id, { [field]: value });
  };

  return (
    <Card className="border-t-4 border-t-brand-red">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-3xl font-bold text-brand-dark mb-1">{stock.name}</h3>
          <span className="text-xl text-gray-500 font-mono">{stock.code}</span>
        </div>
        <div className="flex flex-col items-end gap-2">
            <Badge color="red">持仓中</Badge>
            {!stock.isPotential ? (
                <span className="text-sm text-brand-dark bg-blue-100 px-2 py-1 rounded">主线</span>
            ) : (
                <span className="text-sm text-yellow-700 bg-yellow-100 px-2 py-1 rounded">潜力</span>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
        <div className="flex flex-col gap-2">
          <label className="text-gray-600 font-semibold text-lg">买入价格 (元)</label>
          <input 
            type="number" 
            className="text-3xl font-bold text-brand-dark bg-transparent border-b-2 border-gray-300 focus:border-brand-dark outline-none py-2 w-full"
            value={stock.buyPrice || ''}
            placeholder="0.00"
            onChange={(e) => handleUpdate('buyPrice', e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-gray-600 font-semibold text-lg">持有数量 (股)</label>
          <input 
            type="number" 
            className="text-3xl font-bold text-brand-dark bg-transparent border-b-2 border-gray-300 focus:border-brand-dark outline-none py-2 w-full"
            value={stock.quantity || ''}
            placeholder="0"
            onChange={(e) => handleUpdate('quantity', e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 relative">
          <label className="text-gray-600 font-semibold text-lg flex items-center gap-2">
            <Calendar size={20} /> 买入时间
          </label>
          <input 
            type="date" 
            className="text-2xl font-bold text-brand-dark bg-transparent border-b-2 border-gray-300 focus:border-brand-dark outline-none py-2 w-full h-[52px]"
            value={stock.buyDate || ''}
            onChange={(e) => handleUpdate('buyDate', e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Tag size={20} className="text-gray-400" />
        <span className="text-xl text-gray-700 font-medium">所属赛道：{stock.sector}</span>
      </div>
    </Card>
  );
};

export const PortfolioView: React.FC = () => {
  const { stocks, addStock } = useAppStore();
  const [activeSector, setActiveSector] = useState<string>('all');
  const [showAdd, setShowAdd] = useState(false);
  
  // Add Stock Form State
  const [newStock, setNewStock] = useState({
    name: '',
    code: '',
    sector: '',
    buyPrice: '',
    quantity: '',
    buyDate: new Date().toISOString().split('T')[0],
    addToMainline: true
  });

  // Filter only holding stocks
  const holdings = useMemo(() => stocks.filter(s => s.status === 'holding'), [stocks]);
  
  // Get unique sectors from holdings
  const sectors = useMemo(() => {
    const s = Array.from(new Set(holdings.map(h => h.sector))).sort();
    return ['all', ...s];
  }, [holdings]);

  const displayedHoldings = activeSector === 'all' 
    ? holdings 
    : holdings.filter(h => h.sector === activeSector);

  const handleAddSubmit = () => {
    if (!newStock.name) return;
    
    addStock({
      name: newStock.name,
      code: newStock.code,
      sector: newStock.sector || '未分类',
      buyLogic: '从持仓直接添加',
      sellLogic: '',
      isPotential: !newStock.addToMainline, // If addToMainline is true, isPotential is false (Mainline)
      status: 'holding',
      buyPrice: newStock.buyPrice,
      quantity: newStock.quantity,
      buyDate: newStock.buyDate,
      reviewType: 'none'
    });
    
    setShowAdd(false);
    setNewStock({
      name: '',
      code: '',
      sector: '',
      buyPrice: '',
      quantity: '',
      buyDate: new Date().toISOString().split('T')[0],
      addToMainline: true
    });
  };

  return (
    <div className="pb-20">
      <div className="flex flex-col items-center mb-10 text-center">
        <h1 className="text-4xl font-bold text-brand-dark flex items-center justify-center gap-3 mb-3">
          <Briefcase size={36} /> 现持有股管理
        </h1>
        <p className="text-gray-500 text-xl mb-6">清晰记录成本，心中有数</p>
        <ButtonPrimary 
          onClick={() => setShowAdd(true)} 
          className="w-full md:w-auto px-12 min-w-[280px] shadow-xl hover:scale-105 transition-transform"
        >
          <Plus size={28} /> 添加现有持仓
        </ButtonPrimary>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center mb-8">
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar max-w-full px-4">
          {sectors.map(sector => (
            <button
              key={sector}
              onClick={() => setActiveSector(sector)}
              className={`px-6 py-3 rounded-full text-xl font-bold whitespace-nowrap transition-all ${
                activeSector === sector 
                  ? 'bg-brand-dark text-white shadow-lg scale-105' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {sector === 'all' ? '全部持仓' : sector}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {displayedHoldings.length > 0 ? (
          displayedHoldings.map(stock => (
            <HoldingCard key={stock.id} stock={stock} />
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-2xl text-gray-400">当前{activeSector !== 'all' ? '该行业' : ''}没有持仓股票</p>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-brand-dark">添加现有持仓</h2>
              <button onClick={() => setShowAdd(false)}><X size={40} className="text-gray-400" /></button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                 <Input 
                  label="股票名称 (必填)" 
                  value={newStock.name}
                  onChange={e => setNewStock({...newStock, name: e.target.value})}
                  autoFocus
                />
                <Input 
                  label="股票代码" 
                  value={newStock.code}
                  onChange={e => setNewStock({...newStock, code: e.target.value})}
                />
              </div>

               <Input 
                  label="所属行业/赛道" 
                  value={newStock.sector}
                  placeholder="如：高股息、科技 (用于归类)"
                  onChange={e => setNewStock({...newStock, sector: e.target.value})}
                />

                <div className="grid grid-cols-2 gap-6">
                    <Input 
                    type="number"
                    label="买入均价" 
                    value={newStock.buyPrice}
                    onChange={e => setNewStock({...newStock, buyPrice: e.target.value})}
                    />
                    <Input 
                    type="number"
                    label="持有数量" 
                    value={newStock.quantity}
                    onChange={e => setNewStock({...newStock, quantity: e.target.value})}
                    />
                </div>
                
                 <div className="flex flex-col gap-2">
                    <label className="text-gray-600 text-lg font-semibold">买入日期</label>
                    <input
                        type="date"
                        className="h-[56px] text-xl px-4 border-2 border-gray-300 rounded-lg focus:border-brand-dark outline-none w-full"
                        value={newStock.buyDate}
                        onChange={e => setNewStock({...newStock, buyDate: e.target.value})}
                    />
                </div>

                <div 
                    className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100 cursor-pointer"
                    onClick={() => setNewStock({...newStock, addToMainline: !newStock.addToMainline})}
                >
                    <div className={`w-8 h-8 flex items-center justify-center rounded border-2 ${newStock.addToMainline ? 'bg-brand-dark border-brand-dark text-white' : 'bg-white border-gray-400'}`}>
                        {newStock.addToMainline && <CheckSquare size={24} />}
                    </div>
                    <div>
                        <p className="text-lg font-bold text-brand-dark">加入「主线赛道」视图</p>
                        <p className="text-gray-500">勾选后，该股票也会显示在主线赛道列表中</p>
                    </div>
                </div>

              <div className="pt-4 flex gap-4">
                <ButtonPrimary onClick={handleAddSubmit} className="flex-1 w-full">
                  确认添加
                </ButtonPrimary>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};