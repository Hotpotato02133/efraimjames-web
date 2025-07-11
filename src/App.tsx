import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ContactPage from './pages/ContactPage';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className={`min-h-screen transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <Routes>
        {/* Contact Page Route */}
        <Route path="/contact" element={<ContactPage />} />
        
        {/* Main Portfolio Page Route */}
        <Route path="/" element={
          <div className="bg-stone-50 text-gray-900">
            <div className="relative">
              {/* Background pattern */}
              <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%2322c55e%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] pointer-events-none"></div>
              
              <Header />
              <main>
                <Hero />
                <About />
                <Projects />
                <Skills />
                <Contact />
              </main>
              <Footer />
            </div>
          </div>
        } />
      </Routes>
    </div>
  );
}

export default App;