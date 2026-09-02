import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { ToastContainer } from './components/common/ToastContainer';
import { CartDrawer } from './components/cart/CartDrawer';

// Home sections
import { HeroSection } from './components/home/HeroSection';
import { TrustHighlights } from './components/home/TrustHighlights';
import { CategorySection } from './components/home/CategorySection';
import { FeaturedProducts } from './components/home/FeaturedProducts';
import { FreshnessModelSection } from './components/home/FreshnessModelSection';
import { MultigrainSpotlight } from './components/home/MultigrainSpotlight';
import { WhyShivaaySection } from './components/home/WhyShivaaySection';
import { HowItWorks } from './components/home/HowItWorks';
import { GrainGuideSection } from './components/home/GrainGuideSection';
import { ReviewsSection } from './components/home/ReviewsSection';
import { FaqSection } from './components/home/FaqSection';
import { NewsletterCta } from './components/home/NewsletterCta';

// Sub-pages
import { ShopPage } from './components/shop/ShopPage';
import { ProductDetailPage } from './components/product/ProductDetailPage';
import { CartPage } from './components/cart/CartPage';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { OrderConfirmationPage } from './components/checkout/OrderConfirmationPage';
import { GrainGuidePage } from './components/pages/GrainGuidePage';
import { ArticleDetailPage } from './components/pages/ArticleDetailPage';
import { AboutPage } from './components/pages/AboutPage';
import { ContactPage } from './components/pages/ContactPage';
import { TrackOrderPage } from './components/pages/TrackOrderPage';
import { WhyShivaayPage } from './components/pages/WhyShivaayPage';
import { PoliciesPage } from './components/pages/PoliciesPage';
import { AdminPage } from './components/admin/AdminPage';
import { BannerStudio } from './components/admin/BannerStudio';
import { AccountPage } from './components/account/AccountPage';
import { CustomerAuthModal } from './components/auth/CustomerAuthModal';

const MainContent: React.FC = () => {
  const { currentView } = useStore();

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const isAdminView = currentView === 'admin';

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-sans antialiased selection:bg-slate-900 selection:text-white">
      {!isAdminView && <Header />}

      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <HeroSection />
            <TrustHighlights />
            <CategorySection />
            <FeaturedProducts />
            <FreshnessModelSection />
            <MultigrainSpotlight />
            <WhyShivaaySection />
            <HowItWorks />
            <GrainGuideSection />
            <ReviewsSection />
            <FaqSection />
            <NewsletterCta />
          </>
        )}

        {currentView === 'shop' && <ShopPage />}
        {currentView === 'product-detail' && <ProductDetailPage />}
        {currentView === 'cart' && <CartPage />}
        {currentView === 'checkout' && <CheckoutPage />}
        {currentView === 'order-confirmation' && <OrderConfirmationPage />}
        {currentView === 'grain-guide' && <GrainGuidePage />}
        {currentView === 'article-detail' && <ArticleDetailPage />}
        {currentView === 'about' && <AboutPage />}
        {currentView === 'contact' && <ContactPage />}
        {currentView === 'track-order' && <TrackOrderPage />}
        {currentView === 'why-shivaay' && <WhyShivaayPage />}
        {currentView === 'policies' && <PoliciesPage />}
        {currentView === 'admin' && <AdminPage />}
        {currentView === 'account' && <AccountPage />}
        {(currentView === 'banner-studio' || (currentView as string) === 'banner-generator') && <BannerStudio />}
      </main>

      {!isAdminView && <Footer />}
      <CartDrawer />
      <CustomerAuthModal />
      {!isAdminView && <WhatsAppButton />}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
