import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { MessageCircle, X, Send, Sparkles, ChevronRight, HelpCircle, PhoneCall } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const { settings, generateWhatsAppLink } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const quickPrompts = [
    { label: '🌾 Order Fresh Flour', text: 'Hello Shivaay Agri Products, I would like to place an order for freshly milled flour.' },
    { label: '💡 Understand Millets', text: 'Hi, I need help choosing the best millet flour (Ragi, Bajra, or Jowar) for my family.' },
    { label: '📦 Custom Pack / Bulk Order', text: 'Hello, I would like to ask about special custom pack sizes or bulk flour supply.' },
    { label: '🚚 Delivery & Lead Time', text: 'Hi! Could you please let me know delivery lead time and pincode coverage?' },
  ];

  const handleSendCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customMsg.trim()) {
      window.open(generateWhatsAppLink(customMsg), '_blank');
      setCustomMsg('');
      setIsOpen(false);
    }
  };

  const handleSendQuick = (text: string) => {
    window.open(generateWhatsAppLink(text), '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Popover Window */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#E6DEC9] overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#128C7E] to-[#25D366] p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Shivaay Agri Helpdesk</h4>
                <p className="text-[11px] text-white/90">Typically replies within a few minutes</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-[#ECE5DD] space-y-3 max-h-80 overflow-y-auto">
            <div className="bg-white rounded-xl p-3 shadow-sm text-xs text-[#2C241D] leading-relaxed border-l-4 border-[#25D366]">
              <p className="font-semibold text-[#128C7E] mb-1">Namaste! 🙏</p>
              <p>
                Welcome to <strong>Shivaay Agri Products</strong>. All our flours are prepared on order from carefully selected grains. How can we help you today?
              </p>
            </div>

            {/* Quick Prompts */}
            <div className="space-y-1.5 pt-1">
              <p className="text-[11px] font-bold text-[#6D6153] uppercase tracking-wider">
                Select a topic:
              </p>
              {quickPrompts.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendQuick(item.text)}
                  className="w-full text-left p-2.5 bg-white hover:bg-[#F5F2EB] rounded-xl text-xs text-[#2C241D] font-medium border border-[#DDD3C2] transition-colors flex items-center justify-between group shadow-2xs"
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#A89886] group-hover:text-[#128C7E] transition-transform group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          </div>

          {/* Custom Message Input */}
          <form onSubmit={handleSendCustom} className="p-3 bg-white border-t border-[#E8DFC9] flex gap-2">
            <input
              type="text"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 text-xs bg-[#FAF7F2] border border-[#DDD3C2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#25D366] text-[#2C241D]"
            />
            <button
              type="submit"
              disabled={!customMsg.trim()}
              className="p-2.5 bg-[#25D366] hover:bg-[#1EBE5D] disabled:opacity-40 text-white rounded-xl transition-all shadow-sm flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 px-4 py-3 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full shadow-lg hover:shadow-xl shadow-[#25D366]/30 transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none"
        aria-label="Contact on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 text-white" />
        <span className="text-xs font-bold tracking-wide hidden sm:inline">
          Chat on WhatsApp
        </span>
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#E2B167] rounded-full border-2 border-white animate-ping"></span>
      </button>
    </div>
  );
};
