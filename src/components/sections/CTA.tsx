import React from 'react';
import { ArrowUpLeft, MessageSquare, PhoneCall, Shield } from 'lucide-react';
import { FINAL_CTA, BRAND_INFO } from '../../constants/content';
import { Button } from '../ui/Button';
import './CTA.css';

interface CTAProps {
  onOpenConsultation: () => void;
}

export const CTA: React.FC<CTAProps> = ({ onOpenConsultation }) => {
  return (
    <section className="section cta-monument-section">
      <div className="container">
        <div className="cta-monument-frame">
          <div className="cta-ambient-glow" aria-hidden="true" />
          <div className="cta-hairline-grid" aria-hidden="true" />

          {/* Architectural Framing Corners */}
          <div className="cta-corner top-right" aria-hidden="true" />
          <div className="cta-corner bottom-left" aria-hidden="true" />

          <div className="cta-monument-content">
            <div className="cta-badge-pill">
              <Shield size={14} />
              <span>جاهزية استشارية متكاملة</span>
            </div>

            <h2 className="cta-monument-heading">
              لأن القرارات المهمة <br />
              <span className="gold-gradient-text">تستحق رؤية واضحة.</span>
            </h2>

            <p className="cta-monument-supporting">{FINAL_CTA.supporting}</p>

            <div className="cta-actions-cluster">
              <Button
                variant="primary"
                size="lg"
                onClick={onOpenConsultation}
                icon={<ArrowUpLeft size={18} />}
                iconPosition="end"
              >
                
                {FINAL_CTA.buttonText}
              </Button>

              <Button
                variant="secondary"
                size="lg"
                href="#contact"
                icon={<MessageSquare size={18} />}
              >
                نموذج الاستفسار المباشر
              </Button>
            </div>

            <div className="cta-direct-line">
              <PhoneCall size={16} className="direct-phone-icon" />
              <span>
                للحالات المستعجلة والتنسيق المباشر: <strong dir="ltr">{BRAND_INFO.phone}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
