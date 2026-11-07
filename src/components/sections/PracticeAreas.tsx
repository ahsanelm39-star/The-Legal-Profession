import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Briefcase,
  FileText,
  Scale,
  Compass,
  Building2,
  ShieldCheck,
  ChevronDown,
  CheckCircle,
  ArrowUpLeft,
} from 'lucide-react';
import { PRACTICE_AREAS } from '../../constants/content';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import './PracticeAreas.css';

gsap.registerPlugin(ScrollTrigger);

interface PracticeAreasProps {
  onOpenConsultation: () => void;
}

export const PracticeAreas: React.FC<PracticeAreasProps> = ({ onOpenConsultation }) => {
  const [expandedArea, setExpandedArea] = useState<string | null>('commercial');
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.practice-card-item', {
        scrollTrigger: {
          trigger: '.practice-areas-grid',
          start: 'top 80%',
        },
        opacity: 0,
        y: 35,
        duration: 0.9,
        stagger: 0.14,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Briefcase':
        return <Briefcase size={26} />;
      case 'FileText':
        return <FileText size={26} />;
      case 'Scale':
        return <Scale size={26} />;
      case 'Compass':
        return <Compass size={26} />;
      case 'Building2':
        return <Building2 size={26} />;
      case 'ShieldCheck':
        return <ShieldCheck size={26} />;
      default:
        return <Scale size={26} />;
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedArea(expandedArea === id ? null : id);
  };

  return (
    <section id="services" ref={sectionRef} className="section section-alt practice-section">
      <div className="container">
        <SectionHeading
          badge="نطاق الاختصاص والممارسة"
          title="خدماتنا القانونية"
          highlight="المتخصصة"
          description="حلول قانونية واستشارية تغطي احتياجات الأفراد وقطاع الأعمال بأعلى درجات الدقة والمهنية."
        />

        <div className="practice-areas-grid">
          {PRACTICE_AREAS.map((area) => {
            const isExpanded = expandedArea === area.id;

            return (
              <div
                key={area.id}
                className={`practice-card-item surface-card ${area.featured ? 'featured-card' : ''} ${
                  isExpanded ? 'is-expanded' : ''
                }`}
              >
                <div className="practice-card-header">
                  <div className="practice-card-meta">
                    <span className="practice-number">{area.number}</span>
                    <div className="practice-icon-box">{getIcon(area.icon)}</div>
                  </div>
                  {area.featured && <span className="featured-chip">اختصاص رئيسي</span>}
                </div>

                <div className="practice-card-body">
                  <h3 className="practice-title">{area.title}</h3>
                  <p className="practice-short-desc">{area.shortDesc}</p>

                  {/* Expanded Detail Panel */}
                  <div className={`practice-expanded-content ${isExpanded ? 'show' : ''}`}>
                    <p className="practice-full-desc">{area.fullDesc}</p>

                    <div className="practice-key-services">
                      <span className="key-services-title">أبرز مجالات التمثيل والمباشرة:</span>
                      <ul className="key-services-list">
                        {area.keyServices.map((service, idx) => (
                          <li key={idx} className="key-service-item">
                            <CheckCircle size={15} className="service-bullet-icon" />
                            <span>{service}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="practice-expanded-action">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={onOpenConsultation}
                        icon={<ArrowUpLeft size={16} />}
                        iconPosition="end"
                      >
                        طلب استشارة في هذا المجال
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="practice-card-footer">
                  <button
                    type="button"
                    className="toggle-expand-btn"
                    onClick={() => toggleExpand(area.id)}
                    aria-expanded={isExpanded}
                  >
                    <span>{isExpanded ? 'إخفاء التفاصيل' : 'استعراض تفاصيل الخدمة'}</span>
                    <ChevronDown size={16} className={`chevron-icon ${isExpanded ? 'rotated' : ''}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
