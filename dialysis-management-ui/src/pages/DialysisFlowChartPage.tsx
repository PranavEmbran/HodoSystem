import React, { useState } from 'react';
import DialysisFlowChart from '../components/DialysisFlowChart';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SectionHeading from '../components/SectionHeading';
import { Row, Col } from 'react-bootstrap';

// const DialysisFlowChartPage: React.FC = () => {
// const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
// const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);
const DialysisFlowChartPage: React.FC<{ sidebarCollapsed: boolean; toggleSidebar: () => void }> = ({ sidebarCollapsed, toggleSidebar }) => {

  return (
    <div className={`dialysis-flow-chart-container ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <Header sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
      <div className="main-container">
        <div style={{ width: '100%', padding: '20px' }}>
          <SectionHeading title="Dialysis Flow Chart" subtitle="Visualize and manage dialysis flow charts" />
        </div>
        <DialysisFlowChart />
      </div>
      <Footer />
    </div>
  );
};

export default DialysisFlowChartPage; 