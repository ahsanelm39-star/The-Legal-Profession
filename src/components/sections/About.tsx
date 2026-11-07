import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle2, Shield, Compass, BookOpen } from 'lucide-react';
import { ABOUT_CONTENT } from '../../constants/content';
import { Badge } from '../ui/Badge';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

export const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-split-side', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
        opacity: 0,
        y: 40,
        duration: 1.1,
        stagger: 0.25,
        ease: 'power3.out',
      });

      gsap.from('.about-principle-item', {
        scrollTrigger: {
          trigger: '.about-principles-row',
          start: 'top 85%',
        },
        opacity: 0,
        x: -25,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="section about-section">
      <div className="container">
        {/* Editorial Split-Screen Composition */}
        <div className="about-editorial-split">
          {/* Right/Start Side: Oversized Arabic Statement & Visual Monolith */}
          <div className="about-split-side about-statement-side">
            <div className="about-badge-wrap">
              <Badge variant="gold" icon={<Compass size={14} />}>
                {ABOUT_CONTENT.badge}
              </Badge>
            </div>

            <h2 ref={headlineRef} className="about-oversized-statement">
              القانون يبدأ <br />
              <span className="gold-gradient-text">من فهم التفاصيل.</span>
            </h2>

            <div className="about-statement-divider" aria-hidden="true">
              <span className="divider-line" />
              <span className="divider-diamond" />
            </div>

            {/* Architectural Visual Monument */}
            <div className="about-monument-card surface-card">
              <div className="monument-glow" />
              <div className="monument-inner">
                <div className="monument-symbol-box">
                  <Shield size={32} className="monument-shield-icon" />
                  <span className="monument-year">تأسست على رصانة المنهج</span>
                </div>
                <p className="monument-caption">
                  "كل قضية مسار مستقل يتطلب تدقيقًا شاملاً للوقائع وصياغة استراتيجية مخصصة تحمي المصالح طويلة الأمد."
                </p>
              </div>
            </div>
          </div>

          {/* Left/End Side: Rich Supporting Narrative & 3 Institutional Principles */}
          <div ref={textColRef} className="about-split-side about-narrative-side">
            <div className="about-main-lead-box">
              <BookOpen size={24} className="lead-quote-icon" />
              <p className="about-main-lead">{ABOUT_CONTENT.mainParagraph}</p>
            </div>

            <p className="about-supporting-text">{ABOUT_CONTENT.supportingContent}</p>

            <div className="about-principles-wrapper">
              <span className="principles-section-tag">مرتكزات التعامل القانوني في مِيثاق:</span>

              <div className="about-principles-row">
                {ABOUT_CONTENT.principles.map((pr) => (
                  <div key={pr.number} className="about-principle-item">
                    <div className="principle-number-box">
                      <span className="principle-num">{pr.number}</span>
                    </div>
                    <div className="principle-content">
                      <h4 className="principle-title">{pr.title}</h4>
                      <p className="principle-desc">{pr.desc}</p>
                    </div>
                    <CheckCircle2 size={18} className="principle-check-icon" />
                  </div>
                ))}
              </div>
            </div>

            {/* Signature & Advisory Institutional Commitment */}
            <div className="about-commitment-card">
              <div className="commitment-text">
                <span className="commitment-title">التزام مؤسسي راسخ</span>
                <span className="commitment-sub">بالأمانة المهنية وحفظ أسرار الموكلين التامة</span>
              </div>
              <div className="commitment-seal" aria-hidden="true">
                <span>مِيثاق</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
