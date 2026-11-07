import React from 'react';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  href,
  icon,
  iconPosition = 'start',
  fullWidth = false,
  className = '',
  children,
  ...props
}) => {
  const classNames = `btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''} ${className}`.trim();

  const content = (
    <>
      {icon && iconPosition === 'start' && <span className="btn-icon btn-icon-start">{icon}</span>}
      <span className="btn-text">{children}</span>
      {icon && iconPosition === 'end' && <span className="btn-icon btn-icon-end">{icon}</span>}
      <span className="btn-glow" aria-hidden="true" />
    </>
  );

  if (href) {
    return (
      <a href={href} className={classNames}>
        {content}
      </a>
    );
  }

  return (
    <button className={classNames} {...props}>
      {content}
    </button>
  );
};
