import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowUpLeft, Shield, Award, CheckCircle2 } from 'lucide-react';
import { Hero3DScene } from '../three/Hero3DScene';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import './Hero.css';

interface HeroProps {
  onOpenConsultation: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenConsultation }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.hero-badge-anim', {
        opacity: 0,
        y: -15,
        duration: 0.8,
        delay: 0.2,
      })
        .from(
          '.hero-title-line',
          {
            opacity: 0,
            y: 35,
            duration: 1.1,
            stagger: 0.18,
          },
          '-=0.4'
        )
        .from(
          '.hero-paragraph',
          {
            opacity: 0,
            y: 20,
            duration: 0.9,
          },
          '-=0.6'
        )
        .from(
          '.hero-cta-group',
          {
            opacity: 0,
            y: 20,
            duration: 0.8,
          },
          '-=0.5'
        )
        .from(
          '.hero-highlight-chips',
          {
            opacity: 0,
            y: 15,
            duration: 0.7,
            stagger: 0.12,
          },
          '-=0.4'
        )
        .from(
          sceneRef.current,
          {
            opacity: 0,
            scale: 0.94,
            duration: 1.4,
            ease: 'power2.out',
          },
          0.3
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" ref={heroRef} className="hero-section">
      <div className="hero-atmospheric-glow" aria-hidden="true" />

      <div className="container hero-container">
        {/* Text & Content Column (50%) */}
        <div ref={contentRef} className="hero-content-col">
          <div className="hero-badge-anim">
            <Badge variant="gold" size="md" icon={<Shield size={14} />}>
              مِيثاق للمحاماة والاستشارات القانونية
            </Badge>
          </div>

          <h1 ref={headlineRef} className="hero-headline">
            <span className="hero-title-line">حين تكون التفاصيل فارقة،</span>
            <span className="hero-title-line gold-gradient-text">تبدأ قوة الموقف.</span>
          </h1>

          <p className="hero-paragraph">
            نقدم خدمات قانونية واستشارية تقوم على الفهم العميق، والدراسة الدقيقة، والرؤية الاستراتيجية،
            لنكون شريكًا موثوقًا في حماية المصالح ومواجهة التحديات القانونية المعقدة بأعلى معايير الانضباط.
          </p>

          <div className="hero-cta-group">
            <Button
              variant="primary"
              size="lg"
              onClick={onOpenConsultation}
              icon={<ArrowUpLeft size={18} />}
              iconPosition="end"
            >
              اطلب استشارة قانونية
            </Button>

            <Button variant="secondary" size="lg" href="#services">
              اكتشف خدماتنا
            </Button>
          </div>

          <div className="hero-supporting-quote">
            <p className="supporting-quote-text">
              "رؤية قانونية معاصرة، تقوم على الثقة والدقة والاحتراف المؤسسي طويل الأمد."
            </p>
          </div>

          <div className="hero-highlight-chips">
            <div className="highlight-chip">
              <CheckCircle2 size={16} className="chip-icon" />
              <span>فهم دقيق للبيئة الاستثمارية والتنظيمية</span>
            </div>
            <div className="highlight-chip">
              <Award size={16} className="chip-icon" />
              <span>صرامة تحليلية وسرية مهنية مشددة</span>
            </div>
          </div>
        </div>

        {/* 3D Scene Column (50%) */}
        <div ref={sceneRef} className="hero-scene-col">
          <div className="scene-frame-corner top-right" aria-hidden="true" />
          <div className="scene-frame-corner bottom-left" aria-hidden="true" />
          <Hero3DScene />
          <div className="scene-caption-badge">
            <span className="scene-caption-dot" />
            <span>مجسم مِيثاق المعماري التفاعلي — تفاعل بالماوس والتمرير</span>
          </div>
        </div>
      </div>

      <div className="hero-scroll-indicator" aria-hidden="true">
        <a href="#positioning" className="scroll-indicator-link">
          <span className="scroll-wheel" />
          <span className="scroll-text">مرر للاستكشاف</span>
        </a>
      </div>
    </section>
  );
};
