import React, { useState } from 'react';
import { Plus, Minus, HelpCircle, ShieldCheck } from 'lucide-react';
import { FAQ_SECTION } from '../../constants/content';
import { SectionHeading } from '../ui/SectionHeading';
import './FAQ.css';

export const FAQ: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="section section-alt faq-section">
      <div className="container">
        <SectionHeading
          badge="الشفافية والتوضيح"
          title={FAQ_SECTION.heading}
          description="إجابات مباشرة ومفصلة عن آليات التواصل والتعاقد وتقديم الرأي القانوني في مِيثاق."
        />

        <div className="faq-accordion-wrapper">
          {FAQ_SECTION.items.map((item) => {
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
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reassurance Footer */}
        <div className="faq-assurance-bar">
          <ShieldCheck size={18} className="assurance-icon" />
          <span>لديك استفسار خاص بطبيعة مسألتك؟ فريقنا القانوني جاهز للإجابة عبر قنوات الاتصال الرسمية.</span>
        </div>
      </div>
    </section>
  );
};
