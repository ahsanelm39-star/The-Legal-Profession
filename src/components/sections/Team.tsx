import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield, Sparkles } from 'lucide-react';
import { TEAM_MEMBERS } from '../../constants/content';
import { SectionHeading } from '../ui/SectionHeading';
import './Team.css';

gsap.registerPlugin(ScrollTrigger);

export const Team: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.team-profile-card', {
        scrollTrigger: {
          trigger: '.team-cards-grid',
          start: 'top 80%',
        },
        opacity: 0,
        y: 35,
        duration: 0.9,
        stagger: 0.16,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="team" ref={sectionRef} className="section team-section">
      <div className="container">
        <SectionHeading
          badge="الكوادر التخصصية"
          title="خبرات قانونية"
          highlight="برؤية متكاملة"
          description="نخبة من المستشارين والمتخصصين يجمعون بين المعرفة الأكاديمية والخبرة الميدانية في إدارة الملفات المعقدة."
        />

        <div className="team-cards-grid">
          {TEAM_MEMBERS.map((member) => (
            <div key={member.id} className="team-profile-card surface-card">
              {/* Portrait & Initials Area */}
              <div className="team-portrait-area">
                <div className="portrait-backdrop-glow" />
                <div className="portrait-monogram-shield">
                  <span className="portrait-initials">{member.initials}</span>
                </div>
                <div className="portrait-verified-tag">
                  <Shield size={12} className="tag-shield-icon" />
                  <span>مستشار استراتيجي</span>
                </div>
              </div>

              {/* Bio & Details */}
              <div className="team-details-area">
                <h3 className="team-member-name">{member.name}</h3>
                <span className="team-member-role">{member.role}</span>
                <span className="team-member-spec">{member.specialization}</span>

                <p className="team-member-bio">{member.bio}</p>

                <div className="team-focus-tags">
                  {member.focusAreas.map((focus, idx) => (
                    <span key={idx} className="team-focus-tag">
                      {focus}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Institutional Placeholder Disclosure Notice */}
        <div className="team-notice-box">
          <Sparkles size={16} className="notice-icon" />
          <p className="notice-text">
            ملاحظة تنظيمية: الأسماء والمسميات المعروضة أعلاه تمثل نماذج استرشادية للهيكل القيادي
            والتخصصي للمؤسسة، وسيتم تحديثها بالبيانات الرسمية للمحامين المرخصين وفق سجلات الهيئة السعودية
            للمحامين عند الإطلاق النهائي.
          </p>
        </div>
      </div>
    </section>
  );
};
