import React from 'react';
import { Badge } from './Badge';
import './SectionHeading.css';

interface SectionHeadingProps {
  badge?: string;
  title: string;
  highlight?: string;
  description?: string;
  align?: 'center' | 'start';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  title,
  highlight,
  description,
  align = 'center',
  className = '',
}) => {
  return (
    <div className={`section-header section-header-${align} ${className}`.trim()}>
      {badge && (
        <div className="section-badge-wrapper">
          <Badge variant="gold">{badge}</Badge>
        </div>
      )}
      
      <h2 className="section-title">
        {title} {highlight && <span className="gold-gradient-text">{highlight}</span>}
      </h2>

      <div className="section-accent-line" aria-hidden="true">
        <span className="accent-dot" />
      </div>

      {description && <p className="section-description">{description}</p>}
    </div>
  );
};
