import React from 'react';
import './Card.css';

const Card = ({ 
  children, 
  title,
  subtitle,
  actions,
  hover = false,
  padding = 'md',
  className = '',
  onClick,
  ...props 
}) => {
  const cardClasses = [
    'card',
    hover ? 'card-hover' : '',
    onClick ? 'card-clickable' : '',
    `card-padding-${padding}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} onClick={onClick} {...props}>
      {(title || actions) && (
        <div className="card-header">
          <div className="card-header-content">
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="card-actions">{actions}</div>}
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
    </div>
  );
};

export default Card;
