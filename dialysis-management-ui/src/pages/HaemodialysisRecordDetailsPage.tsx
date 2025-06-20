import React from 'react';
import HaemodialysisRecordDetails from '../components/HaemodialysisRecordDetails';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SectionHeading from '../components/SectionHeading';
import { Row, Col } from 'react-bootstrap';

const HaemodialysisRecordDetailsPage: React.FC<{ sidebarCollapsed: boolean; toggleSidebar: () => void }> = ({ sidebarCollapsed, toggleSidebar }) => {
  return (
    <div className={`haemodialysis-record-page-container ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <Header sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
      <div className="main-container">
        <div style={{ width: '100%', padding: '20px' }}>
          <SectionHeading title="Haemodialysis Record Details" subtitle="Detailed records for haemodialysis sessions" />
        </div>
      <HaemodialysisRecordDetails />
      </div>
      <Footer />
    </div>
  );
};

export default HaemodialysisRecordDetailsPage; 