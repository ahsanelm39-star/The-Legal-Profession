import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck, ArrowRightLeft, Layers, CheckCircle, XCircle } from 'lucide-react';
import { POSITIONING_CONTENT } from '../../constants/content';
import { Badge } from '../ui/Badge';
import './Positioning.css';

gsap.registerPlugin(ScrollTrigger);

export const Positioning: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.pos-anim-item',
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '.pos-pillar-card',
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.1,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="positioning" ref={sectionRef} className="section section-alt positioning-section">
      <div className="container">
        <div className="positioning-editorial-wrapper">
          {/* Header & Main Quote */}
          <div className="pos-badge-row pos-anim-item">
            <Badge variant="gold" icon={<Layers size={14} />}>
              {POSITIONING_CONTENT.badge}
            </Badge>
          </div>

          <div className="pos-quote-box pos-anim-item">
            <span className="quote-mark start" aria-hidden="true">“</span>
            <h2 className="positioning-headline">
              {POSITIONING_CONTENT.headline}
            </h2>
            <span className="quote-mark end" aria-hidden="true">”</span>
          </div>

          <p className="pos-subheadline pos-anim-item">
            {POSITIONING_CONTENT.subheadline}
          </p>

          <div className="positioning-paragraphs-grid pos-anim-item">
            <p className="pos-paragraph">{POSITIONING_CONTENT.paragraphOne}</p>
            <p className="pos-paragraph">{POSITIONING_CONTENT.paragraphTwo}</p>
          </div>

          {/* Comparative Framework: Traditional vs Meethaq Institutional Approach */}
          <div className="pos-comparison-wrapper surface-card pos-anim-item">
            <div className="pos-comparison-header">
              <ArrowRightLeft size={20} className="comparison-icon" />
              <h3 className="comparison-title">{POSITIONING_CONTENT.comparison.title}</h3>
            </div>

            <div className="pos-comparison-grid">
              {/* Traditional Approach Column */}
              <div className="comparison-col traditional-col">
                <div className="col-header">
                  <span className="col-tag traditional-tag">
                    {POSITIONING_CONTENT.comparison.traditional.tag}
                  </span>
                </div>
                <p className="col-desc">{POSITIONING_CONTENT.comparison.traditional.desc}</p>
                <ul className="col-points-list">
                  {POSITIONING_CONTENT.comparison.traditional.points.map((pt, idx) => (
                    <li key={idx} className="col-point-item traditional">
                      <XCircle size={16} className="point-icon traditional-icon" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Meethaq Approach Column */}
              <div className="comparison-col meethaq-col">
                <div className="col-header">
                  <span className="col-tag meethaq-tag">
                    {POSITIONING_CONTENT.comparison.meethaq.tag}
                  </span>
                </div>
                <p className="col-desc">{POSITIONING_CONTENT.comparison.meethaq.desc}</p>
                <ul className="col-points-list">
                  {POSITIONING_CONTENT.comparison.meethaq.points.map((pt, idx) => (
                    <li key={idx} className="col-point-item meethaq">
                      <CheckCircle size={16} className="point-icon meethaq-icon" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 4 Strategic Pillars Architecture */}
          <div className="pos-pillars-section">
            <div className="pos-pillars-title-bar">
              <ShieldCheck size={20} className="pillars-icon" />
              <h3 className="pos-pillars-main-title">الأركان الاستراتيجية للنهج المؤسسي</h3>
            </div>

            <div className="pos-pillars-grid">
              {POSITIONING_CONTENT.pillars.map((pillar) => (
                <div key={pillar.id} className="pos-pillar-card surface-card">
                  <div className="pillar-card-top">
                    <span className="pillar-number gold-gradient-text-alt">{pillar.number}</span>
                    <h4 className="pillar-title">{pillar.title}</h4>
                  </div>
                  <p className="pillar-desc">{pillar.desc}</p>
                  <div className="pillar-corner-decor" aria-hidden="true" />
                </div>
              ))}
            </div>
          </div>

          <div className="arch-line-h" />

          {/* Institutional Quality Indicators */}
          <div className="positioning-stats-row">
            {POSITIONING_CONTENT.stats.map((stat, index) => (
              <div key={index} className="pos-card stat-item">
                <span className="stat-number gold-gradient-text">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
                {stat.note && <span className="stat-note">{stat.note}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
