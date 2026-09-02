import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Wheat, Clock, ShieldCheck, Heart, Sparkles, Truck, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigateTo } = useStore();

  return (
    <div className="py-10 bg-[#FAF7F2] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Hero */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-[#9A5C1B] uppercase tracking-wider">
            Our Story & Philosophy
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#2C241D]">
            Reviving the Wisdom of <span className="text-[#9A5C1B] italic">Freshly Milled</span> Grains
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5A49] leading-relaxed">
            At <strong>Shivaay Agri Products</strong>, we believe every Indian family deserves the wholesome taste, intoxicating aroma, and natural nutrition of flours ground only after you order.
          </p>
        </div>

        {/* The On-Order Commitment Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E6DEC9] shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0DC] text-[#784712] text-xs font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>Our Core Operating Model</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2C241D]">
                Why We Never Keep Pre-Ground Flour Stock
              </h2>
              <p className="text-xs sm:text-sm text-[#5C4D3C] leading-relaxed">
                Whole grains have natural oils concentrated in their germ and bran. Once ground into flour and stored on warehouse racks for 2–3 months, these delicate fatty acids start oxidizing, losing their sweet aroma and natural softness.
              </p>
              <p className="text-xs sm:text-sm text-[#5C4D3C] leading-relaxed">
                By milling each batch against your confirmed order, our flours reach your kitchen within days of grinding. The result? Naturally soft, puffed rotis and flavorful bhakris without a speck of chemical improvers or bleaching.
              </p>
            </div>

            <div className="md:col-span-5 bg-[#FAF7F2] rounded-2xl p-6 border border-[#EAE1D0] space-y-4 text-xs text-[#5C4D3C]">
              <h3 className="font-serif font-bold text-base text-[#2C241D] flex items-center gap-2">
                <Wheat className="w-5 h-5 text-[#9A5C1B]" />
                <span>The Shivaay Standard</span>
              </h3>
              <ul className="space-y-2.5">
                <li className="flex items-start gap-2">
                  <span className="text-[#2E7D32] font-bold">✓</span>
                  <span>100% Unadulterated Grains (No fillers, maida, or dust)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2E7D32] font-bold">✓</span>
                  <span>Ground at low temperatures to prevent heat degradation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2E7D32] font-bold">✓</span>
                  <span>Aroma-sealed food-grade packaging for hygienic delivery</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#2E7D32] font-bold">✓</span>
                  <span>Direct WhatsApp access to our grain milling team</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Shivaay Agri */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Wheat className="w-6 h-6 text-[#9A5C1B]" />,
              title: 'Carefully Sourced',
              desc: 'High-grade whole wheat from Sehore & heritage Emmer Khapli sorted for purity.',
            },
            {
              icon: <Sparkles className="w-6 h-6 text-[#9A5C1B]" />,
              title: 'Millets Celebrated',
              desc: 'Promoting indigenous Indian millets (Ragi, Bajra, Jowar) for balanced everyday diets.',
            },
            {
              icon: <ShieldCheck className="w-6 h-6 text-[#9A5C1B]" />,
              title: 'Zero Chemical Additives',
              desc: 'No artificial bleaches, chalk powder, or chemical preservatives—pure grain flour.',
            },
            {
              icon: <Truck className="w-6 h-6 text-[#9A5C1B]" />,
              title: 'Fresh to Doorstep',
              desc: 'Dispatched securely packed in moisture-barrier pouches straight to your doorstep.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-[#E6DEC9] shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] flex items-center justify-center mb-4 border border-[#E6DEC9]">
                  {item.icon}
                </div>
                <h3 className="font-serif text-base font-bold text-[#2C241D] mb-1.5">{item.title}</h3>
                <p className="text-xs text-[#6B5A49] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center p-8 bg-[#3B2A1A] text-white rounded-3xl space-y-4">
          <h3 className="font-serif text-2xl font-bold">Experience the Difference in Your Very Next Meal</h3>
          <p className="text-xs sm:text-sm text-[#D4C5B5] max-w-lg mx-auto">
            Order your preferred whole wheat, millet, or 7-grain flour today and taste the aroma of freshly ground grains.
          </p>
          <button
            onClick={() => navigateTo('shop')}
            className="px-8 py-3 bg-[#E2B167] hover:bg-[#D49E48] text-[#241B12] font-bold text-xs sm:text-sm rounded-xl shadow-md inline-flex items-center gap-2"
          >
            <span>Explore Fresh Flour Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
