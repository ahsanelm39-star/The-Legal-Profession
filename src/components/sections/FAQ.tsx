import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plus, Minus, HelpCircle, ShieldCheck, CheckCircle2, MessageCircle } from 'lucide-react';
import { FAQ_SECTION } from '../../constants/content';
import { SectionHeading } from '../ui/SectionHeading';
import './FAQ.css';

gsap.registerPlugin(ScrollTrigger);

export const FAQ: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const sectionRef = useRef<HTMLElement>(null);

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const filteredItems = activeCategory === 'all'
    ? FAQ_SECTION.items
    : FAQ_SECTION.items.filter((item) => item.category === activeCategory);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section heading
      gsap.fromTo(
        '.faq-section .section-header',
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

      // Filter tabs
      gsap.fromTo(
        '.faq-filter-btn',
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.07,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
          scrollTrigger: {
            trigger: '.faq-category-filters',
            start: 'top 85%',
            once: true,
          },
        }
      );

      // FAQ accordion items
      gsap.fromTo(
        '.faq-luxury-item',
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.09,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
          scrollTrigger: {
            trigger: '.faq-accordion-wrapper',
            start: 'top 82%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="faq" ref={sectionRef} className="section section-alt faq-section">
      <div className="container">
        <SectionHeading
          badge={FAQ_SECTION.badge}
          title={FAQ_SECTION.heading}
          description={FAQ_SECTION.description}
        />

        {/* Category Filter Tabs */}
        <div className="faq-category-filters" role="tablist" aria-label="تصنيفات الأسئلة الشائعة">
          {FAQ_SECTION.categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat.id}
              className={`faq-filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span>{cat.label}</span>
              {activeCategory === cat.id && (
                <span className="filter-count">
                  {cat.id === 'all'
                    ? FAQ_SECTION.items.length
                    : FAQ_SECTION.items.filter((i) => i.category === cat.id).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Luxury Accordion */}
        <div className="faq-accordion-wrapper">
          {filteredItems.map((item, idx) => {
            const isOpen = openId === item.id;

            return (
              <div
                key={item.id}
                className={`faq-luxury-item surface-card ${isOpen ? 'active' : ''}`}
              >
                <button
                  type="button"
                  className="faq-luxury-btn"
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                >
                  <div className="faq-title-group">
                    <span className="faq-index-num">0{idx + 1}</span>
                    <HelpCircle size={18} className="faq-lead-icon" />
                    <span className="faq-q-title">{item.question}</span>
                  </div>

                  <div className="faq-toggle-circle" aria-hidden="true">
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </div>
                </button>

                <div
                  id={`faq-answer-${item.id}`}
                  className={`faq-luxury-panel ${isOpen ? 'expanded' : ''}`}
                >
                  <div className="faq-luxury-content">
                    <p className="faq-answer-paragraph">{item.answer}</p>
                    
                    {item.keyHighlight && (
                      <div className="faq-highlight-pill">
                        <CheckCircle2 size={15} className="highlight-icon" />
                        <span><strong>خلاصة الإجراء:</strong> {item.keyHighlight}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reassurance Footer */}
        <div className="faq-assurance-bar">
          <div className="assurance-info">
            <ShieldCheck size={20} className="assurance-icon" />
            <span>لديك استفسار خاص بطبيعة مسألتك أو ترغب في ترتيب اجتماع استشاري؟ فريقنا جاهز للتواصل المباشر.</span>
          </div>
          <a href="#contact" className="faq-contact-shortcut">
            <MessageCircle size={16} />
            <span>اطرح استفسارك الآن</span>
          </a>
        </div>
      </div>
    </section>
  );
};
