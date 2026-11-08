import React, { useState, useRef, useCallback } from 'react';
import {
  Briefcase,
  FileText,
  Scale,
  Compass,
  Building2,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { SERVICES_SECTION, PRACTICE_AREAS } from '../../constants/content';
import { Services3DScene } from '../three/Services3DScene';
import { SectionHeading } from '../ui/SectionHeading';
import './PracticeAreas.css';

interface PracticeAreasProps {
  onOpenConsultation: () => void;
}

export const PracticeAreas: React.FC<PracticeAreasProps> = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const activeService = PRACTICE_AREAS[activeIndex];
  const panelRef = useRef<HTMLDivElement>(null);

  const handleServiceSelect = useCallback((idx: number) => {
    setActiveIndex(idx);
    // On mobile: scroll the detail panel into view smoothly after state update
    if (window.innerWidth <= 1100 && panelRef.current) {
      setTimeout(() => {
        panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 60);
    }
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Briefcase':
        return <Briefcase size={20} />;
      case 'FileText':
        return <FileText size={20} />;
      case 'Scale':
        return <Scale size={20} />;
      case 'Compass':
        return <Compass size={20} />;
      case 'Building2':
        return <Building2 size={20} />;
      case 'ShieldCheck':
        return <ShieldCheck size={20} />;
      default:
        return <Scale size={20} />;
    }
  };

  return (
    <section id="services" className="section section-alt services-section">
      <div className="container">
        <SectionHeading
          badge="نطاق الممارسة القانونية"
          title={SERVICES_SECTION.heading}
          description={SERVICES_SECTION.supporting}
        />

        {/* Interactive Master-Detail Layout with 3D Object */}
        <div className="services-interactive-container">
          {/* 1. Disciplines Selector List (Horizontal on mobile, vertical column on desktop) */}
          <div className="services-selector-column">
            <span className="selector-column-title">مجالات الممارسة المتخصصة:</span>
            <div className="services-tab-list" role="tablist">
              {PRACTICE_AREAS.map((item, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`service-tab-button ${isActive ? 'active' : ''}`}
                    onClick={() => handleServiceSelect(idx)}
                  >
                    <div className="tab-number-badge">
                      <span className="tab-num">{item.number}</span>
                    </div>

                    <div className="tab-info">
                      <span className="tab-title">{item.title}</span>
                    </div>

                    <div className="tab-icon-wrap" aria-hidden="true">
                      {getIcon(item.icon)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Expansive Active Service Detail Content & Three.js 3D Visualization */}
          <div ref={panelRef} className="services-presentation-panel surface-card">
            <div className="presentation-content-area">
              <div className="presentation-header">
                <div className="presentation-meta">
                  <span className="presentation-number gold-gradient-text-alt">
                    {activeService.number}
                  </span>
                  <div className="presentation-icon-box">
                    {getIcon(activeService.icon)}
                  </div>
                </div>
                <h3 className="presentation-title">{activeService.title}</h3>
              </div>

              <p className="presentation-lead">{activeService.shortDesc}</p>
              <p className="presentation-body">{activeService.fullDesc}</p>

              <div className="presentation-scope-box">
                <span className="scope-title">نطاق التكليف والتمثيل المباشر:</span>
                <ul className="scope-list">
                  {activeService.keyServices.map((service, idx) => (
                    <li key={idx} className="scope-item">
                      <CheckCircle2 size={16} className="scope-check-icon" />
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="presentation-action-row">
                
              </div>
            </div>

            {/* 3D Visualization for the Selected Service */}
            <div className="presentation-3d-area">
              <div className="three-view-caption">
                <span className="caption-pulse-dot" />
                <span>المجسم السداسي للمجالات — يدور تلقائيًا مع اختيار التخصص</span>
              </div>
              <Services3DScene activeServiceIndex={activeIndex} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
