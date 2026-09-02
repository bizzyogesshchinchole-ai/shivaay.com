import React, { useState } from 'react';
import { useStore, PageView } from '../../context/StoreContext';
import { BrandLogo } from './BrandLogo';
import {
  Wheat,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Send,
  MessageCircle,
  ExternalLink,
  Heart,
  Truck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { CategoryId } from '../../types';

export const Footer: React.FC = () => {
  const { settings, navigateTo, categories, showToast, generateWhatsAppLink } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      showToast('Thank you for subscribing to Shivaay Grain updates!', 'success');
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Trust Ribbon */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 shrink-0 border border-slate-700">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Prepared on Order</h4>
              <p className="text-xs text-slate-400 mt-0.5">Freshly milled after order placement, never old shelf inventory.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 shrink-0 border border-slate-700">
              <Wheat className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Selected Grains</h4>
              <p className="text-xs text-slate-400 mt-0.5">100% whole grain purity with zero bleaching or fillers.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 shrink-0 border border-slate-700">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Doorstep Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">Moisture-barrier food-grade bags preserving fresh aroma.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 shrink-0 border border-slate-700">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">WhatsApp Support</h4>
              <p className="text-xs text-slate-400 mt-0.5">Direct human assistance for custom pack sizes and orders.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12">
          {/* Brand Info & Story */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center">
              <BrandLogo size="md" variant="light" onClick={() => navigateTo('home')} />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              We manufacture and supply fresh, premium quality whole wheat, indigenous millets, and balanced multigrain flours. All flours are prepared on order to deliver authentic, nutrient-rich freshness to your kitchen.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                Fresh Milling Updates & Guides
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-md">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-3.5 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold rounded-xl transition-colors shrink-0 flex items-center gap-1.5"
                >
                  <span>Subscribe</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            {/* Regulatory Placeholders */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500 pt-2 font-mono">
              <span>FSSAI Lic: <strong className="text-slate-400">{settings.fssaiNumberPlaceholder}</strong></span>
              <span>•</span>
              <span>GSTIN: <strong className="text-slate-400">{settings.gstNumberPlaceholder}</strong></span>
            </div>
          </div>

          {/* Shop Flours Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Shop Fresh Flours
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigateTo('shop', { categoryId: 'wheat' })}
                  className="hover:text-white transition-colors"
                >
                  Wheat Flour (Sharbati & Khapli)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop', { categoryId: 'millet' })}
                  className="hover:text-white transition-colors"
                >
                  Millet Flours (Ragi, Bajra, Jowar)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop', { categoryId: 'multigrain' })}
                  className="hover:text-white transition-colors"
                >
                  7-Grain Multigrain Flour
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop', { categoryId: 'single-grain' })}
                  className="hover:text-white transition-colors"
                >
                  Barley (Jau) & Maize Flour
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop', { categoryId: 'specialty' })}
                  className="hover:text-white transition-colors"
                >
                  Roasted Chana Sattu / Besan
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('shop')}
                  className="text-emerald-400 font-semibold hover:underline"
                >
                  Explore All Flour Varieties →
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links & Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-white transition-colors">
                  Our Story & Philosophy
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('why-shivaay')} className="hover:text-white transition-colors">
                  Why Shivaay Agri Products
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('grain-guide')} className="hover:text-white transition-colors">
                  Shivaay Grain Guide & Recipes
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('account')} className="hover:text-white transition-colors text-emerald-400 font-semibold">
                  Customer Profile & Order History
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('track-order')} className="hover:text-white transition-colors">
                  Track Your Order Status
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('admin')} className="text-emerald-400 hover:text-white transition-colors">
                  Ad Studio & Admin Engine
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('policies', { policyTab: 'shipping' })}
                  className="hover:text-white transition-colors"
                >
                  Shipping & Delivery FAQs
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Support Placeholders */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Contact & Support
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-300 shrink-0" />
                <span>{settings.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-300 shrink-0" />
                <span>{settings.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-300 shrink-0" />
                <span>{settings.businessHours}</span>
              </div>

              {/* Direct WhatsApp Action */}
              <div className="pt-2">
                <a
                  href={generateWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Enquiries</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Responsible Disclaimer Box */}
        <div className="bg-slate-800/50 border border-slate-800 rounded-2xl p-4 my-6 text-[11px] text-slate-400 leading-relaxed">
          <p className="font-semibold text-slate-300 mb-1">
            🌱 Responsible Food & Transparency Commitment:
          </p>
          <p>
            Shivaay Agri Products crafts wholesome, unadulterated flours from carefully selected food grains and millets prepared strictly on customer order. We do not make medical or curative claims. Always consult a certified healthcare professional or nutritionist for specific dietary regimens or allergies. Store all fresh flours in dry, airtight containers.
          </p>
        </div>

        {/* Bottom Bar: Copyright & Legal Policies */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} Shivaay Agri Products. All rights reserved. Fresh Flour. Better Grains.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <button
              onClick={() => navigateTo('policies', { policyTab: 'privacy' })}
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => navigateTo('policies', { policyTab: 'terms' })}
              className="hover:text-white transition-colors"
            >
              Terms & Conditions
            </button>
            <span>•</span>
            <button
              onClick={() => navigateTo('policies', { policyTab: 'shipping' })}
              className="hover:text-white transition-colors"
            >
              Shipping Policy
            </button>
            <span>•</span>
            <button
              onClick={() => navigateTo('policies', { policyTab: 'refunds' })}
              className="hover:text-white transition-colors"
            >
              Return & Refund Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
