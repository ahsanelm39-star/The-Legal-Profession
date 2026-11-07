import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle2, ChevronLeft } from 'lucide-react';
import { METHODOLOGY_STEPS } from '../../constants/content';
import { SectionHeading } from '../ui/SectionHeading';
import './Methodology.css';

gsap.registerPlugin(ScrollTrigger);

export const Methodology: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.methodology-step-card', {
        scrollTrigger: {
          trigger: '.methodology-flow',
          start: 'top 75%',
        },
        opacity: 0,
        y: 40,
        duration: 0.9,
        stagger: 0.18,
        ease: 'power3.out',
      });

      gsap.from('.timeline-progress-bar', {
        scrollTrigger: {
          trigger: '.methodology-flow',
          start: 'top 80%',
          end: 'bottom 60%',
          scrub: 1,
        },
        scaleX: 1,
        transformOrigin: 'right center',
        ease: 'none',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="methodology" ref={sectionRef} className="section section-alt methodology-section">
      <div className="container">
        <SectionHeading
          badge="خارطة الإجراءات"
          title="منهجية عمل تبدأ بالفهم"
          highlight="وتنتهي بالوضوح"
          description="خطوات واضحة ومنضبطة تضمن معالجة المسألة القانونية بأعلى درجات الكفاءة والشفافية."
        />

        <div className="methodology-flow">
          <div className="timeline-track" aria-hidden="true">
            <div className="timeline-progress-bar" />
          </div>

          <div className="methodology-steps-grid">
            {METHODOLOGY_STEPS.map((step, idx) => (
              <div key={idx} className="methodology-step-card surface-card">
                <div className="step-badge-row">
                  <div className="step-counter-ring">
                    <span className="step-number">{step.step}</span>
                  </div>
                  <span className="step-subtitle">{step.subtitle}</span>
                </div>

                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>

                <div className="step-deliverables-box">
                  <span className="deliverables-heading">مخرجات هذه المرحلة:</span>
                  <ul className="deliverables-list">
                    {step.deliverables.map((item, itemIdx) => (
                      <li key={itemIdx} className="deliverable-item">
                        <CheckCircle2 size={14} className="deliv-icon" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {idx < METHODOLOGY_STEPS.length - 1 && (
                  <div className="step-connector-arrow" aria-hidden="true">
                    <ChevronLeft size={20} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
