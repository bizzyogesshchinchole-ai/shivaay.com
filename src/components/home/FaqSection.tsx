import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const FaqSection: React.FC = () => {
  const { generateWhatsAppLink } = useStore();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What does "Prepared / Packed on Order" mean?',
      a: 'Unlike supermarket packets that sit in warehouses for months, our grains are milled strictly after receiving your order. This prevents the delicate natural grain oils in wheat germ and millets from oxidizing, giving you superior aroma, fluffier rotis, and maximum natural nourishment.',
    },
    {
      q: 'How long does freshly milled flour stay fresh (Shelf Life)?',
      a: 'Because our flour contains 0% chemical preservatives or stabilizers, we recommend consuming whole wheat and multigrain flours within 45 days, and millet flours (like Bajra & Ragi) within 30–45 days. Always store in dry, airtight containers away from humidity.',
    },
    {
      q: 'Are any chemicals, maida, or bleaching agents added?',
      a: 'Never. We are committed to 100% whole grain purity. What you receive is pure, unadulterated stone-milled or finely ground grain flour with all its natural bran, germ, and fiber intact.',
    },
    {
      q: 'What are the available pack sizes and pricing?',
      a: 'We offer flexible pack sizes ranging from 500 g sampler pouches to 1 kg, 2 kg, 5 kg family packs, and 10 kg economy packs. Pricing adjusts automatically on every product page when you select your preferred weight.',
    },
    {
      q: 'How long does doorstep delivery take after ordering?',
      a: 'Your order is freshly milled within 24 to 48 hours of order confirmation, packed in food-grade moisture-seal pouches, and handed over to our courier partner. Typical doorstep delivery takes 2 to 4 business days depending on your delivery city.',
    },
    {
      q: 'Can I place custom or bulk orders for events / restaurants?',
      a: 'Yes! We support custom grain blends and bulk requirements. Simply click the WhatsApp chat button or contact our support team to discuss your specific pack requirements.',
    },
  ];

  return (
    <section className="py-16 bg-[#FAF7F2] border-b border-[#E6DEC9]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAE0CD] text-[#784712] text-xs font-bold mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#2C241D]">
            Everything You Need to Know
          </h2>
          <p className="text-xs sm:text-sm text-[#6B5A49] mt-1">
            Common questions about on-order milling, grain sourcing, and storage tips.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#E6DEC9] overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-[#FAF6EE] transition-colors"
                >
                  <span className="font-serif text-sm sm:text-base font-bold text-[#2C241D]">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#9A5C1B] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-[#5C4D3C] leading-relaxed border-t border-[#F0EAE1] pt-3 animate-in fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="mt-8 p-4 sm:p-6 bg-[#FAF0DC] rounded-2xl border border-[#E0D0B5] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="font-bold text-sm text-[#2C241D]">Still have questions about our flours?</h4>
            <p className="text-xs text-[#7A6A58] mt-0.5">Our grain specialists are available on WhatsApp to guide you.</p>
          </div>
          <a
            href={generateWhatsAppLink('Hello Shivaay Agri Products, I have a question about flour types and delivery.')}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};
