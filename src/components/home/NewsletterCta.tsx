import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { MessageCircle, Send, Wheat, Sparkles } from 'lucide-react';

export const NewsletterCta: React.FC = () => {
  const { generateWhatsAppLink, showToast } = useStore();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      showToast('Thank you! You are now subscribed to Shivaay grain harvest updates.', 'success');
      setEmail('');
    }
  };

  return (
    <section className="py-16 bg-[#3B2A1A] text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-3 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E2B167]/20 border border-[#E2B167]/40 text-[#E2B167] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Connect With Shivaay Agri</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
              Enjoy Traditional Goodness in Everyday Meals
            </h2>
            <p className="text-xs sm:text-sm text-[#D4C5B5] max-w-xl mx-auto lg:mx-0">
              Get monthly seasonal grain harvest updates, traditional Indian millet recipes, and exclusive on-order offers.
            </p>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-xs sm:text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#E2B167]"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-[#E2B167] hover:bg-[#D49E48] text-[#241B12] text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md shrink-0 flex items-center gap-1.5"
              >
                <span>Join</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="text-center lg:text-left">
              <span className="text-xs text-[#B8A693] mr-2">Prefer WhatsApp?</span>
              <a
                href={generateWhatsAppLink('Hello Shivaay Agri Products, I want to join your WhatsApp broadcast for fresh milling schedules.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#25D366] hover:underline"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Join WhatsApp Updates →</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
