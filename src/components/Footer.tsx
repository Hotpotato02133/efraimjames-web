import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Github, Linkedin, Twitter, Instagram, Heart } from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
  ];

  const quickLinks = [
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    if (href.startsWith('/')) {
      // Navigate to page
      navigate(href);
    } else {
      // Scroll to section
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8 mx-4 sm:mx-6 lg:mx-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/Logo1.png" 
                alt="Efraim James Logo" 
                className="w-8 h-8 object-contain"
              />
              <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Efraim James
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              Creating digital experiences that blend innovation with aesthetics. 
              Let's build something extraordinary together.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:text-green-600 hover:bg-green-100 hover:scale-110 transition-all duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="text-gray-600 hover:text-green-600 transition-colors duration-300"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Get In Touch</h3>
            <div className="space-y-2 text-gray-600">
              <p>efraimjamestalucod88@gmail.com</p>
              <p>+63 (965) 639-4996</p>
              <p>Recodo, Zamboanga City, Philippines, 7000</p>
            </div>
            <div className="mt-4">
              <button
                onClick={() => navigate('/contact')}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Let's talk
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center mx-4 sm:mx-6 lg:mx-8">
          <p className="text-gray-600 text-sm flex items-center">
            © 2025 Efraim James Portfolio.{' '}
            {' '}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-600 hover:text-green-600 text-sm transition-colors duration-300">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-600 hover:text-green-600 text-sm transition-colors duration-300">
              Terms of Service
            </a>
            <a href="#" className="text-gray-600 hover:text-green-600 text-sm transition-colors duration-300">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;