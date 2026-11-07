import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpLeft, Phone } from 'lucide-react';
import { NAV_ITEMS, BRAND_INFO } from '../../constants/content';
import { Button } from '../ui/Button';
import './Header.css';

interface HeaderProps {
  onOpenConsultation: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenConsultation }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Track active section for nav highlight from the 6 navigation items
      const sections = NAV_ITEMS.map((item) => item.id);
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className={`site-header ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="container header-container">
        {/* Brand Logo */}
        <a href="#hero" className="brand-logo" aria-label="مِيثاق للمحاماة والاستشارات القانونية">
          <div className="logo-symbol" aria-hidden="true">
            <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
              <rect
                x="0.5"
                y="0.5"
                width="39"
                height="39"
                rx="8"
                stroke="url(#logoGoldGrad)"
                strokeWidth="1"
                fill="#0D1420"
              />
              <path
                d="M12 30V13C12 10.79 13.79 9 16 9H24C26.21 9 28 10.79 28 13V30"
                stroke="url(#logoGoldGrad)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M16 30V17C16 15.9 16.9 15 18 15H22C23.1 15 24 15.9 24 17V30"
                stroke="#D0B783"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="9"
                y1="30"
                x2="31"
                y2="30"
                stroke="url(#logoGoldGrad)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="20" cy="21" r="2" fill="#D0B783" />
              <defs>
                <linearGradient id="logoGoldGrad" x1="9" y1="9" x2="31" y2="31" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#F2F0E9" />
                  <stop offset="0.5" stopColor="#D0B783" />
                  <stop offset="1" stopColor="#B99A65" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="brand-titles">
            <span className="brand-name">{BRAND_INFO.name}</span>
            <span className="brand-subtitle">{BRAND_INFO.subtitle}</span>
          </div>
        </a>

        {/* Desktop Navigation — Exactly 6 items */}
        <nav className="desktop-nav" aria-label="القائمة الرئيسية">
          <ul className="nav-list">
            {NAV_ITEMS.map((item) => (
              <li key={item.id} className="nav-item">
                <a
                  href={item.href}
                  className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                >
                  {item.label}
                  {activeSection === item.id && <span className="active-dot" aria-hidden="true" />}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Header Action & Mobile Toggle */}
        <div className="header-actions">
          <div className="header-contact-quick">
            <a href={`tel:${BRAND_INFO.phone}`} className="quick-phone-link" aria-label="الاتصال بالمكتب">
              <Phone size={14} className="phone-icon" />
              <span className="quick-phone-text" dir="ltr">
                {BRAND_INFO.phone}
              </span>
            </a>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={onOpenConsultation}
            icon={<ArrowUpLeft size={16} />}
            iconPosition="end"
            className="header-cta-btn"
          >
            اطلب استشارة
          </Button>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu — Exactly 6 items */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`} aria-hidden={!mobileMenuOpen}>
        <div className="mobile-drawer-inner">
          <ul className="mobile-nav-list">
            {NAV_ITEMS.map((item) => (
              <li key={item.id} className="mobile-nav-item">
                <a
                  href={item.href}
                  className={`mobile-nav-link ${activeSection === item.id ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  <span>{item.label}</span>
                  <span className="link-arrow">←</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="mobile-drawer-footer">
            <Button
              variant="primary"
              fullWidth
              size="md"
              onClick={() => {
                closeMobileMenu();
                onOpenConsultation();
              }}
              icon={<ArrowUpLeft size={18} />}
              iconPosition="end"
            >
              اطلب استشارة
            </Button>

            <div className="mobile-drawer-contact">
              <span className="drawer-contact-title">للتواصل المباشر والاستفسارات:</span>
              <a href={`tel:${BRAND_INFO.phone}`} className="drawer-phone" dir="ltr">
                {BRAND_INFO.phone}
              </a>
              <span className="drawer-hours">{BRAND_INFO.workingHours}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
