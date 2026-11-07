import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CORE_VALUES } from '../../constants/content';
import { SectionHeading } from '../ui/SectionHeading';
import './Values.css';

gsap.registerPlugin(ScrollTrigger);

export const Values: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.value-editorial-card', {
        scrollTrigger: {
          trigger: '.values-editorial-grid',
          start: 'top 75%',
        },
        opacity: 0,
        y: 40,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="values" ref={sectionRef} className="section section-alt values-section">
      <div className="container">
        <SectionHeading
          badge="القيم الجوهرية"
          title="نؤمن بأن التفاصيل"
          highlight="تصنع الفارق"
          description="ثلاث ركائز ثابتة تحكم سلوكنا المهني وتضمن تفوق المعالجة القانونية في أصعب القضايا."
        />

        <div className="values-editorial-grid">
          {CORE_VALUES.map((val) => (
            <div key={val.id} className="value-editorial-card surface-card">
              <div className="value-card-watermark" aria-hidden="true">
                {val.number}
              </div>

              <div className="value-card-header">
                <span className="value-number-tag">{val.number}</span>
                <div className="value-accent-line" />
              </div>

              <h3 className="value-title">{val.title}</h3>
              <p className="value-description">{val.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
