import React, { useEffect } from 'react';
import CareHero from '../components/CareGuide/CareHero';
import CareCategoryNav from '../components/CareGuide/CareCategoryNav';
import GoldenRules from '../components/CareGuide/GoldenRules';
import JewelleryCareSection from '../components/CareGuide/JewelleryCareSection';
import GemstoneCareGrid from '../components/CareGuide/GemstoneCareGrid';
import DosDonts from '../components/CareGuide/DosDonts';
import StorageGuide from '../components/CareGuide/StorageGuide';
import CleaningRitual from '../components/CareGuide/CleaningRitual';
import ProfessionalCare from '../components/CareGuide/ProfessionalCare';
import CareReference from '../components/CareGuide/CareReference';
import CareFAQ from '../components/CareGuide/CareFAQ';
import CareCTA from '../components/CareGuide/CareCTA';

const JewelleryCarePage = () => {
  // Ensure the page starts at the top when loaded
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="care-page-wrapper">
      <CareHero />
      <CareCategoryNav />
      <GoldenRules />
      
      {/* Silver Care */}
      <JewelleryCareSection 
        id="silver-care"
        heading="Silver Jewellery"
        subheading="Keep Your Silver Shining"
        desc="Silver can naturally tarnish when exposed to air, moisture and certain chemicals. Proper storage and gentle cleaning can help preserve its beauty."
        img="/SJcare.png"
        bgWhite={true}
        dos={[
          "Store in a dry, dark place",
          "Use a soft silver jewellery cloth",
          "Keep pieces individually stored",
          "Keep silver away from excessive moisture"
        ]}
        donts={[
          "Chlorinated water",
          "Perfume and cosmetics",
          "Harsh cleaning chemicals",
          "Rubber bands (contains sulfur)"
        ]}
        careTip="Store silver jewellery in an airtight zip-lock bag with an anti-tarnish strip when not in use."
      />

      {/* Diamond Care */}
      <JewelleryCareSection 
        id="diamond-care"
        heading="Diamond Jewellery"
        subheading="Keep Your Diamonds Brilliant"
        desc="Diamonds are exceptionally durable, but their settings and surrounding metals still require proper care to ensure the stones remain secure and sparkling."
        img="/DJCare.png"
        reverse={true}
        dos={[
          "Clean gently with warm soapy water",
          "Check settings periodically for loose stones",
          "Store separately so diamonds don't scratch other metals",
          "Have jewellery professionally inspected annually"
        ]}
        donts={[
          "Strong chemicals and bleaches",
          "Hard impacts at specific angles",
          "Wearing delicate pieces during strenuous activities"
        ]}
      />

      {/* Gold Care */}
      <JewelleryCareSection 
        id="gold-care"
        heading="Gold Jewellery"
        subheading="Protect the Golden Glow"
        desc="While pure gold doesn't tarnish, most gold jewellery is alloyed with other metals to increase strength. Different gold compositions and finishes may require slightly different care."
        img="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop"
        bgWhite={true}
        dos={[
          "Clean periodically with warm water and mild soap",
          "Store pieces individually in soft cloth bags",
          "Dry thoroughly with a lint-free cloth after cleaning",
          "Inspect clasps and hinges regularly"
        ]}
        donts={[
          "Chlorine and harsh cleaning solvents",
          "Abrasive cleaning materials",
          "Wearing during heavy physical labor"
        ]}
      />

      <GemstoneCareGrid />
      <DosDonts />
      <StorageGuide />
      <CleaningRitual />
      <ProfessionalCare />
      <CareReference />
      <CareFAQ />
      <CareCTA />
    </div>
  );
};

export default JewelleryCarePage;
