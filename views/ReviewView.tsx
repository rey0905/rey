import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Stock, ReviewType } from '../types';
import { Card, ButtonSecondary, ButtonPrimary, Textarea, Badge, Input } from '../components/UI';
import { RefreshCw, TrendingUp, CheckCircle, AlertTriangle, Trash2, Plus, X } from 'lucide-react';

const ReviewCard: React.FC<{ stock: Stock }> = ({ stock }) => {
  const { updateStock, deleteStock } = useAppStore();
  
  const handleReviewSave = (type: ReviewType, reason: string, soldPrice: string, currentPrice: string) => {
    updateStock(stock.id, {
      reviewType: type,
      reviewReason: reason,
      soldPrice,
      currentPrice
    });
  };

  const isReviewed = stock.reviewType !== 'none';
  const [localReview, setLocalReview] = useState({
    reason: stock.reviewReason || '',
    soldPrice: stock.soldPrice || '',
    currentPrice: stock.currentPrice || ''
  });

  return (
    <Card className={`relative border-l-8 ${stock.reviewType === 'sell_early' ? 'border-l-yellow-400' : (stock.reviewType === 'correct_sell' ? 'border-l-green-500' : 'border-l-gray-300')}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{stock.name}</h3>
          <p className="text-gray-500 text-lg">{stock.code} · {stock.sector}</p>
        </div>
        <div className="flex items-center gap-2">
            {isReviewed ? (
            <Badge color={stock.reviewType === 'sell_early' ? 'red' : 'green'}>
                {stock.reviewType === 'sell_early' ? '卖飞了' : '没卖飞'}
            </Badge>
            ) : (
            <Badge color="gray">待复盘</Badge>
            )}
            <button 
                onClick={() => deleteStock(stock.id)}
                className="ml-2 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                title="删除记录"
            >
                <Trash2 size={24} />
            </button>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
        <div className="grid grid-cols-2 gap-6 mb-4">
          <Input 
            label="卖出价格" 
            placeholder="0.00" 
            value={localReview.soldPrice}
            onChange={e => {
              setLocalReview({...localReview, soldPrice: e.target.value});
            }}
          />
          <Input 
            label="现价对比" 
            placeholder="0.00" 
            value={localReview.currentPrice}
            onChange={e => setLocalReview({...localReview, currentPrice: e.target.value})}
          />
        </div>
        
        <Textarea 
          label="📝 当时卖出的理由 (复盘核心)"
          className="bg-white"
          value={localReview.reason}
          onChange={e => setLocalReview({...localReview, reason: e.target.value})}
          placeholder="当时为什么决定卖出？是止盈还是恐慌？"
        />

        <div className="flex gap-4 mt-6">
          <button
            onClick={() => handleReviewSave('sell_early', localReview.reason, localReview.soldPrice, localReview.currentPrice)}
            className={`flex-1 h-[50px] flex items-center justify-center gap-2 rounded-lg text-lg font-bold transition-all ${
              stock.reviewType === 'sell_early' ? 'bg-yellow-100 text-yellow-800 ring-2 ring-yellow-400' : 'bg-white border-2 border-yellow-400 text-yellow-700 hover:bg-yellow-50'
            }`}
          >
            <TrendingUp /> 卖飞了 (涨了)
          </button>
          <button
            onClick={() => handleReviewSave('correct_sell', localReview.reason, localReview.soldPrice, localReview.currentPrice)}
            className={`flex-1 h-[50px] flex items-center justify-center gap-2 rounded-lg text-lg font-bold transition-all ${
              stock.reviewType === 'correct_sell' ? 'bg-green-100 text-green-800 ring-2 ring-green-500' : 'bg-white border-2 border-brand-green text-brand-green hover:bg-green-50'
            }`}
          >
            <CheckCircle /> 没卖飞 (跌了)
          </button>
        </div>
      </div>
    </Card>
  );
};

export const ReviewView: React.FC = () => {
  const { stocks, addStock } = useAppStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newReview, setNewReview] = useState<{
    name: string;
    code: string;
    sector: string;
    reason: string;
    soldPrice: string;
    currentPrice: string;
    type: ReviewType;
  }>({ 
    name: '', 
    code: '', 
    sector: '', 
    reason: '', 
    soldPrice: '', 
    currentPrice: '',
    type: 'correct_sell' 
  });

  // Show stocks that are explicitly reviewed OR are in watching status (potential candidates for review)
  const reviewItems = stocks.filter(s => s.reviewType !== 'none');

  const handleAddReview = () => {
      if (!newReview.name) return;
      addStock({
          name: newReview.name,
          code: newReview.code,
          sector: newReview.sector || '未分类',
          buyLogic: '直接添加的复盘记录',
          sellLogic: '',
          isPotential: false,
          status: 'watching',
          reviewType: newReview.type, // Use the selected type
          reviewReason: newReview.reason,
          soldPrice: newReview.soldPrice,
          currentPrice: newReview.currentPrice
      });
      setShowAdd(false);
      setNewReview({ name: '', code: '', sector: '', reason: '', soldPrice: '', currentPrice: '', type: 'correct_sell' });
  };

  return (
    <div className="pb-20">
      <div className="flex flex-col items-center mb-10 text-center">
        <h1 className="text-4xl font-bold text-brand-dark flex items-center justify-center gap-3 mb-3">
          <RefreshCw size={36} /> 复盘
        </h1>
        <p className="text-gray-500 text-xl mb-6">总结经验，下次操作更从容</p>
        <ButtonPrimary 
          onClick={() => setShowAdd(true)}
          className="w-full md:w-auto px-12 min-w-[280px] shadow-xl hover:scale-105 transition-transform"
        >
            <Plus size={28} /> 记一笔复盘
        </ButtonPrimary>
      </div>

      <div className="space-y-8">
        {reviewItems.length > 0 ? (
          reviewItems.map(stock => (
            <ReviewCard key={stock.id} stock={stock} />
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-2xl text-gray-400 mb-6">暂无复盘记录</p>
          </div>
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-brand-dark">添加交易复盘</h2>
              <button onClick={() => setShowAdd(false)}><X size={40} className="text-gray-400" /></button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                 <Input 
                  label="股票名称 (必填)" 
                  value={newReview.name}
                  onChange={e => setNewReview({...newReview, name: e.target.value})}
                  autoFocus
                />
                <Input 
                  label="股票代码" 
                  value={newReview.code}
                  onChange={e => setNewReview({...newReview, code: e.target.value})}
                />
              </div>
               <Input 
                  label="所属行业/赛道" 
                  value={newReview.sector}
                  onChange={e => setNewReview({...newReview, sector: e.target.value})}
                />
              
              <div className="grid grid-cols-2 gap-6">
                <Input 
                  label="卖出价格" 
                  placeholder="0.00"
                  value={newReview.soldPrice}
                  onChange={e => setNewReview({...newReview, soldPrice: e.target.value})}
                />
                <Input 
                  label="当前价格 (用于对比)" 
                  placeholder="0.00"
                  value={newReview.currentPrice}
                  onChange={e => setNewReview({...newReview, currentPrice: e.target.value})}
                />
              </div>

              {/* Review Type Selector */}
              <div className="flex flex-col gap-2">
                <label className="text-gray-600 text-lg font-semibold">是否卖飞?</label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setNewReview({...newReview, type: 'sell_early'})}
                    className={`flex-1 h-[56px] rounded-lg text-lg font-bold border-2 transition-all flex items-center justify-center gap-2 ${
                      newReview.type === 'sell_early' 
                        ? 'bg-yellow-100 border-yellow-400 text-yellow-800' 
                        : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    <TrendingUp size={24} /> 卖飞了 (涨了)
                  </button>
                  <button
                    onClick={() => setNewReview({...newReview, type: 'correct_sell'})}
                    className={`flex-1 h-[56px] rounded-lg text-lg font-bold border-2 transition-all flex items-center justify-center gap-2 ${
                      newReview.type === 'correct_sell' 
                        ? 'bg-green-100 border-green-500 text-green-800' 
                        : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    <CheckCircle size={24} /> 没卖飞 (跌了)
                  </button>
                </div>
              </div>

              <Textarea 
                label="当时卖出的理由" 
                placeholder="记录当时的心态和逻辑..."
                value={newReview.reason}
                onChange={e => setNewReview({...newReview, reason: e.target.value})}
              />

              <div className="pt-4 flex gap-4">
                <ButtonPrimary onClick={handleAddReview} className="flex-1 w-full">
                  保存记录
                </ButtonPrimary>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};