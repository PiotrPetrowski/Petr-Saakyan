import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Sparkles, 
  CheckCircle,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ReviewModal: React.FC = () => {
  const { 
    isReviewModalOpen, 
    setIsReviewModalOpen, 
    reviewingProperty, 
    addReview,
    user,
    setIsAuthModalOpen 
  } = useApp();

  const [rating, setRating] = useState<number>(5);
  const [cleanliness, setCleanliness] = useState<number>(5);
  const [location, setLocation] = useState<number>(5);
  const [value, setValue] = useState<number>(5);
  const [communication, setCommunication] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  if (!isReviewModalOpen || !reviewingProperty) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    if (!comment.trim()) {
      setError('Пожалуйста, напишите пару слов о вашем проживании');
      return;
    }

    addReview({
      propertyId: reviewingProperty.id,
      rating,
      comment: comment.trim(),
      cleanliness,
      location,
      value,
      communication
    });

    setIsReviewModalOpen(false);
    setComment('');
    setError('');
  };

  const renderStars = (currentVal: number, setter: (v: number) => void) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setter(star)}
          className="p-1 hover:scale-110 transition-transform cursor-pointer"
        >
          <Star
            className={`w-5 h-5 ${
              star <= currentVal
                ? 'fill-amber-400 text-amber-400'
                : 'text-slate-300 hover:text-amber-200'
            }`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Оставить отзыв о жилье</h3>
            <p className="text-xs text-slate-500 line-clamp-1">{reviewingProperty.title}</p>
          </div>
          <button
            onClick={() => setIsReviewModalOpen(false)}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs">
              {error}
            </div>
          )}

          {/* Main Rating */}
          <div className="text-center p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Общая оценка проживания
            </span>
            <div className="flex justify-center">
              {renderStars(rating, setRating)}
            </div>
            <span className="text-xs font-bold text-amber-700 block">{rating} из 5 звезд</span>
          </div>

          {/* Detailed Criteria Ratings */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Чистота и порядок</span>
              {renderStars(cleanliness, setCleanliness)}
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Расположение и район</span>
              {renderStars(location, setLocation)}
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Цена / качество</span>
              {renderStars(value, setValue)}
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Общение с владельцем</span>
              {renderStars(communication, setCommunication)}
            </div>
          </div>

          {/* Comment text */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Ваш отзыв и впечатления
            </label>
            <textarea
              id="review-comment-input"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Расскажите будущим гостям: насколько жилье соответствовало фото, было ли тихо ночью, как прошел заезд..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500 outline-hidden"
            ></textarea>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsReviewModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
            >
              Отмена
            </button>
            <button
              id="btn-submit-review"
              type="submit"
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/25 cursor-pointer"
            >
              Опубликовать отзыв
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
