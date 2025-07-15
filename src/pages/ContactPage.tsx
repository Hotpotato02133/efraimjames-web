import React, { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    project: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // Initialize EmailJS
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY');
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Send email using EmailJS
      const result = await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID',
        import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID || 'template_orw5xze',
        formRef.current!,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY'
      );

      console.log('Email sent successfully:', result.text);
      setIsSubmitted(true);
      
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ firstName: '', lastName: '', email: '', phone: '', project: '' });
      }, 3000);
    } catch (error) {
      console.error('Failed to send email:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Use existing Header component */}
      <Header />

      {/* Main Content */}
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-16 lg:py-24 pt-32 lg:pt-40">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Left Side - Contact Form */}
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-3xl p-6 md:p-10 shadow-lg">
              {/* Header */}
              <div className="mb-8">
                <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-600 mb-4">
                   CONTACT ME
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  Get in touch
                </h1>
                <p className="text-gray-600 text-sm md:text-base">
                  I would love to hear from you.
                </p>
              </div>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-xs font-semibold text-gray-700 mb-2 tracking-wide">
                      FIRST NAME *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      placeholder="First name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                    />
                    <input type="hidden" name="first_name" value={formData.firstName} />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-xs font-semibold text-gray-700 mb-2 tracking-wide">
                      LAST NAME *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      placeholder="Last name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                    />
                    <input type="hidden" name="last_name" value={formData.lastName} />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-2 tracking-wide">
                    EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="you@company.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                  />
                  <input type="hidden" name="user_email" value={formData.email} />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-xs font-semibold text-gray-700 mb-2 tracking-wide">
                    PHONE NUMBER
                  </label>
                  <div className="flex">
                    <div className="flex items-center px-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50">
                      <span className="text-sm text-gray-600">🇵🇭 +63</span>
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(965) 639-4996"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                    />
                  </div>
                  <input type="hidden" name="user_phone" value={formData.phone} />
                  <p className="text-xs text-gray-500 mt-1">
                    (+63) 965 639 4996 • efraimjamestalucod88@gmail.com
                  </p>
                </div>

                {/* Project Description */}
                <div>
                  <label htmlFor="project" className="block text-xs font-semibold text-gray-700 mb-2 tracking-wide">
                    WHAT KIND OF PROJECT DO YOU HAVE IN MIND?
                  </label>
                  <textarea
                    id="project"
                    name="project"
                    value={formData.project}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    placeholder="What kind of project do you have in mind ..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none text-sm"
                  />
                  <input type="hidden" name="project_details" value={formData.project} />
                </div>

                {/* Privacy Policy */}
                <div className="text-sm text-gray-600">
                  You agree to our friendly{' '}
                  <a href="#" className="text-blue-600 hover:underline">
                    privacy policy
                  </a>
                  . We'll never share your information.
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitted || isLoading}
                  className={`w-full py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                    isSubmitted 
                      ? 'bg-green-600 text-white' 
                      : isLoading
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/25'
                  }`}
                >
                  {isSubmitted ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Message Sent!</span>
                    </>
                  ) : isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Submit</span>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Side - Image and Stats */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              {/* Main Image Container */}
              <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-3xl p-8 md:p-12 overflow-hidden min-h-[400px] lg:min-h-[600px]">
                {/* Plant in pot */}
                <div className="absolute top-8 left-8">
                  <div className="w-16 h-20 bg-orange-200 rounded-full relative">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="w-8 h-8 bg-green-600 rounded-full"></div>
                      <div className="w-6 h-6 bg-green-500 rounded-full ml-4 -mt-2"></div>
                    </div>
                  </div>
                </div>

                {/* Laptop */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-gray-800 rounded-lg p-2 shadow-2xl w-48 h-32 transform rotate-12">
                    <div className="bg-white rounded-md p-3 h-full flex flex-col">
                      <div className="flex items-center space-x-1 mb-2">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="h-1.5 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-1.5 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-1.5 bg-blue-200 rounded w-2/3"></div>
                        <div className="h-1.5 bg-gray-200 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Books Stack */}
                <div className="absolute bottom-12 left-8">
                  <div className="space-y-1">
                    <div className="w-12 h-2 bg-pink-300 rounded-sm transform -rotate-3"></div>
                    <div className="w-14 h-2 bg-blue-300 rounded-sm transform rotate-2"></div>
                    <div className="w-10 h-2 bg-green-300 rounded-sm transform -rotate-1"></div>
                  </div>
                </div>

                {/* Plant pot on shelf */}
                <div className="absolute top-16 right-8">
                  <div className="w-12 h-16 bg-orange-300 rounded-lg">
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <div className="w-6 h-6 bg-green-700 rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Pencil holder */}
                <div className="absolute bottom-20 right-12">
                  <div className="w-8 h-12 bg-white rounded-lg shadow-md border border-gray-200">
                    <div className="absolute -top-1 left-1 w-1 h-6 bg-yellow-400 rounded-full"></div>
                    <div className="absolute -top-1 right-1 w-1 h-4 bg-red-400 rounded-full"></div>
                  </div>
                </div>

                {/* Social icons */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs">f</span>
                  </div>
                  <div className="w-6 h-6 bg-pink-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs">in</span>
                  </div>
                  <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs">@</span>
                  </div>
                </div>
              </div>

              {/* Stats Card */}
              <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 bg-white rounded-2xl p-4 md:p-6 shadow-xl z-30">
                <div className="grid grid-cols-2 gap-4 md:gap-6">
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-gray-900">24h</div>
                    <div className="text-xs md:text-sm text-gray-600 font-medium">RESPONSE TIME</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-gray-900">100%</div>
                    <div className="text-xs md:text-sm text-gray-600 font-medium">SATISFACTION</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Mail className="w-8 h-8 mx-auto mb-4 text-gray-600" />
            <h3 className="font-semibold text-gray-900 mb-2 text-sm tracking-wide">EMAIL</h3>
            <p className="text-gray-600 text-sm">efraimjamestalucod88@gmail.com</p>
          </div>
          <div className="text-center">
            <Phone className="w-8 h-8 mx-auto mb-4 text-gray-600" />
            <h3 className="font-semibold text-gray-900 mb-2 text-sm tracking-wide">PHONE</h3>
            <p className="text-gray-600 text-sm">+63 965 639 4996</p>
          </div>
          <div className="text-center">
            <MapPin className="w-8 h-8 mx-auto mb-4 text-gray-600" />
            <h3 className="font-semibold text-gray-900 mb-2 text-sm tracking-wide">LOCATION</h3>
            <p className="text-gray-600 text-sm">Philippines</p>
          </div>
        </div>
      </div>

      {/* Use existing Footer component */}
      <Footer />
    </div>
  );
};

export default Contact;