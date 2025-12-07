import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Mail } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#projects', label: 'Projects' },
    { href: '#skills', label: 'Skills' },
  ];

  const handleNavClick = (href: string) => {
    // If we're on contact page and trying to navigate to a section, go to home first
    if (location.pathname === '/contact' && href.startsWith('#')) {
      navigate('/' + href);
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  const handleContactClick = () => {
    navigate('/contact');
    setIsMenuOpen(false);
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header className="fixed top-0 w-full z-50 transition-all duration-300 bg-transparent">
      <nav className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between mx-4 sm:mx-6 lg:mx-8">
          {/* Logo and Brand - Left */}
          <button 
            onClick={handleLogoClick}
            className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity duration-300 min-w-0"
          >
            <img 
              src="/Logo1.png" 
              alt="Efraim James Logo" 
              className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 object-contain flex-shrink-0"
            />
            <div className="text-base font-jakarta sm:text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent truncate">
              Efraim James
            </div>
          </button>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="flex items-center space-x-8 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-full px-8 py-2.5">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className="text-gray-800 hover:text-green-600 transition-colors duration-300 text-base font-medium relative group"
                >
                  <span>{item.label}</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></div>
                </button>
              ))}
            </div>
          </div>

          {/* Desktop CTA Button - Right */}
          <div className="hidden lg:block">
            <button
              onClick={handleContactClick}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-4 xl:px-6 py-2.5 xl:py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25 flex items-center space-x-2 text-sm xl:text-base"
            >
              <span>Let's Talk</span>
              <Mail className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile/Tablet - Only Hamburger Menu */}
          <div className="lg:hidden">
            <button
              className="transition-colors duration-300 p-2 rounded-lg text-black hover:text-green-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 space-y-2 bg-white/80 backdrop-blur-xl rounded-xl border border-white/40 shadow-2xl mx-2 sm:mx-0">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="w-full text-center px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all duration-300 rounded-lg mx-2 font-medium text-sm"
              >
                {item.label}
              </button>
            ))}
            
            {/* Mobile Menu Contact Button */}
            <div className="px-2 pt-2">
              <button
                onClick={handleContactClick}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-4 py-3 rounded-full font-semibold transition-all duration-300 flex items-center justify-center space-x-2 text-sm"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Me</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;