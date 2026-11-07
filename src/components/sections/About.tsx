import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck, Compass, Target } from 'lucide-react';
import { ABOUT_CONTENT } from '../../constants/content';
import { SectionHeading } from '../ui/SectionHeading';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

export const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-reveal-col', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
        opacity: 0,
        y: 40,
        duration: 1,
        stagger: 0.25,
        ease: 'power3.out',
      });

      gsap.from('.about-pillar-card', {
        scrollTrigger: {
          trigger: '.about-pillars-grid',
          start: 'top 85%',
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const pillarIcons = [<Compass size={24} />, <Target size={24} />, <ShieldCheck size={24} />];

  return (
    <section id="about" ref={sectionRef} className="section about-section">
      <div className="container">
        <SectionHeading
          badge={ABOUT_CONTENT.badge}
          title={ABOUT_CONTENT.title}
          highlight="— الأصالة والحصانة القانونية"
          description="رؤيتنا القانونية قائمة على المزج بين الفهم التجاري والعمق القضائي لتقديم قيمة ملموسة."
        />

        <div className="about-editorial-grid">
          {/* Text Story Column */}
          <div className="about-reveal-col about-text-side">
            <div className="about-lead-quote">
              <p className="lead-text">{ABOUT_CONTENT.lead}</p>
            </div>

            <p className="about-narrative">{ABOUT_CONTENT.story}</p>

            <div className="about-signature-block">
              <div className="signature-symbol" aria-hidden="true">
                <span className="symbol-letter">م</span>
              </div>
              <div className="signature-info">
                <span className="signature-name">مجلس الشركاء والاستشارات</span>
                <span className="signature-role">مِيثاق للمحاماة والاستشارات القانونية</span>
              </div>
            </div>
          </div>

          {/* Architectural Graphic Composition */}
          <div className="about-reveal-col about-visual-side">
            <div className="arch-visual-card">
              <div className="arch-card-glow" />
              <div className="arch-card-border" />
              
              <div className="arch-card-content">
                <div className="arch-monogram-display">
                  <div className="monogram-outer-ring">
                    <div className="monogram-inner-ring">
                      <span className="monogram-glyph">مِيثاق</span>
                    </div>
                  </div>
                </div>

                <div className="arch-card-caption">
                  <span className="caption-tag">المبادئ الحاكمة</span>
                  <h3 className="caption-title">رصانة المنهج وشرف الرسالة</h3>
                  <p className="caption-text">
                    نعتبر الوكالة القانونية عقد أمانة قبل أن تكون عملاً مهنيًا، ونلتزم بصيانة أسرار الموكلين
                    وتسخير كامل المكنة المعرفية لحماية مصالحهم المشروعة.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Pillars Grid */}
        <div className="about-pillars-grid">
          {ABOUT_CONTENT.pillars.map((pillar, idx) => (
            <div key={idx} className="about-pillar-card surface-card">
              <div className="pillar-icon-box">{pillarIcons[idx]}</div>
              <h4 className="pillar-title">{pillar.title}</h4>
              <p className="pillar-desc">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
