import { useEffect, useState, type ComponentType } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import CollaborativeProjects from './components/CollaborativeProjects';
import OtherProjects from './components/OtherProjects';
import WhatICanDo from './components/WhatICanDo';
import Contact from './components/Contact';
import LetsTalkMarquee from './components/LetsTalkMarquee';
import Footer from './components/Footer';
import ContactPage from './pages/ContactPage';
import ProjectDetails from './pages/ProjectDetails';
import WorkHistory from './components/WorkHistory';
import BackToTop from './components/BackToTop';
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import AdminHome from './admin/AdminHome';
import ProjectsAdmin from './admin/pages/ProjectsAdmin';
import WorkHistoryAdmin from './admin/pages/WorkHistoryAdmin';
import HeroAboutAdmin from './admin/pages/HeroAboutAdmin';
import SiteSettingsAdmin from './admin/pages/SiteSettingsAdmin';
import SectionsAdmin from './admin/pages/SectionsAdmin';
import CustomSectionBlock from './components/CustomSectionBlock';
import { useContent } from './hooks/useContent';
import { getPageBlocks, getCustomSections } from './lib/content';
import { fallbackPageBlocks, fallbackCustomSections } from './data/fallback';

// Fixed home-page sections, keyed by page_blocks.block_key. CMS toggles
// enabled/order per key; 'custom:<uuid>' blocks are resolved against
// custom_sections below instead of this registry.
const COMPONENT_REGISTRY: Record<string, ComponentType> = {
  hero: Hero,
  'what-i-can-do': WhatICanDo,
  projects: Projects,
  'collaborative-projects': CollaborativeProjects,
  'other-projects': OtherProjects,
  'lets-talk': LetsTalkMarquee,
  about: About,
  'work-history': WorkHistory,
  contact: Contact,
};

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const pageBlocks = useContent(getPageBlocks, fallbackPageBlocks);
  const customSections = useContent(getCustomSections, fallbackCustomSections);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className={`min-h-screen transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <Routes>
        {/* Contact Page Route */}
        <Route path="/contact" element={<ContactPage />} />
        
        {/* Project Details Route */}
        <Route path="/project/:id" element={<ProjectDetails />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
          <Route path="projects" element={<ProjectsAdmin />} />
          <Route path="work-history" element={<WorkHistoryAdmin />} />
          <Route path="hero-about" element={<HeroAboutAdmin />} />
          <Route path="site-settings" element={<SiteSettingsAdmin />} />
          <Route path="sections" element={<SectionsAdmin />} />
        </Route>
        
        {/* Main Portfolio Page Route */}
        <Route path="/" element={
          <div className="bg-stone-50 text-gray-900">
            <div className="relative">
              {/* Background pattern */}
              <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%2322c55e%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] pointer-events-none"></div>
              
              <Header />
              <main>
                {pageBlocks
                  .filter((block) => block.enabled)
                  .map((block) => {
                    if (block.blockKey.startsWith('custom:')) {
                      const sectionId = block.blockKey.slice('custom:'.length);
                      const section = customSections.find((s) => s.id === sectionId && s.enabled);
                      return section ? <CustomSectionBlock key={block.id} section={section} /> : null;
                    }
                    const Component = COMPONENT_REGISTRY[block.blockKey];
                    return Component ? <Component key={block.id} /> : null;
                  })}
              </main>
              <Footer />
            </div>
          </div>
        } />
      </Routes>
      <BackToTop />
    </div>
  );
}

export default App;
