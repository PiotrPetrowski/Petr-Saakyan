import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  MessageSquare, 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  CheckCheck,
  Paperclip,
  Smile
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ChatModal: React.FC = () => {
  const { 
    isChatOpen, 
    setIsChatOpen, 
    threads, 
    messages, 
    activeThreadId, 
    setActiveThreadId, 
    sendMessage, 
    user,
    setSelectedProperty,
    properties 
  } = useApp();

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];
  const activeMessages = (activeThread && messages[activeThread.id]) || [];

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  if (!isChatOpen) return null;

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeThread) return;

    sendMessage(activeThread.id, inputText.trim());
    setInputText('');
  };

  const quickTemplates = [
    'Здравствуйте! Жилье свободно на ближайшие дни?',
    'Возможен ли поздний заезд после 22:00?',
    'Предоставляются ли отчетные документы для командировки?',
    'Подскажите, есть ли стабильный Wi-Fi для работы?'
  ];

  const handleQuickTemplate = (text: string) => {
    if (!activeThread) return;
    sendMessage(activeThread.id, text);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      <div className="bg-white w-full max-w-4xl h-[85vh] rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-600/20">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Чат платформы</h3>
              <p className="text-xs text-slate-500">Мгновенные сообщения между арендатором и владельцем</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Безопасная переписка</span>
            </div>
            <button
              id="btn-close-chat"
              onClick={() => setIsChatOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2-Column Chat Layout */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Column: Threads list */}
          <div className="w-72 sm:w-80 border-r border-slate-100 flex flex-col bg-slate-50/50">
            <div className="p-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Диалоги ({threads.length})
              </span>
            </div>

            <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
              {threads.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">Нет активных диалогов</div>
              ) : (
                threads.map(thread => {
                  const isSelected = activeThread?.id === thread.id;
                  return (
                    <button
                      key={thread.id}
                      onClick={() => setActiveThreadId(thread.id)}
                      className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                        isSelected ? 'bg-white border-l-4 border-rose-600 shadow-xs' : 'hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={thread.landlordAvatar}
                          alt={thread.landlordName}
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-slate-900 truncate">{thread.landlordName}</h5>
                          <span className="text-[10px] text-slate-400 shrink-0">{thread.lastMessageTime}</span>
                        </div>
                        <p className="text-[11px] text-rose-600 font-medium truncate mt-0.5">{thread.propertyTitle}</p>
                        <p className="text-xs text-slate-500 truncate mt-1">{thread.lastMessage}</p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Active Conversation */}
          {activeThread ? (
            <div className="flex-1 flex flex-col bg-white overflow-hidden">
              
              {/* Active Conversation Header with Property Preview */}
              <div className="p-3.5 px-6 border-b border-slate-100 bg-white flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={activeThread.propertyImage}
                    alt=""
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{activeThread.propertyTitle}</h4>
                    <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>{activeThread.landlordName} • онлайн</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const prop = properties.find(p => p.id === activeThread.propertyId);
                    if (prop) setSelectedProperty(prop);
                  }}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 underline shrink-0 cursor-pointer"
                >
                  Карточка жилья
                </button>
              </div>

              {/* Messages Bubble Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-slate-50/40">
                
                {/* Security reminder banner */}
                <div className="max-w-md mx-auto p-2.5 rounded-xl bg-amber-50/90 border border-amber-200/80 text-[11px] text-amber-800 text-center">
                  🔒 Ради вашей безопасности не переводите средства напрямую и не передавайте данные карт в переписке.
                </div>

                {activeMessages.map(msg => {
                  const isMe = msg.senderId === (user?.id || 'user-demo-1');
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 max-w-[80%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}
                    >
                      <img
                        src={msg.senderAvatar}
                        alt=""
                        className="w-7 h-7 rounded-full object-cover shrink-0 mt-1"
                      />
                      <div>
                        <div
                          className={`p-3 rounded-2xl text-xs leading-relaxed ${
                            isMe
                              ? 'bg-rose-600 text-white rounded-tr-none shadow-xs'
                              : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-xs'
                          }`}
                        >
                          <p>{msg.text}</p>
                        </div>
                        <div className={`flex items-center gap-1 mt-1 text-[10px] text-slate-400 ${isMe ? 'justify-end' : ''}`}>
                          <span>{msg.timestamp}</span>
                          {isMe && <CheckCheck className="w-3 h-3 text-rose-500" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Template Chips */}
              <div className="px-4 py-2 border-t border-slate-100 bg-white flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0">Быстрый вопрос:</span>
                {quickTemplates.map((t, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickTemplate(t)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 whitespace-nowrap transition-colors border border-slate-200 cursor-pointer"
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Message Input Bar */}
              <form onSubmit={handleSend} className="p-3.5 px-4 border-t border-slate-200 bg-white flex items-center gap-2">
                <input
                  id="chat-input-text"
                  type="text"
                  placeholder="Напишите сообщение владельцу жилья..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-100/90 rounded-2xl text-xs text-slate-900 border border-slate-200 outline-hidden focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                />
                <button
                  id="btn-send-message"
                  type="submit"
                  className="w-10 h-10 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-md shadow-rose-600/25 transition-transform active:scale-95 cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400 text-xs">
              Выберите диалог для просмотра сообщений
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
