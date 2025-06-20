import React from 'react';
import './SectionHeading.css';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ title, subtitle, children }) => (
  <div className="section-heading-container">
    {/* <div className="section-heading-bar" /> */}
    <div>
      <div className="section-heading-title">{title}</div>
      {subtitle && <div className="section-heading-subtitle">{subtitle}</div>}
      {children}
    </div>
  </div>
);

export default SectionHeading; 