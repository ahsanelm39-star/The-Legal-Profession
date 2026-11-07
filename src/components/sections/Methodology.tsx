import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { METHODOLOGY_CONTENT } from '../../constants/content';
import { Methodology3DScene } from '../three/Methodology3DScene';
import { SectionHeading } from '../ui/SectionHeading';
import './Methodology.css';

export const Methodology: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  return (
    <section id="methodology" className="section section-alt methodology-spatial-section">
      <div className="container">
        <SectionHeading
          badge="مسار الإنجاز والعمل"
          title={METHODOLOGY_CONTENT.heading}
          description={METHODOLOGY_CONTENT.introduction}
        />

        {/* Spatial Timeline + Connected 3D Sculpture */}
        <div className="methodology-spatial-layout">
          {/* Vertical Interactive Step Timeline */}
          <div className="methodology-timeline-col">
            <div className="timeline-steps-stack">
              {METHODOLOGY_CONTENT.stages.map((stage, idx) => {
                const isActive = activeStep === idx;
                const isPassed = activeStep > idx;

                return (
                  <div
                    key={stage.step}
                    className={`spatial-step-card surface-card ${isActive ? 'active' : ''} ${
                      isPassed ? 'passed' : ''
                    }`}
                    onClick={() => setActiveStep(idx)}
                  >
                    <div className="step-rail-indicator" aria-hidden="true">
                      <div className="rail-node">
                        <span className="rail-number">{stage.step}</span>
                      </div>
                      {idx < METHODOLOGY_CONTENT.stages.length - 1 && (
                        <div className="rail-connector" />
                      )}
                    </div>

                    <div className="step-card-content">
                      <div className="step-card-header">
                        <span className="step-stage-subtitle">{stage.subtitle}</span>
                        <h3 className="step-stage-title">{stage.title}</h3>
                      </div>

                      <p className="step-stage-desc">{stage.description}</p>

                      {/* Deliverables Drawer */}
                      <div className={`step-deliverables-drawer ${isActive ? 'expanded' : ''}`}>
                        <span className="deliverables-subheading">مخرجات المرحلة:</span>
                        <ul className="deliverables-checklist">
                          {stage.deliverables.map((d, dIdx) => (
                            <li key={dIdx} className="deliverable-item">
                              <CheckCircle2 size={15} className="d-icon" />
                              <span>{d}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Connected 3D Visualization Column */}
          <div className="methodology-3d-sticky-col">
            <div className="methodology-3d-frame surface-card">
              <div className="stage-live-indicator">
                <span className="live-dot" />
                <span>
                  المرحلة {METHODOLOGY_CONTENT.stages[activeStep].step} من 04 —{' '}
                  <strong className="gold-gradient-text-alt">
                    {METHODOLOGY_CONTENT.stages[activeStep].title}
                  </strong>
                </span>
              </div>

              <Methodology3DScene activeStep={activeStep} />

              <div className="step-navigation-pills">
                {METHODOLOGY_CONTENT.stages.map((stg, i) => (
                  <button
                    key={stg.step}
                    type="button"
                    className={`step-nav-pill ${activeStep === i ? 'active' : ''}`}
                    onClick={() => setActiveStep(i)}
                  >
                    {stg.step}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
