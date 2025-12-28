import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store';
import { Stock } from '../types';
import { Card, ButtonPrimary, ButtonSecondary, Input, Textarea, Badge } from '../components/UI';
import { Plus, ChevronDown, ChevronUp, Edit2, Check, X, Briefcase, Eye, Trash2 } from 'lucide-react';

const StockCard: React.FC<{ stock: Stock }> = ({ stock }) => {
  const { updateStock, deleteStock } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(stock);

  const handleSave = () => {
    updateStock(stock.id, editForm);
    setIsEditing(false);
  };

  const toggleStatus = () => {
    updateStock(stock.id, { 
      status: stock.status === 'holding' ? 'watching' : 'holding' 
    });
  };

  if (isEditing) {
    return (
      <Card className="border-brand-dark border-2 bg-blue-50/50">
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <Input 
              label="股票名称" 
              value={editForm.name} 
              onChange={e => setEditForm({...editForm, name: e.target.value})} 
            />
            <Input 
              label="代码" 
              value={editForm.code} 
              onChange={e => setEditForm({...editForm, code: e.target.value})} 
            />
          </div>
          <Textarea 
            label="买入/看好理由" 
            value={editForm.buyLogic} 
            onChange={e => setEditForm({...editForm, buyLogic: e.target.value})} 
          />
          <Textarea 
            label="抛售/撤退逻辑" 
            value={editForm.sellLogic} 
            onChange={e => setEditForm({...editForm, sellLogic: e.target.value})} 
          />
          <div className="flex gap-4 mt-2">
            <ButtonPrimary onClick={handleSave} className="flex-1 text-lg h-[50px]">
              <Check size={24} /> 保存修改
            </ButtonPrimary>
            <ButtonSecondary onClick={() => setIsEditing(false)} className="flex-1 text-lg h-[50px]">
              取消
            </ButtonSecondary>
            <ButtonSecondary onClick={() => deleteStock(stock.id)} className="text-red-600 border-red-200 hover:bg-red-50 h-[50px]">
              删除
            </ButtonSecondary>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden group hover:shadow-md transition-shadow">
      <div className={`absolute top-0 left-0 w-2 h-full ${stock.status === 'holding' ? 'bg-brand-red' : 'bg-brand-dark'}`}></div>
      
      <div className="pl-4 flex flex-col gap-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-2xl font-bold text-gray-900">{stock.name}</h3>
              <span className="text-xl text-gray-500 font-mono bg-gray-100 px-2 rounded">{stock.code}</span>
            </div>
            <div className="mt-2">
              <button 
                onClick={toggleStatus}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-lg font-bold transition-colors ${
                  stock.status === 'holding' 
                    ? 'bg-red-100 text-brand-red border border-red-200' 
                    : 'bg-blue-100 text-brand-dark border border-blue-200'
                }`}
              >
                {stock.status === 'holding' ? <Briefcase size={20} /> : <Eye size={20} />}
                {stock.status === 'holding' ? '已买入持仓' : '观察中...'}
              </button>
            </div>
          </div>
          <button onClick={() => setIsEditing(true)} className="p-2 text-gray-400 hover:text-brand-dark hover:bg-gray-100 rounded-full">
            <Edit2 size={24} />
          </button>
        </div>

        {/* Logic Sections */}
        <div className="grid md:grid-cols-2 gap-6 mt-2">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <h4 className="text-brand-red font-bold text-lg mb-2 flex items-center gap-2">
              🚀 买入/看好逻辑
            </h4>
            <p className="text-xl text-gray-800 leading-relaxed whitespace-pre-wrap">
              {stock.buyLogic || <span className="text-gray-400 italic">未记录...</span>}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <h4 className="text-brand-green font-bold text-lg mb-2 flex items-center gap-2">
              🛡️ 撤退/止损逻辑
            </h4>
            <p className="text-xl text-gray-800 leading-relaxed whitespace-pre-wrap">
              {stock.sellLogic || <span className="text-gray-400 italic">未记录...</span>}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

const SectorGroup: React.FC<{ name: string; stocks: Stock[] }> = ({ name, stocks }) => {
  const { renameSector, deleteSector } = useAppStore();
  const [isOpen, setIsOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(name);

  const handleRename = () => {
    renameSector(name, newName);
    setIsEditing(false);
  };

  return (
    <div className="mb-8">
      {isEditing ? (
        <div className="flex gap-4 mb-4 items-center bg-white p-4 rounded-xl border border-blue-200">
          <Input 
             value={newName} 
             onChange={e => setNewName(e.target.value)} 
             className="flex-1"
             autoFocus
          />
          <ButtonPrimary onClick={handleRename} className="h-[56px] w-[120px]">保存</ButtonPrimary>
          <ButtonSecondary onClick={() => setIsEditing(false)} className="h-[56px] w-[120px]">取消</ButtonSecondary>
        </div>
      ) : (
        <div className="w-full flex items-center justify-between bg-white p-5 rounded-xl shadow-sm border border-gray-200 transition-colors mb-4">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-4 flex-1 text-left"
          >
            <div className="w-2 h-8 bg-brand-dark rounded-full"></div>
            <h2 className="text-2xl font-bold text-brand-dark">{name}</h2>
            <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-lg font-bold">
              {stocks.length} 只
            </span>
            {isOpen ? <ChevronUp size={24} className="text-gray-400 ml-2" /> : <ChevronDown size={24} className="text-gray-400 ml-2" />}
          </button>
          
          <div className="flex items-center gap-2 border-l pl-4 ml-4">
            <button 
              onClick={() => setIsEditing(true)}
              className="p-3 text-gray-500 hover:text-brand-dark hover:bg-gray-100 rounded-lg"
              title="修改赛道名称"
            >
              <Edit2 size={24} />
            </button>
            <button 
              onClick={() => deleteSector(name)}
              className="p-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
              title="删除该赛道"
            >
              <Trash2 size={24} />
            </button>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="grid grid-cols-1 gap-6 pl-2">
          {stocks.map(stock => (
            <StockCard key={stock.id} stock={stock} />
          ))}
          {stocks.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-xl border-2 border-dashed border-gray-300 rounded-xl">
              该行业暂无主线股票
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const MainlineView: React.FC = () => {
  const { stocks, addStock } = useAppStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStock, setNewStock] = useState<Partial<Stock>>({ 
    status: 'watching', 
    isPotential: false 
  });

  const mainlineStocks = useMemo(() => stocks.filter(s => !s.isPotential && s.reviewType === 'none'), [stocks]);
  
  // Extract unique sectors
  const sectors = useMemo(() => {
    const s = Array.from(new Set(mainlineStocks.map(stock => stock.sector))).sort();
    return s;
  }, [mainlineStocks]);

  const handleAddSubmit = () => {
    if (!newStock.name || !newStock.sector) return;
    addStock({
      name: newStock.name!,
      code: newStock.code || '',
      sector: newStock.sector!,
      buyLogic: newStock.buyLogic || '',
      sellLogic: newStock.sellLogic || '',
      isPotential: false,
      status: 'watching',
      reviewType: 'none'
    });
    setShowAddModal(false);
    setNewStock({ status: 'watching', isPotential: false });
  };

  return (
    <div className="pb-20">
      <div className="flex flex-col items-center mb-10 text-center">
        <h1 className="text-4xl font-bold text-brand-dark mb-3">📊 主线赛道</h1>
        <p className="text-gray-500 text-xl mb-6">核心关注的确定性机会</p>
        <ButtonPrimary 
          onClick={() => setShowAddModal(true)} 
          className="w-full md:w-auto px-12 min-w-[280px] shadow-xl hover:scale-105 transition-transform"
        >
          <Plus size={28} /> 新增主线股/赛道
        </ButtonPrimary>
      </div>

      <div className="space-y-2">
        {sectors.length > 0 ? (
          sectors.map(sector => (
            <SectorGroup 
              key={sector} 
              name={sector} 
              stocks={mainlineStocks.filter(s => s.sector === sector)} 
            />
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-2xl text-gray-400 mb-6">您还没有添加任何主线股票或赛道</p>
          </div>
        )}
      </div>

      {/* Simple Modal for Adding */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-brand-dark">新增主线股票</h2>
              <button onClick={() => setShowAddModal(false)}><X size={40} className="text-gray-400" /></button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <Input 
                  label="行业/赛道 (必填)" 
                  placeholder="如：高股息、中字头" 
                  value={newStock.sector || ''}
                  onChange={e => setNewStock({...newStock, sector: e.target.value})}
                  autoFocus
                />
                 <Input 
                  label="股票名称 (必填)" 
                  placeholder="例如：贵州茅台" 
                  value={newStock.name || ''}
                  onChange={e => setNewStock({...newStock, name: e.target.value})}
                />
              </div>
              <Input 
                label="股票代码" 
                placeholder="600xxx" 
                value={newStock.code || ''}
                onChange={e => setNewStock({...newStock, code: e.target.value})}
              />
              <Textarea 
                label="买入/看好理由" 
                placeholder="为什么看好它？逻辑是什么？"
                value={newStock.buyLogic || ''}
                onChange={e => setNewStock({...newStock, buyLogic: e.target.value})}
              />
              <Textarea 
                label="抛售/撤退条件" 
                placeholder="什么情况下你会卖出？"
                value={newStock.sellLogic || ''}
                onChange={e => setNewStock({...newStock, sellLogic: e.target.value})}
              />

              <div className="pt-4 flex gap-4">
                <ButtonPrimary onClick={handleAddSubmit} className="flex-1 w-full">
                  保存到主线
                </ButtonPrimary>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};