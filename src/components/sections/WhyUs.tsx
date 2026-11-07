import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check } from 'lucide-react';
import { WHY_CHOOSE_US } from '../../constants/content';
import { SectionHeading } from '../ui/SectionHeading';
import './WhyUs.css';

gsap.registerPlugin(ScrollTrigger);

export const WhyUs: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.why-us-card', {
        scrollTrigger: {
          trigger: '.why-us-grid',
          start: 'top 80%',
        },
        opacity: 0,
        y: 40,
        duration: 0.9,
        stagger: 0.16,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="why-us" ref={sectionRef} className="section why-us-section">
      <div className="container">
        <SectionHeading
          badge="الركائز التأسيسية"
          title="ما الذي يميز نهج"
          highlight="مِيثاق؟"
          description="لا نعتمد الحلول الجاهزة؛ بل نبتكر استراتيجيات قانونية متكاملة تصمد أمام الفحص القضائي والتحديات العملية."
        />

        <div className="why-us-grid">
          {WHY_CHOOSE_US.map((item) => (
            <div key={item.id} className="why-us-card surface-card">
              <div className="why-us-card-header">
                <span className="why-us-number gold-gradient-text-alt">{item.number}</span>
                <span className="why-us-bar" aria-hidden="true" />
              </div>

              <h3 className="why-us-title">{item.title}</h3>
              <p className="why-us-desc">{item.description}</p>

              <div className="why-us-details-box">
                <ul className="why-us-details-list">
                  {item.details.map((detail, idx) => (
                    <li key={idx} className="why-us-detail-item">
                      <div className="detail-check-dot">
                        <Check size={12} />
                      </div>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
