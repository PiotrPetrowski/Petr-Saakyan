import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Lock, 
  CheckCircle, 
  QrCode, 
  Smartphone, 
  Building2, 
  AlertCircle,
  FileText,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SafePaymentModal: React.FC = () => {
  const { 
    isPaymentModalOpen, 
    setIsPaymentModalOpen, 
    bookingProperty, 
    bookingDraft, 
    createBooking, 
    setIsProfileOpen, 
    setProfileTab,
    setSelectedProperty,
    showToast 
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'sbp' | 'tpay'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('981');
  const [cardHolder, setCardHolder] = useState('ALEXEY SMIRNOV');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  if (!isPaymentModalOpen || !bookingProperty || !bookingDraft) return null;

  const handleCardNumberChange = (val: string) => {
    // Keep clean format
    const cleaned = val.replace(/\D/g, '').slice(0, 16);
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const booking = createBooking({
        checkIn: bookingDraft.checkIn,
        checkOut: bookingDraft.checkOut,
        rentMode: bookingDraft.rentMode,
        durationCount: bookingDraft.durationCount,
        guestsCount: bookingDraft.guestsCount,
        totalPrice: bookingDraft.grandTotal,
        deposit: bookingDraft.deposit,
        paymentMethod: paymentMethod === 'card' ? 'Банковская карта МИР' : paymentMethod === 'sbp' ? 'СБП (QR-код)' : 'T-Pay',
        last4: cardNumber.replace(/\s+/g, '').slice(-4) || '4242'
      });
      setConfirmedBooking(booking);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Безопасная оплата бронирования</h3>
              <p className="text-xs text-slate-500">Эскроу-защита 100% средств до успешного заселения</p>
            </div>
          </div>
          
          {!confirmedBooking && (
            <button
              onClick={() => setIsPaymentModalOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6">

          {confirmedBooking ? (
            /* Success State & Digital Receipt */
            <div className="text-center py-4 space-y-5 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center ring-8 ring-emerald-50">
                <CheckCircle className="w-9 h-9" />
              </div>

              <div>
                <h4 className="text-xl font-extrabold text-slate-900">Бронирование успешно оплачено!</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Средства безопасно зарезервированы в эскроу-сервисе платформы. Хозяин получил уведомление и ждет вас!
                </p>
              </div>

              {/* Digital receipt card */}
              <div className="max-w-md mx-auto bg-slate-50 rounded-2xl border border-slate-200 p-5 text-left text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span className="font-bold text-slate-900">Электронная квитанция</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded-full">
                    ОПЛАЧЕНО
                  </span>
                </div>

                <div className="space-y-1.5 text-slate-600">
                  <div className="flex justify-between">
                    <span>Номер брони:</span>
                    <strong className="text-slate-900">{confirmedBooking.id}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Объект:</span>
                    <strong className="text-slate-900 truncate max-w-[180px]">{bookingProperty.title}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Даты:</span>
                    <strong className="text-slate-900">{confirmedBooking.checkIn} — {confirmedBooking.checkOut}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Способ оплаты:</span>
                    <strong className="text-slate-900">{confirmedBooking.paymentMethod} (*{confirmedBooking.last4})</strong>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2 text-sm">
                    <span className="font-bold text-slate-900">Сумма в эскроу:</span>
                    <span className="font-black text-slate-900">{confirmedBooking.totalPrice.toLocaleString()} ₽</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2 max-w-md mx-auto">
                <button
                  id="btn-view-bookings-after-pay"
                  onClick={() => {
                    setIsPaymentModalOpen(false);
                    setSelectedProperty(null);
                    setProfileTab('tenant_bookings');
                    setIsProfileOpen(true);
                  }}
                  className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Мои бронирования
                </button>
                <button
                  id="btn-close-pay-modal"
                  onClick={() => {
                    setIsPaymentModalOpen(false);
                  }}
                  className="flex-1 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Вернуться к карте
                </button>
              </div>

            </div>
          ) : (
            /* Checkout Form & Escrow Overview */
            <div className="space-y-6">
              
              {/* Property & Stay Summary Banner */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex gap-3.5">
                <img
                  src={bookingProperty.images[0]}
                  alt=""
                  className="w-20 h-20 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 space-y-1">
                  <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">
                    {bookingDraft.rentMode === 'daily' ? 'Посуточная аренда' : 'Помесячная аренда'}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{bookingProperty.title}</h4>
                  <p className="text-[11px] text-slate-500">{bookingProperty.city}, {bookingProperty.address}</p>
                  <p className="text-xs font-semibold text-slate-700 pt-0.5">
                    Даты: {bookingDraft.checkIn} — {bookingDraft.checkOut} ({bookingDraft.durationCount} {bookingDraft.rentMode === 'daily' ? 'сут.' : 'мес.'}, {bookingDraft.guestsCount} гостя)
                  </p>
                </div>
              </div>

              {/* Escrow Guarantee Highlight */}
              <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-xs text-emerald-900 space-y-1.5">
                <div className="flex items-center gap-2 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Гарантия безопасности «АрендаЖилья Защита»</span>
                </div>
                <p className="text-[11px] leading-relaxed text-emerald-800">
                  Владелец получит оплату только через 24 часа после вашего заселения. Если при заезде возникнут несоответствия или проблемы с ключами — деньги будут мгновенно возвращены.
                </p>
              </div>

              {/* Payment Methods Tabs */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Выберите способ оплаты
                </label>

                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-emerald-600 bg-emerald-50/40 text-slate-900 font-bold shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <CreditCard className={`w-5 h-5 mx-auto mb-1 ${paymentMethod === 'card' ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span className="text-xs block">Карта МИР / Visa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('sbp')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'sbp'
                        ? 'border-emerald-600 bg-emerald-50/40 text-slate-900 font-bold shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <QrCode className={`w-5 h-5 mx-auto mb-1 ${paymentMethod === 'sbp' ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span className="text-xs block">СБП (QR-код)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('tpay')}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'tpay'
                        ? 'border-emerald-600 bg-emerald-50/40 text-slate-900 font-bold shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Smartphone className={`w-5 h-5 mx-auto mb-1 ${paymentMethod === 'tpay' ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span className="text-xs block">T-Pay / SberPay</span>
                  </button>
                </div>
              </div>

              {/* Form details */}
              <form onSubmit={handleProcessPayment} className="space-y-4">
                {paymentMethod === 'card' && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-slate-700">Номер карты</label>
                        <span className="text-[10px] font-bold text-slate-400">МИР / VISA / MASTERCARD</span>
                      </div>
                      <div className="flex items-center bg-white rounded-xl border border-slate-200 px-3 py-2">
                        <CreditCard className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                        <input
                          id="payment-card-number"
                          type="text"
                          value={cardNumber}
                          onChange={(e) => handleCardNumberChange(e.target.value)}
                          placeholder="2200 0000 0000 0000"
                          className="w-full bg-transparent text-xs font-mono font-bold text-slate-900 outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Срок действия</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full bg-white rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono font-bold text-slate-900 outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">CVC / CVV</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          className="w-full bg-white rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono font-bold text-slate-900 outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Имя на карте</label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                        className="w-full bg-white rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono font-bold text-slate-900 uppercase outline-hidden"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'sbp' && (
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
                    <div className="w-36 h-36 mx-auto bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center">
                      <QrCode className="w-28 h-28 text-slate-800" />
                    </div>
                    <p className="text-xs text-slate-600 font-medium">
                      Отсканируйте QR-код в приложении любого банка или нажмите кнопку оплаты
                    </p>
                  </div>
                )}

                {paymentMethod === 'tpay' && (
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                    <Smartphone className="w-8 h-8 text-slate-700 mx-auto" />
                    <p className="text-xs text-slate-700 font-bold">Оплата в 1 клик через приложение банка</p>
                    <p className="text-[11px] text-slate-500">Авторизация через защищенный шлюз Банка</p>
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Аренда жилья ({bookingDraft.durationCount} {bookingDraft.rentMode === 'daily' ? 'сут.' : 'мес.'}):</span>
                    <span className="font-semibold text-slate-900">{bookingDraft.rentTotal.toLocaleString()} ₽</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Возвратный залог:</span>
                    <span className="font-semibold text-slate-900">{bookingDraft.deposit.toLocaleString()} ₽</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Эскроу-сервис платформы:</span>
                    <span className="font-bold text-emerald-600">0 ₽ (Бесплатно)</span>
                  </div>
                  <div className="border-t border-slate-200 pt-2 flex justify-between items-baseline">
                    <span className="text-sm font-bold text-slate-900">Итого к заморозке:</span>
                    <span className="text-xl font-black text-slate-900">{bookingDraft.grandTotal.toLocaleString()} ₽</span>
                  </div>
                </div>

                {/* Payment Submit Button */}
                <button
                  id="btn-confirm-payment-escrow"
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-70"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {isProcessing ? 'Проведение безопасного платежа...' : `Оплатить ${bookingDraft.grandTotal.toLocaleString()} ₽ безопасно`}
                  </span>
                </button>
              </form>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
