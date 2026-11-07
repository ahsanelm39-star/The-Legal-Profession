import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Award } from 'lucide-react';
import { TEAM_SECTION } from '../../constants/content';
import { SectionHeading } from '../ui/SectionHeading';
import './Team.css';

gsap.registerPlugin(ScrollTrigger);

export const Team: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.team-editorial-item', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
        opacity: 0,
        y: 35,
        duration: 0.95,
        stagger: 0.18,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const featuredMember = TEAM_SECTION.profiles.find((p) => p.isFeatured) || TEAM_SECTION.profiles[0];
  const secondaryMembers = TEAM_SECTION.profiles.filter((p) => !p.isFeatured);

  return (
    <section id="team" ref={sectionRef} className="section team-section">
      <div className="container">
        <SectionHeading
          badge="الكوادر والقيادات الاستشارية"
          title={TEAM_SECTION.heading}
          description={TEAM_SECTION.supporting}
        />

        {/* Asymmetrical Editorial Grid */}
        <div className="team-asymmetrical-grid">
          {/* Prominent Featured Leadership Profile (Spans full height or 1.3fr) */}
          <div className="team-editorial-item team-featured-profile surface-card">
            <div className="featured-portrait-block">
              <div className="featured-monogram-shield">
                <span className="featured-initials">{featuredMember.initials}</span>
                <div className="shield-corner top-left" aria-hidden="true" />
                <div className="shield-corner bottom-right" aria-hidden="true" />
              </div>

              <div className="featured-badge-tag">
                <Award size={14} />
                <span>القيادة والإشراف العام</span>
              </div>
            </div>

            <div className="featured-info-block">
              <div className="featured-title-wrap">
                <h3 className="featured-name">{featuredMember.name}</h3>
                <span className="featured-role">{featuredMember.role}</span>
                <span className="featured-spec">{featuredMember.specialization}</span>
              </div>

              <p className="featured-bio">{featuredMember.bio}</p>

              <div className="featured-focus-box">
                <span className="focus-box-label">مجالات التركيز والمباشرة:</span>
                <div className="featured-tags-row">
                  {featuredMember.focusAreas.map((f, i) => (
                    <span key={i} className="focus-pill">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Profiles Column (Stacked in an elegant vertical grid) */}
          <div className="team-secondary-column">
            {secondaryMembers.map((member) => (
              <div key={member.id} className="team-editorial-item team-secondary-profile surface-card">
                <div className="secondary-avatar-box">
                  <span className="secondary-initials">{member.initials}</span>
                </div>

                <div className="secondary-info-box">
                  <div className="secondary-titles">
                    <h4 className="secondary-name">{member.name}</h4>
                    <span className="secondary-role">{member.role}</span>
                    <span className="secondary-spec">{member.specialization}</span>
                  </div>

                  <p className="secondary-bio">{member.bio}</p>

                  <div className="secondary-tags-wrap">
                    {member.focusAreas.map((f, i) => (
                      <span key={i} className="secondary-tag">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Advisory Placeholder Disclaimer Notice */}
        <div className="team-institutional-notice">
          <Sparkles size={16} className="notice-icon" />
          <p className="notice-text">
            بيانات استرشادية: الأسماء والمسميات الوظيفية المعروضة أعلاه تمثل هيكل العمل الاستشاري
            للمؤسسة، وتخضع للتحديث الدوري وفق سجلات المزاولة والتراخيص النظامية المعتمدة.
          </p>
        </div>
      </div>
    </section>
  );
};
