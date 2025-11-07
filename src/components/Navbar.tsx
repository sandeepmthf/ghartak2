import { ShoppingBag, Menu, X, User, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import logo from 'figma:asset/140c39be02623ac8ea55ecdd5766cc44703fdb24.png';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  cartCount: number;
  user?: any;
  onLogout?: () => void;
}

export default function Navbar({ currentPage, onNavigate, cartCount, user, onLogout }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', page: 'home' },
    { name: 'Vendors', page: 'vendors' },
    { name: 'Orders', page: 'orders' },
    { name: 'Insights', page: 'vendor-dashboard' },
    { name: 'About', page: 'about' },
    { name: 'Partner with Us', page: 'partner' },
    { name: 'Contact', page: 'contact' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <img src={logo} alt="Ghartak" className="h-12 md:h-14 w-auto" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => onNavigate(link.page)}
                className={`hover:text-green-600 transition-colors ${
                  currentPage === link.page ? 'text-green-600' : 'text-gray-700'
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <Button 
                variant="outline" 
                onClick={() => onNavigate('cart')}
                className="relative border-2"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Cart
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                    {cartCount}
                  </span>
                )}
              </Button>
            </div>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <User className="w-5 h-5" />
                    {user.user_metadata?.name || user.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onNavigate('orders')}>
                    My Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate('vendor-dashboard')}>
                    Vendor Insights
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" onClick={() => onNavigate('login')}>
                Login
              </Button>
            )}
            
            <Button className="bg-green-600 hover:bg-green-700 hover:shadow-lg">Download App</Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.page}
                  onClick={() => {
                    onNavigate(link.page);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left hover:text-green-600 transition-colors ${
                    currentPage === link.page ? 'text-green-600' : 'text-gray-700'
                  }`}
                >
                  {link.name}
                </button>
              ))}
              <div className="flex flex-col gap-2 mt-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    onNavigate('cart');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full relative border-2"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Cart {cartCount > 0 && `(${cartCount})`}
                </Button>
                
                {user ? (
                  <>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => {
                        onNavigate('orders');
                        setMobileMenuOpen(false);
                      }}
                    >
                      <User className="w-5 h-5 mr-2" />
                      {user.user_metadata?.name || user.email}
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        onLogout?.();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="w-5 h-5 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="ghost" 
                    className="w-full"
                    onClick={() => {
                      onNavigate('login');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Login
                  </Button>
                )}
                
                <Button className="bg-green-600 hover:bg-green-700 w-full hover:shadow-lg">Download App</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
