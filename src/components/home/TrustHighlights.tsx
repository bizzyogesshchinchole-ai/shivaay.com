import React from 'react';
import { Clock, Wheat, ShieldCheck, Truck, Sparkles, Heart } from 'lucide-react';

export const TrustHighlights: React.FC = () => {
  const highlights = [
    {
      icon: <Clock className="w-6 h-6 text-[#9A5C1B]" />,
      title: 'Prepared Fresh on Order',
      description: 'Your flour is ground only after order confirmation. Never stored in long warehouse batches.',
      tag: 'Freshness First',
    },
    {
      icon: <Wheat className="w-6 h-6 text-[#9A5C1B]" />,
      title: 'Carefully Selected Grains',
      description: 'High-grade whole wheat, traditional Indian millets, and unpolished pulses sorted for purity.',
      tag: '100% Whole Grain',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#9A5C1B]" />,
      title: '0% Bleach or Preservatives',
      description: 'Pure, authentic grain flour retaining its natural dietary fiber, wheat germ, and vital minerals.',
      tag: 'Unadulterated',
    },
    {
      icon: <Truck className="w-6 h-6 text-[#9A5C1B]" />,
      title: 'Hygienic Doorstep Delivery',
      description: 'Packed securely in food-grade multi-layer pouches to seal in aroma and deliver to your doorstep.',
      tag: 'Direct to Kitchen',
    },
  ];

  return (
    <section className="py-12 bg-white border-b border-[#E6DEC9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#EBE3D3] hover:border-[#D49E48]/60 transition-all duration-300 hover:shadow-md group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-xs border border-[#E6DEC9] group-hover:scale-105 transition-transform">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-bold text-[#8C7B6B] bg-[#EFE6D5] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {item.tag}
                  </span>
                </div>
                <h3 className="font-serif text-base font-bold text-[#2C241D] mb-1.5 group-hover:text-[#9A5C1B] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-[#6B5A49] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
