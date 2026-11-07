import React, { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { FAQ_ITEMS } from '../../constants/content';
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
          badge="الوضوح الإجرائي"
          title="أسئلة يهمك"
          highlight="معرفتها"
          description="إجابات واضحة ومباشرة عن أبرز التساؤلات المتعلقة بآليات طلب الخدمة والتواصل والمتابعة."
        />

        <div className="faq-accordion-wrapper">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;

            return (
              <div
                key={item.id}
                className={`faq-item-card surface-card ${isOpen ? 'active' : ''}`}
              >
                <button
                  type="button"
                  className="faq-question-btn"
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                >
                  <div className="faq-question-text-row">
                    <HelpCircle size={18} className="faq-help-icon" />
                    <span className="faq-question-title">{item.question}</span>
                  </div>

                  <div className="faq-icon-indicator" aria-hidden="true">
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                  </div>
                </button>

                <div
                  id={`faq-answer-${item.id}`}
                  className={`faq-answer-panel ${isOpen ? 'expanded' : ''}`}
                >
                  <p className="faq-answer-text">{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
