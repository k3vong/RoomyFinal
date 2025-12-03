import React from 'react';
import './PageLayout.css';

const PageLayout = ({ 
  children,
  title,
  subtitle,
  actions,
  maxWidth = 'xl',
  className = ''
}) => {
  const layoutClasses = [
    'page-layout',
    `page-layout-${maxWidth}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={layoutClasses}>
      {(title || subtitle || actions) && (
        <div className="page-header">
          <div className="page-header-content">
            {title && <h1 className="page-title">{title}</h1>}
            {subtitle && <p className="page-subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="page-actions">{actions}</div>}
        </div>
      )}
      <div className="page-content">
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
