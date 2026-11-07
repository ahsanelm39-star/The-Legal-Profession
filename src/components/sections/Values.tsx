import React, { useState } from 'react';
import { Shield, Target, Award } from 'lucide-react';
import { VALUES_SECTION } from '../../constants/content';
import { Values3DScene } from '../three/Values3DScene';
import { SectionHeading } from '../ui/SectionHeading';
import './Values.css';

export const Values: React.FC = () => {
  const [activeValueIndex, setActiveValueIndex] = useState<number>(0);
  const activeVal = VALUES_SECTION.values[activeValueIndex];

  const icons = [<Shield size={24} />, <Target size={24} />, <Award size={24} />];

  return (
    <section id="values" className="section section-alt values-sculptural-section">
      <div className="container">
        <SectionHeading
          badge="المبادئ التأسيسية"
          title={VALUES_SECTION.heading}
          description="ثلاث ركائز جوهرية تحكم بوصلتنا المهنية وتضمن أعلى درجات النزاهة والإتقان."
        />

        {/* Sculptural 3D Centerpiece with Interactive Value Selectors */}
        <div className="values-sculptural-layout">
          {/* Left/Start 3D Visualization */}
          <div className="values-3d-display-col">
            <div className="values-3d-card surface-card">
              <div className="sculpture-caption-tag">
                <span className="caption-dot" />
                <span>منحوتة مِيثاق الثلاثية التفاعلية — تدور لتسليط الضوء على القيمة المحددة</span>
              </div>
              <Values3DScene activeValueIndex={activeValueIndex} />
            </div>
          </div>

          {/* Right/End Interactive Value Narrative Cards */}
          <div className="values-content-col">
            <div className="values-nav-selector">
              {VALUES_SECTION.values.map((val, idx) => {
                const isActive = activeValueIndex === idx;
                return (
                  <button
                    key={val.id}
                    type="button"
                    className={`value-tab-btn ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveValueIndex(idx)}
                  >
                    <div className="value-tab-icon-wrap">{icons[idx]}</div>
                    <span className="value-tab-title">{val.title}</span>
                    <span className="value-tab-num">{val.number}</span>
                  </button>
                );
              })}
            </div>

            {/* Expansive Active Value Card */}
            <div className="value-active-showcase surface-card">
              <div className="showcase-header">
                <div className="showcase-icon-box">{icons[activeValueIndex]}</div>
                <div className="showcase-titles">
                  <span className="showcase-num-tag">{activeVal.number}</span>
                  <h3 className="showcase-title">{activeVal.title}</h3>
                </div>
              </div>

              <p className="showcase-core-statement">{activeVal.description}</p>
              <div className="showcase-divider" />
              <p className="showcase-extended-text">{activeVal.extended}</p>

              <div className="showcase-footer-hint">
                <span>ركيزة أساسية ملزمة لكافة أفراد الفريق القانوني لمِيثاق</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
