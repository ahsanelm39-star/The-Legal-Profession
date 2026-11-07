import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { Positioning } from './components/sections/Positioning';
import { About } from './components/sections/About';
import { PracticeAreas } from './components/sections/PracticeAreas';
import { WhyUs } from './components/sections/WhyUs';
import { Methodology } from './components/sections/Methodology';
import { Team } from './components/sections/Team';
import { Values } from './components/sections/Values';
import { Insights } from './components/sections/Insights';
import { FAQ } from './components/sections/FAQ';
import { CTA } from './components/sections/CTA';
import { Contact } from './components/sections/Contact';
import { ConsultationModal } from './components/ui/ConsultationModal';
import { ArticleModal } from './components/ui/ArticleModal';
import type { InsightArticle } from './types';

export const App: React.FC = () => {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<InsightArticle | null>(null);

  const handleOpenConsultation = () => setIsConsultationOpen(true);
  const handleCloseConsultation = () => setIsConsultationOpen(false);

  const handleSelectArticle = (article: InsightArticle) => setSelectedArticle(article);
  const handleCloseArticle = () => setSelectedArticle(null);

  return (
    <div className="app-root">
      {/* SECTION 01 — HEADER & NAVIGATION */}
      <Header onOpenConsultation={handleOpenConsultation} />

      <main id="main-content">
        {/* SECTION 02 — HERO WITH 3D EXPERIENCE */}
        <Hero onOpenConsultation={handleOpenConsultation} />

        {/* SECTION 03 — INSTITUTIONAL POSITIONING */}
        <Positioning />

        {/* SECTION 04 — ABOUT THE FIRM */}
        <About />

        {/* SECTION 05 — PRACTICE AREAS */}
        <PracticeAreas onOpenConsultation={handleOpenConsultation} />

        {/* SECTION 06 — WHY CHOOSE US */}
        <WhyUs />

        {/* SECTION 07 — WORKING METHODOLOGY */}
        <Methodology />

        {/* SECTION 08 — LEGAL TEAM */}
        <Team />

        {/* SECTION 09 — INSTITUTIONAL VALUES / CORE PRINCIPLES */}
        <Values />

        {/* SECTION 10 — LEGAL INSIGHTS / ARTICLES */}
        <Insights onSelectArticle={handleSelectArticle} />

        {/* SECTION 11 — FAQ */}
        <FAQ />

        {/* SECTION 12 — FINAL CONVERSION CTA */}
        <CTA onOpenConsultation={handleOpenConsultation} />

        {/* SECTION 13 — CONTACT */}
        <Contact />
      </main>

      {/* SECTION 14 — FOOTER */}
      <Footer />

      {/* INTERACTIVE MODALS */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={handleCloseConsultation}
      />

      <ArticleModal
        article={selectedArticle}
        onClose={handleCloseArticle}
      />
    </div>
  );
};

export default App;
