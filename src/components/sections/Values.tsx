import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield, Target, Award, CheckCircle2, ScrollText, Check } from 'lucide-react';
import { VALUES_SECTION } from '../../constants/content';
import { Values3DScene } from '../three/Values3DScene';
import { SectionHeading } from '../ui/SectionHeading';
import './Values.css';

gsap.registerPlugin(ScrollTrigger);

export const Values: React.FC = () => {
  const [activeValueIndex, setActiveValueIndex] = useState<number>(0);
  const activeVal = VALUES_SECTION.values[activeValueIndex];
  const sectionRef = useRef<HTMLElement>(null);

  const icons = [<Shield size={24} />, <Target size={24} />, <Award size={24} />];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading
      gsap.fromTo(
        '.values-sculptural-section .section-header',
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 82%',
            once: true,
          },
        }
      );

      // 3D card reveal
      gsap.fromTo(
        '.values-3d-card',
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.0,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
          scrollTrigger: {
            trigger: '.values-3d-display-col',
            start: 'top 80%',
            once: true,
          },
        }
      );

      // Value tabs stagger
      gsap.fromTo(
        '.value-tab-btn',
        { opacity: 0, x: 20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.65,
          stagger: 0.1,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
          scrollTrigger: {
            trigger: '.values-content-col',
            start: 'top 80%',
            once: true,
          },
        }
      );

      // Active showcase card
      gsap.fromTo(
        '.value-active-showcase',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
          scrollTrigger: {
            trigger: '.values-content-col',
            start: 'top 72%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="values" ref={sectionRef} className="section section-alt values-sculptural-section">
      <div className="container">
        <SectionHeading
          badge="المبادئ التأسيسية وميثاق السلوك"
          title={VALUES_SECTION.heading}
          description={VALUES_SECTION.description}
        />

        {/* Sculptural 3D Centerpiece with Interactive Value Selectors */}
        <div className="values-sculptural-layout">
          {/* Left/Start 3D Visualization */}
          <div className="values-3d-display-col">
            <div className="values-3d-card surface-card">
              <div className="sculpture-caption-tag">
                <span className="caption-dot" />
                <span>منحوتة مِيثاق الثلاثية التفاعلية — تدور لتسليط الضوء على القيمة المحددة</span>
              </div>
              <Values3DScene activeValueIndex={activeValueIndex} />
            </div>
          </div>

          {/* Right/End Interactive Value Narrative Cards */}
          <div className="values-content-col">
            <div className="values-nav-selector">
              {VALUES_SECTION.values.map((val, idx) => {
                const isActive = activeValueIndex === idx;
                return (
                  <button
                    key={val.id}
                    type="button"
                    className={`value-tab-btn ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveValueIndex(idx)}
                  >
                    <div className="value-tab-icon-wrap">{icons[idx]}</div>
                    <span className="value-tab-title">{val.title}</span>
                    <span className="value-tab-num">{val.number}</span>
                  </button>
                );
              })}
            </div>

            {/* Expansive Active Value Card */}
            <div className="value-active-showcase surface-card">
              <div className="showcase-header">
                <div className="showcase-icon-box">{icons[activeValueIndex]}</div>
                <div className="showcase-titles">
                  <span className="showcase-num-tag">{activeVal.number}</span>
                  <h3 className="showcase-title">{activeVal.title}</h3>
                </div>
              </div>

              <p className="showcase-core-statement">{activeVal.description}</p>
              <div className="showcase-divider" />
              <p className="showcase-extended-text">{activeVal.extended}</p>

              {/* Specific Commitments Checklist */}
              {activeVal.commitments && (
                <div className="showcase-commitments-box">
                  <span className="commitments-lead-title">التطبيقات الإجرائية للمعايير:</span>
                  <ul className="commitments-list">
                    {activeVal.commitments.map((item, cIdx) => (
                      <li key={cIdx} className="commitment-item">
                        <CheckCircle2 size={16} className="commitment-check-icon" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="showcase-footer-hint">
                <Check size={14} className="footer-hint-check" />
                <span>ركيزة أساسية ملزمة لكافة أفراد الفريق القانوني والاستشاري لمِيثاق</span>
              </div>
            </div>
          </div>
        </div>

        {/* Institutional Code of Conduct Strip */}
        <div className="values-conduct-strip surface-card">
          <div className="conduct-strip-header">
            <div className="conduct-icon-box">
              <ScrollText size={22} />
            </div>
            <div className="conduct-titles">
              <h3 className="conduct-main-title">{VALUES_SECTION.codeOfConduct.title}</h3>
              <p className="conduct-sub">{VALUES_SECTION.codeOfConduct.subtitle}</p>
            </div>
          </div>

          <div className="conduct-grid">
            {VALUES_SECTION.codeOfConduct.principles.map((pr) => (
              <div key={pr.num} className="conduct-card">
                <div className="conduct-card-top">
                  <span className="conduct-roman gold-gradient-text-alt">{pr.num}</span>
                  <h4 className="conduct-label">{pr.label}</h4>
                </div>
                <p className="conduct-desc">{pr.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
