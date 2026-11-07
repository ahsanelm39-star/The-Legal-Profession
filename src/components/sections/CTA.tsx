import React from 'react';
import { ArrowUpLeft, MessageSquare, PhoneCall } from 'lucide-react';
import { Button } from '../ui/Button';
import './CTA.css';

interface CTAProps {
  onOpenConsultation: () => void;
}

export const CTA: React.FC<CTAProps> = ({ onOpenConsultation }) => {
  return (
    <section className="section cta-section">
      <div className="container">
        <div className="cta-banner-wrapper">
          <div className="cta-glow-element" aria-hidden="true" />
          <div className="cta-grid-lines" aria-hidden="true" />

          <div className="cta-content-box">
            <span className="cta-eyebrow">الاستجابة والاستعداد</span>

            <h2 className="cta-headline">
              خطوتك القانونية تبدأ <span className="gold-gradient-text">بحوار واضح.</span>
            </h2>

            <p className="cta-supporting">
              تواصل معنا لمناقشة احتياجاتك والتعرف على المسار المناسب لتقديم الدعم القانوني، مع ضمان
              السرية التامة والموضوعية في تقييم الموقف.
            </p>

            <div className="cta-actions-group">
              <Button
                variant="primary"
                size="lg"
                onClick={onOpenConsultation}
                icon={<ArrowUpLeft size={18} />}
                iconPosition="end"
              >
                تواصل معنا الآن
              </Button>

              <Button
                variant="secondary"
                size="lg"
                href="#contact"
                icon={<MessageSquare size={18} />}
              >
                تعبئة نموذج الاستفسار
              </Button>
            </div>

            <div className="cta-direct-call-hint">
              <PhoneCall size={15} className="hint-icon" />
              <span>أو اتصل مباشرة بفريق التنسيق: <strong dir="ltr">+966 11 000 0000</strong></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
