import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  CheckCircle2,
  Shield,
  Compass,
  BookOpen,
  Eye,
  Target,
  Scale,
  Sparkles,
} from 'lucide-react';
import { ABOUT_CONTENT } from '../../constants/content';
import { Badge } from '../ui/Badge';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

export const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.about-split-side',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          stagger: 0.25,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '.about-card-animate',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.15,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '.about-principle-item',
        { opacity: 0, x: -25 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            once: true,
          },
        }
      );
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
                  <span className="monument-year">رصانة المنهج وعمق التحليل</span>
                </div>
                <p className="monument-caption">
                  "كل قضية مسار مستقل يتطلب تدقيقًا شاملاً للوقائع وصياغة استراتيجية مخصصة تحمي المصالح وتستشرف النتائج."
                </p>
              </div>
            </div>

            {/* Vision and Mission Strategic Cards */}
            <div className="about-vision-mission-grid">
              <div className="about-vm-card about-card-animate surface-card">
                <div className="vm-card-header">
                  <div className="vm-icon-wrap">
                    <Eye size={20} className="vm-icon" />
                  </div>
                  <h4 className="vm-title">{ABOUT_CONTENT.vision.title}</h4>
                </div>
                <p className="vm-statement">{ABOUT_CONTENT.vision.statement}</p>
              </div>

              <div className="about-vm-card about-card-animate surface-card">
                <div className="vm-card-header">
                  <div className="vm-icon-wrap">
                    <Target size={20} className="vm-icon" />
                  </div>
                  <h4 className="vm-title">{ABOUT_CONTENT.mission.title}</h4>
                </div>
                <p className="vm-statement">{ABOUT_CONTENT.mission.statement}</p>
              </div>
            </div>
          </div>

          {/* Left/End Side: Rich Supporting Narrative & 5 Philosophy Pillars & 4 Working Steps */}
          <div className="about-split-side about-narrative-side">
            {/* 1. Institutional Introduction */}
            <div className="about-main-lead-box">
              <BookOpen size={24} className="lead-quote-icon" />
              <div className="lead-text-group">
                <p className="about-main-lead">{ABOUT_CONTENT.introLead}</p>
                <p className="about-sub-lead">{ABOUT_CONTENT.mainParagraph}</p>
              </div>
            </div>

            <p className="about-supporting-text">{ABOUT_CONTENT.supportingContent}</p>

            {/* 2. Professional Philosophy Pillars (5 Pillars) */}
            <div className="about-principles-wrapper">
              <div className="principles-header-wrap">
                <Scale size={18} className="principles-icon" />
                <span className="principles-section-tag">{ABOUT_CONTENT.philosophy.title}</span>
              </div>
              <p className="principles-intro-caption">{ABOUT_CONTENT.philosophy.description}</p>

              <div className="about-principles-row">
                {ABOUT_CONTENT.philosophy.pillars.map((pillar, idx) => (
                  <div key={pillar.id} className="about-principle-item">
                    <div className="principle-number-box">
                      <span className="principle-num">0{idx + 1}</span>
                    </div>
                    <div className="principle-content">
                      <h4 className="principle-title">{pillar.title}</h4>
                      <p className="principle-desc">{pillar.desc}</p>
                    </div>
                    <CheckCircle2 size={18} className="principle-check-icon" />
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Working Philosophy (4 Operational Steps) */}
            <div className="about-methodology-strip surface-card">
              <div className="methodology-strip-header">
                <Sparkles size={18} className="strip-sparkle" />
                <h4 className="methodology-strip-title">{ABOUT_CONTENT.workingMethodology.title}</h4>
              </div>

              <div className="methodology-steps-mini-grid">
                {ABOUT_CONTENT.workingMethodology.steps.map((step) => (
                  <div key={step.number} className="mini-step-item">
                    <div className="mini-step-top">
                      <span className="mini-step-num">{step.number}</span>
                      <h5 className="mini-step-title">{step.title}</h5>
                    </div>
                    <p className="mini-step-desc">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Signature & Advisory Institutional Commitment */}
            <div className="about-commitment-card">
              <div className="commitment-text">
                <span className="commitment-title">التزام مؤسسي راسخ</span>
                <span className="commitment-sub">بالأمانة المهنية وحفظ أسرار الموكلين التامة في كافة مراحل التكليف</span>
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
