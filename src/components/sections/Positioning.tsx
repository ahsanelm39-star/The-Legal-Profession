import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { POSITIONING_CONTENT } from '../../constants/content';
import { Badge } from '../ui/Badge';
import './Positioning.css';

gsap.registerPlugin(ScrollTrigger);

export const Positioning: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.pos-card', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
        opacity: 0,
        y: 40,
        duration: 1,
        stagger: 0.18,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="positioning" ref={sectionRef} className="section section-alt positioning-section">
      <div className="container">
        <div className="positioning-editorial-wrapper">
          <div className="pos-badge-row">
            <Badge variant="gold">الفلسفة والنهج المؤسسي</Badge>
          </div>

          <div className="pos-quote-box">
            <span className="quote-mark start" aria-hidden="true">“</span>
            <h2 className="positioning-headline">
              {POSITIONING_CONTENT.headline}
            </h2>
            <span className="quote-mark end" aria-hidden="true">”</span>
          </div>

          <div className="positioning-paragraphs-grid">
            <p className="pos-paragraph">{POSITIONING_CONTENT.paragraphOne}</p>
            <p className="pos-paragraph">{POSITIONING_CONTENT.paragraphTwo}</p>
          </div>

          <div className="arch-line-h" />

          {/* Institutional Quality Indicators */}
          <div className="positioning-stats-row">
            {POSITIONING_CONTENT.stats.map((stat, index) => (
              <div key={index} className="pos-card stat-item">
                <span className="stat-number gold-gradient-text">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
