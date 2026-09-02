import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  Wheat,
  CheckCircle2,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { generateWhatsAppLink, showToast } = useStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Bulk / Custom Milling Order');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) {
      showToast('Please fill out required contact fields.', 'error');
      return;
    }

    setIsSubmitted(true);
    showToast('Your message has been sent to our milling team!', 'success');
  };

  return (
    <div className="py-10 bg-[#FAF7F2] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-[#9A5C1B] uppercase tracking-wider">
            Contact & Support
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#2C241D]">
            We&apos;re Here to Help Your Kitchen
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5A49]">
            Have questions about grain varieties, custom multigrain ratios, or delivery? Reach out to us.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Details & WhatsApp */}
          <div className="lg:col-span-5 space-y-6">
            {/* WhatsApp Card */}
            <div className="p-6 bg-gradient-to-br from-[#25D366]/10 to-[#128C7E]/10 rounded-3xl border border-[#25D366]/30 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-sm">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#1F1710]">
                    Fast WhatsApp Support
                  </h3>
                  <p className="text-xs text-[#2E7D32]">Chat directly with our milling coordinator</p>
                </div>
              </div>

              <p className="text-xs text-[#4A3B2C] leading-relaxed">
                Need advice on which flour is best for diabetes or gluten sensitivity? Want to order a bulk 20kg pack? Drop us a quick message!
              </p>

              <a
                href={generateWhatsAppLink('Hello Shivaay Agri Products team, I have an enquiry regarding flour varieties.')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat with Us on WhatsApp</span>
              </a>
            </div>

            {/* Direct Contact Info */}
            <div className="bg-white rounded-3xl p-6 border border-[#E6DEC9] shadow-xs space-y-4 text-xs text-[#5C4D3C]">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#9A5C1B] shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-[#2C241D]">Milling Unit & Fulfillment Center</h4>
                  <p className="text-[#7A6A58] mt-0.5">
                    Shivaay Agri Products, Grain Market Hub, Pune, Maharashtra 411038, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#9A5C1B] shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-[#2C241D]">Customer Helpline</h4>
                  <p className="text-[#7A6A58] mt-0.5">+91 98765 43210 (Mon - Sat, 9 AM - 7 PM)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#9A5C1B] shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-[#2C241D]">Email Inquiries</h4>
                  <p className="text-[#7A6A58] mt-0.5">support@shivaayagri.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#9A5C1B] shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-[#2C241D]">Milling Schedule</h4>
                  <p className="text-[#7A6A58] mt-0.5">
                    Grains are milled fresh every morning based on prior-day order bookings.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DEC9] shadow-xs">
            <h2 className="font-serif text-xl font-bold text-[#2C241D] mb-1">
              Send Us a Message
            </h2>
            <p className="text-xs text-[#7A6A58] mb-6">
              Fill in your inquiry details below. Our team responds within 24 hours.
            </p>

            {isSubmitted ? (
              <div className="p-8 text-center bg-[#FAF7F2] rounded-2xl border border-[#E6DEC9] space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#2E7D32] mx-auto" />
                <h3 className="font-serif text-lg font-bold text-[#2C241D]">Message Received!</h3>
                <p className="text-xs text-[#6B5A49]">
                  Thank you, {name}. Our customer support representative will call or email you shortly.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-5 py-2 bg-[#D49E48] text-[#241B12] font-bold text-xs rounded-xl"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#4A3B2C] mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sneha Deshmukh"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF7F2] border border-[#DDD3C2] rounded-xl text-[#2C241D] focus:ring-2 focus:ring-[#C48E3C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#4A3B2C] mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF7F2] border border-[#DDD3C2] rounded-xl text-[#2C241D] focus:ring-2 focus:ring-[#C48E3C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A3B2C] mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. sneha@example.com"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF7F2] border border-[#DDD3C2] rounded-xl text-[#2C241D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A3B2C] mb-1">
                    Subject / Topic
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF7F2] border border-[#DDD3C2] rounded-xl text-[#2C241D]"
                  >
                    <option value="Bulk / Custom Milling Order">Bulk / Custom Milling Order (10kg+)</option>
                    <option value="Product Sourcing & Millet Inquiries">Product Sourcing & Millet Inquiries</option>
                    <option value="Delivery Status or Address Change">Delivery Status or Address Change</option>
                    <option value="Retail or Restaurant Partnership">Retail or Restaurant Partnership</option>
                    <option value="Other Query">Other Query</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A3B2C] mb-1">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what you're looking for or how we can assist..."
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF7F2] border border-[#DDD3C2] rounded-xl text-[#2C241D]"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="px-8 py-3.5 bg-[#3B2A1A] hover:bg-[#281C10] text-[#FAF7F2] font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4 text-[#E2B167]" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
