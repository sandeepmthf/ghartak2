import { useState, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import VendorsPage from './components/VendorsPage';
import VendorDetailPage from './components/VendorDetailPage';
import CartCheckoutPage from './components/CartCheckoutPage';
import PartnerPage from './components/PartnerPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import OrderHistoryPage from './components/OrderHistoryPage';
import VendorDashboardPage from './components/VendorDashboardPage';
import NearbyShopsPage from './components/NearbyShopsPage';
import LoginPage from './components/LoginPage';
import LocationDeniedDemo from './components/LocationDeniedDemo';
import { AIChatAssistant } from './components/AIChatAssistant';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { getTotalItems } = useCart();

  // Check for existing session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('ghartak_access_token');
    const storedUser = localStorage.getItem('ghartak_user');
    
    if (storedToken && storedUser) {
      setAccessToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (token: string, userData: any) => {
    setAccessToken(token);
    setUser(userData);
    localStorage.setItem('ghartak_access_token', token);
    localStorage.setItem('ghartak_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem('ghartak_access_token');
    localStorage.removeItem('ghartak_user');
    toast.success('Logged out successfully');
    handleNavigate('home');
  };

  const renderPage = () => {
    if (currentPage === 'home') {
      return <HomePage onNavigate={handleNavigate} />;
    }
    
    if (currentPage === 'vendors') {
      return <VendorsPage onNavigate={handleNavigate} />;
    }
    
    if (currentPage.startsWith('vendor-')) {
      const vendorId = currentPage.replace('vendor-', '');
      return <VendorDetailPage vendorId={vendorId} onNavigate={handleNavigate} />;
    }
    
    if (currentPage === 'cart') {
      return <CartCheckoutPage onNavigate={handleNavigate} />;
    }
    
    if (currentPage === 'partner') {
      return <PartnerPage />;
    }
    
    if (currentPage === 'about') {
      return <AboutPage />;
    }
    
    if (currentPage === 'contact') {
      return <ContactPage />;
    }
    
    if (currentPage === 'orders') {
      return <OrderHistoryPage onNavigate={handleNavigate} />;
    }
    
    if (currentPage === 'vendor-dashboard') {
      return <VendorDashboardPage onNavigate={handleNavigate} />;
    }
    
    if (currentPage === 'nearby-shops') {
      return <NearbyShopsPage />;
    }
    
    if (currentPage === 'login') {
      return <LoginPage onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} />;
    }
    
    if (currentPage === 'location-denied-demo') {
      return <LocationDeniedDemo />;
    }
    
    return <HomePage onNavigate={handleNavigate} />;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        currentPage={currentPage} 
        onNavigate={handleNavigate}
        cartCount={getTotalItems()}
        user={user}
        onLogout={handleLogout}
      />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />
      <AIChatAssistant />
      <Toaster position="top-center" />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
