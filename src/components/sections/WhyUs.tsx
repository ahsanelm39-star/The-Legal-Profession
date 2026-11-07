import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, ShieldCheck, Sparkles } from 'lucide-react';
import { WHY_CHOOSE_US_CONTENT } from '../../constants/content';
import { Badge } from '../ui/Badge';
import './WhyUs.css';

gsap.registerPlugin(ScrollTrigger);

export const WhyUs: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.manifesto-row-item', {
        scrollTrigger: {
          trigger: rowsRef.current,
          start: 'top 75%',
        },
        opacity: 0,
        y: 45,
        duration: 0.95,
        stagger: 0.2,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="why-us" ref={sectionRef} className="section why-us-manifesto-section">
      <div className="container">
        {/* Sticky Sidebar + Expansive Horizontal Manifesto Rows */}
        <div className="why-us-manifesto-layout">
          {/* Sticky Editorial Sidebar */}
          <div className="why-us-sticky-sidebar">
            <div className="why-us-badge-box">
              <Badge variant="gold" icon={<Sparkles size={14} />}>
                النهج المؤسسي الفارِق
              </Badge>
            </div>

            <h2 className="why-us-manifesto-heading">
              الفرق يبدأ <br />
              <span className="gold-gradient-text">من طريقة التفكير.</span>
            </h2>

            <p className="why-us-manifesto-sub">
              {WHY_CHOOSE_US_CONTENT.supporting}
            </p>

            <div className="sidebar-decor-badge">
              <ShieldCheck size={20} className="decor-icon" />
              <span>معايير انضباط وتحليل تعتمد أصول الممارسة القضائية</span>
            </div>
          </div>

          {/* Expansive Horizontal Rows (01 - 04) */}
          <div ref={rowsRef} className="why-us-rows-container">
            {WHY_CHOOSE_US_CONTENT.principles.map((item) => (
              <div key={item.number} className="manifesto-row-item surface-card">
                <div className="row-number-column">
                  <span className="row-oversized-number gold-gradient-text-alt">
                    {item.number}
                  </span>
                  <div className="row-vertical-line" aria-hidden="true" />
                </div>

                <div className="row-content-column">
                  <div className="row-title-bar">
                    <h3 className="row-title">{item.title}</h3>
                    <span className="row-tag">معيار مِيثاق</span>
                  </div>

                  <p className="row-description">{item.desc}</p>

                  <div className="row-details-strip">
                    {item.details.map((detail, idx) => (
                      <div key={idx} className="row-detail-pill">
                        <Check size={14} className="detail-check" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
