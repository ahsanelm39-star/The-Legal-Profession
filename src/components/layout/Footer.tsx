import React from 'react';
import { ArrowUp, Phone, Mail, MapPin, Clock, ShieldCheck, Scale } from 'lucide-react';
import { BRAND_INFO, NAV_ITEMS, PRACTICE_AREAS } from '../../constants/content';
import './Footer.css';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="site-footer">
      <div className="footer-top-accent" aria-hidden="true" />

      <div className="container footer-container">
        {/* Main Columns Grid */}
        <div className="footer-grid">
          {/* Col 1: Brand & Philosophy */}
          <div className="footer-col footer-col-brand">
            <div className="footer-brand-header">
              <div className="footer-logo-symbol" aria-hidden="true">
                <Scale size={28} className="footer-scale-icon" />
              </div>
              <div className="footer-brand-titles">
                <span className="footer-brand-name">{BRAND_INFO.name}</span>
                <span className="footer-brand-subtitle">{BRAND_INFO.subtitle}</span>
              </div>
            </div>

            <p className="footer-brand-desc">{BRAND_INFO.description}</p>

            <div className="footer-trust-badge">
              <ShieldCheck size={18} className="trust-icon" />
              <span>مؤسسة مهنية مرخصة وملتزمة بأصول وتقاليد مهنة المحاماة</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">خريطة المنصة</h4>
            <ul className="footer-links-list">
              {NAV_ITEMS.map((item) => (
                <li key={item.id} className="footer-link-item">
                  <a href={item.href} className="footer-link">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Practice Areas */}
          <div className="footer-col">
            <h4 className="footer-col-title">المجالات القانونية</h4>
            <ul className="footer-links-list">
              {PRACTICE_AREAS.map((area) => (
                <li key={area.id} className="footer-link-item">
                  <a href="#services" className="footer-link">
                    {area.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact & Location */}
          <div className="footer-col footer-col-contact">
            <h4 className="footer-col-title">المقر والتواصل</h4>
            <div className="footer-contact-details">
              <div className="footer-contact-row">
                <MapPin size={18} className="contact-icon" />
                <span className="contact-text">{BRAND_INFO.address}</span>
              </div>

              <div className="footer-contact-row">
                <Phone size={18} className="contact-icon" />
                <a href={`tel:${BRAND_INFO.phone}`} className="contact-link" dir="ltr">
                  {BRAND_INFO.phone}
                </a>
              </div>

              <div className="footer-contact-row">
                <Mail size={18} className="contact-icon" />
                <a href={`mailto:${BRAND_INFO.email}`} className="contact-link" dir="ltr">
                  {BRAND_INFO.email}
                </a>
              </div>

              <div className="footer-contact-row">
                <Clock size={18} className="contact-icon" />
                <span className="contact-text">{BRAND_INFO.workingHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="footer-disclaimer-box">
          <p className="footer-disclaimer-text">{BRAND_INFO.disclaimer}</p>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <p className="footer-copyright">{BRAND_INFO.copyright}</p>

          <button onClick={scrollToTop} className="back-to-top-btn" aria-label="العودة لأعلى الصفحة">
            <span>العودة للأعلى</span>
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
};
