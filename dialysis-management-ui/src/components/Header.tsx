import React, { useState, useEffect } from 'react';
import './Header.css';
import { ChevronLeftIcon, ChevronRightIcon } from '@primer/octicons-react';
import { Calendar, Clock, Calculator } from 'lucide-react';
import { FaCalculator, FaCalendarAlt, FaClock } from 'react-icons/fa';

interface HeaderProps {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarCollapsed, toggleSidebar }) => {
    const [currentTime, setCurrentTime] = useState<Date>(new Date());

    const currentDate: string = new Date().toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    const formattedTime: string = currentTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        // Cleanup timer on component unmount
        return () => clearInterval(timer);
    }, []);

    return (
        <div className='header-container'>
            <button
                className="sidebar-toggle-btn"
                onClick={toggleSidebar}
                title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
                <img
                    src="/lefthand.png"
                    alt="Toggle Sidebar"
                    style={{ width: 24, height: 24, transform: sidebarCollapsed ? "scaleX(-1)" : "none" }}
                />
            </button>
            {/* <h1>Dialysis Management</h1> */}
            <h1></h1>
            <div className="header-div ">
                <div className="icons-div">
                    <div className="icon-item">
                        {/* <Calendar size={25} className='header-icon' /> */}
                        <FaCalendarAlt size={25} className='header-icon' />
                        <span className='header-span'>{currentDate}</span>
                    </div>
                    <div className="icon-item">
                        <FaClock size={25} className='header-icon' />
                        <span className='header-span'>{formattedTime}</span>
                    </div>
                    <div className="icon-item">
                        {/* <Calculator size={25} className='header-icon' /> */}
                        <FaCalculator size={25} className='header-icon' />
                        {/* <span>Calculator</span> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header; 