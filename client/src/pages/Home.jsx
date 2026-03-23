import { useState } from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import EnhancedProjects from '../components/EnhancedProjects'; // New enhanced projects component
import Pricing from '../components/Pricing';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import InternshipBanner from '../components/InternshipBanner';
import InternshipModal from '../components/InternshipModal';

export default function Home({ dark, C, pal }) {
  const [showIntern, setShowIntern] = useState(false);

  return (
    <div>
      <Hero dark={dark} C={C} pal={pal} />
      <Services dark={dark} C={C} />
      
      {/* Enhanced Projects Section with all features */}
      <EnhancedProjects dark={dark} C={C} isHomePage={true} />
      
      <Pricing dark={dark} C={C} />
      <Testimonials dark={dark} C={C} />
      <InternshipBanner dark={dark} C={C} onOpenModal={() => setShowIntern(true)} />
      <Contact dark={dark} C={C} />
      
      {showIntern && (
        <InternshipModal 
          onClose={() => setShowIntern(false)} 
          dark={dark} 
          C={C} 
          accentColor="#00e5ff" 
        />
      )}
    </div>
  );
}