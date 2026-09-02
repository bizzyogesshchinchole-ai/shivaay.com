import React from 'react';
import { Clock, Wheat, Layers, Smartphone, Truck, Heart, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const WhyShivaaySection: React.FC = () => {
  const { navigateTo } = useStore();

  const benefits = [
    {
      icon: <Clock className="w-6 h-6 text-[#9A5C1B]" />,
      title: 'Freshly Prepared on Order',
      description: 'Products are prepared and packed against customer orders, ensuring genuine grain aroma and optimal culinary performance.',
    },
    {
      icon: <Wheat className="w-6 h-6 text-[#9A5C1B]" />,
      title: 'Carefully Selected Grains',
      description: 'High standard whole wheat, traditional Indian millets, and unpolished pulses hand-sorted for quality and cleanliness.',
    },
    {
      icon: <Layers className="w-6 h-6 text-[#9A5C1B]" />,
      title: 'Wide Flour Variety',
      description: 'Choose from whole wheat, heirloom Khapli, Bajra, Ragi, Jowar, Barley, Makka, roasted Chana and custom multigrain blends.',
    },
    {
      icon: <Smartphone className="w-6 h-6 text-[#9A5C1B]" />,
      title: 'Convenient Ordering',
      description: 'Simple, frictionless checkout with transparent pack size pricing, instant WhatsApp support, and no forced logins.',
    },
    {
      icon: <Truck className="w-6 h-6 text-[#9A5C1B]" />,
      title: 'Doorstep Delivery',
      description: 'Carefully sealed in protective moisture-barrier food packaging and dispatched straight to your selected home address.',
    },
    {
      icon: <Heart className="w-6 h-6 text-[#9A5C1B]" />,
      title: 'Made With Care',
      description: 'We focus on quality, purity, freshness, and total transparency without unsupported or misleading marketing claims.',
    },
  ];

  return (
    <section className="py-16 bg-white border-b border-[#E6DEC9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#9A5C1B] uppercase tracking-wider">
            Why Shivaay Agri Products?
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#2C241D] mt-1">
            Real Grains. Fresh Milling. Honest Food.
          </h2>
          <p className="text-xs sm:text-sm text-[#6B5A49] mt-2">
            We are dedicated to reviving traditional Indian milling wisdom with modern e-commerce reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#EAE1D0] hover:border-[#D49E48]/70 transition-all duration-300 hover:shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-4 shadow-xs border border-[#E6DEC9]">
                  {item.icon}
                </div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#2C241D] mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#6B5A49] leading-relaxed">
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
