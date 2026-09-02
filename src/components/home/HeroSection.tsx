import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Wheat,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  Award,
  CheckCircle2,
  ChefHat,
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { navigateTo } = useStore();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F3EADB] via-[#FAF7F2] to-[#FAF7F2] pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-[#E6DEC9]">
      {/* Decorative background glow accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#E8D4B0]/40 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#C2D0A2]/20 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Freshness Trust Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBDCC5] border border-[#D5C2A5] text-[#52320E] text-xs font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse"></span>
              <span>Prepared Freshly • Quality Grains • Made on Order</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-extrabold text-[#2C241D] tracking-tight leading-[1.15]">
              Freshly Prepared Flour,{' '}
              <span className="text-[#9A5C1B] italic font-serif">Delivered</span> to Your Door.
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-[#635242] leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              Premium wheat, traditional millets (Ragi, Bajra, Jowar), barley and handcrafted multigrain flours. Milled only after you order from carefully selected natural grains.
            </p>

            {/* Value Checkpoints */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 max-w-xl mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#423425]">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" />
                <span>Zero Stale Warehouse Stock</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#423425]">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" />
                <span>100% Whole Grains & Millets</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#423425]">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" />
                <span>No Bleach or Preservatives</span>
              </div>
            </div>

            {/* Primary & Secondary Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={() => navigateTo('shop')}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-[#3B2A1A] hover:bg-[#281C10] text-[#FAF7F2] font-bold text-sm sm:text-base transition-all duration-300 shadow-xl shadow-[#3B2A1A]/15 hover:shadow-2xl flex items-center justify-center gap-2.5 active:scale-98"
              >
                <span>Shop Fresh Flours</span>
                <ArrowRight className="w-4 h-4 text-[#E2B167]" />
              </button>

              <button
                onClick={() => navigateTo('why-shivaay')}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-[#FAF6EE] text-[#3B2A1A] border border-[#DDD3C2] hover:border-[#9A5C1B] font-bold text-sm sm:text-base transition-all duration-300 shadow-sm flex items-center justify-center gap-2"
              >
                <span>Explore Our Flours</span>
                <Wheat className="w-4 h-4 text-[#9A5C1B]" />
              </button>
            </div>

            {/* Customer Rating Proof */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-4 text-xs text-[#7A6A58]">
              <div className="flex -space-x-2">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="Customer"
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="Customer"
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="Customer"
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                />
              </div>
              <div>
                <p className="font-bold text-[#2C241D]">4.9 / 5.0 Average Rating</p>
                <p className="text-[11px] text-[#8C7B6B]">From 200+ happy households enjoying fresh rotis</p>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Cards */}
          <div className="lg:col-span-5 relative">
            {/* Main Featured Image Container */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-[#FAF7F2] aspect-4/3 sm:aspect-5/4">
              <img
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=85"
                alt="Fresh Stone Ground Whole Grain Flour and Millets"
                className="w-full h-full object-cover"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#241B12]/80 via-transparent to-transparent"></div>

              {/* Overlaid Bottom Tag */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-xs font-semibold text-[#E2B167] uppercase tracking-wider">
                  Signature 7-Grain Blend
                </p>
                <p className="font-serif text-lg font-bold">
                  Sharbati Wheat • Ragi • Bajra • Jowar • Barley • Chana
                </p>
              </div>
            </div>

            {/* Floating Badge 1: Fresh Milling Cycle */}
            <div className="absolute -top-4 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-[#E6DEC9] flex items-center gap-3 animate-in fade-in zoom-in-95">
              <div className="w-10 h-10 rounded-xl bg-[#FAF0DC] flex items-center justify-center text-[#9A5C1B]">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold text-[#8C7B6B] uppercase tracking-wider">Milling Policy</p>
                <p className="text-xs font-bold text-[#2C241D]">100% Prepared on Order</p>
              </div>
            </div>

            {/* Floating Badge 2: Traditional Goodness */}
            <div className="absolute -bottom-5 -right-3 sm:-right-5 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-[#E6DEC9] flex items-center gap-3 animate-in fade-in zoom-in-95">
              <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold text-[#8C7B6B] uppercase tracking-wider">Natural Purity</p>
                <p className="text-xs font-bold text-[#2C241D]">Zero Artificial Additives</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
