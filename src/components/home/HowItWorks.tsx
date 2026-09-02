import React from 'react';
import { Wheat, PackageCheck, CreditCard, Truck } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      icon: <Wheat className="w-6 h-6 text-[#9A5C1B]" />,
      title: 'Choose Your Flour',
      description: 'Explore our pure Sharbati wheat, ancient Khapli, Ragi, Bajra, Jowar, Barley and 7-grain blends.',
    },
    {
      num: '02',
      icon: <PackageCheck className="w-6 h-6 text-[#9A5C1B]" />,
      title: 'Select Your Pack',
      description: 'Pick the pack size that fits your kitchen needs (500 g, 1 kg, 2 kg, 5 kg, or 10 kg).',
    },
    {
      num: '03',
      icon: <CreditCard className="w-6 h-6 text-[#9A5C1B]" />,
      title: 'Place Your Order',
      description: 'Complete checkout securely via UPI, Cards, NetBanking, or Cash on Delivery without forced logins.',
    },
    {
      num: '04',
      icon: <Truck className="w-6 h-6 text-[#9A5C1B]" />,
      title: 'Freshly Prepared & Delivered',
      description: 'Your grains are milled, sealed in aroma-lock food packaging, and dispatched straight to your doorstep.',
    },
  ];

  return (
    <section className="py-16 bg-white border-b border-[#E6DEC9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#9A5C1B] uppercase tracking-wider">
            Simple 4-Step Process
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#2C241D] mt-1">
            How Fresh On-Order Milling Works
          </h2>
          <p className="text-xs sm:text-sm text-[#6B5A49] mt-2">
            No old warehouse stocks. Freshly ground when you order, delivered with care.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative bg-[#FAF7F2] rounded-2xl p-6 border border-[#EAE1D0] flex flex-col justify-between hover:shadow-lg transition-all"
            >
              <div>
                {/* Step Number & Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-xs border border-[#E6DEC9]">
                    {step.icon}
                  </div>
                  <span className="font-serif text-2xl font-extrabold text-[#D5C4B0]">
                    {step.num}
                  </span>
                </div>

                <h3 className="font-serif text-base font-bold text-[#2C241D] mb-1.5">
                  {step.title}
                </h3>
                <p className="text-xs text-[#6B5A49] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
