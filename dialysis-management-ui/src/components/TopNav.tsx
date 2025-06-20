import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaSearch, FaBell, FaCog, FaChevronDown, FaBars } from 'react-icons/fa';
import './TopNav.css';

interface TopNavProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const TopNav: React.FC<TopNavProps> = ({ searchQuery, setSearchQuery }) => {
  const [permanentDropdownOpen, setPermanentDropdownOpen] = useState(false);
  const [responsiveDropdownOpen, setResponsiveDropdownOpen] = useState(false);
  const permanentDropdownRef = useRef<HTMLDivElement>(null);
  const responsiveDropdownRef = useRef<HTMLDivElement>(null);

  // Close permanent dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (permanentDropdownRef.current && !permanentDropdownRef.current.contains(event.target as Node)) {
        setPermanentDropdownOpen(false);
      }
    }
    if (permanentDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [permanentDropdownOpen]);

  // Close responsive dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (responsiveDropdownRef.current && !responsiveDropdownRef.current.contains(event.target as Node)) {
        setResponsiveDropdownOpen(false);
      }
    }
    if (responsiveDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [responsiveDropdownOpen]);

  const handlePermanentDropdownToggle = () => setPermanentDropdownOpen((open) => !open);
  const handleResponsiveDropdownToggle = () => setResponsiveDropdownOpen((open) => !open);
  const handlePermanentNavClick = () => setPermanentDropdownOpen(false);
  const handleResponsiveNavClick = () => setResponsiveDropdownOpen(false);

  return (
    <nav className="top-nav">
      <div className="nav-left">
        <Link to="/dashboard">
          <img src="/HoDo-LOGO-BLUE150.png" alt="HoDo Logo" className="nav-logo" />
        </Link>
        <ul className="nav-list2">
          <li className='nav-link'><NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink></li>
          <li className='nav-link'><NavLink to="/registration" className={({ isActive }) => isActive ? 'active' : ''}>Patient Registration</NavLink></li>
          <li className='nav-link'><NavLink to="/schedule" className={({ isActive }) => isActive ? 'active' : ''}>Schedule</NavLink></li>
          <li className='nav-link'><NavLink to="/process" className={({ isActive }) => isActive ? 'active' : ''}>Start Dialysis</NavLink></li>
          {/* <li className='nav-link'><NavLink to="/dialysis-flow-chart" className={({ isActive }) => isActive ? 'active' : ''}>Flow Chart</NavLink></li>
          <li className='nav-link'><NavLink to="/haemodialysis-record-details" className={({ isActive }) => isActive ? 'active' : ''}>HD Record</NavLink></li>
          <li className='nav-link'><NavLink to="/billing" className={({ isActive }) => isActive ? 'active' : ''}>Billing</NavLink></li>
          <li className='nav-link'><NavLink to="/history" className={({ isActive }) => isActive ? 'active' : ''}>History</NavLink></li> */}
        </ul>

        <div className="nav-permanent-more-wrapper" ref={permanentDropdownRef}>
          <button className="nav-permanent-more-btn" onClick={handlePermanentDropdownToggle} aria-expanded={permanentDropdownOpen} aria-controls="nav-permanent-more-dropdown">
            More <FaChevronDown style={{ marginLeft: 4 }} />
          </button>
          {permanentDropdownOpen && (
            <div className="nav-permanent-more-dropdown" id="nav-permanent-more-dropdown">
              {/* <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''} onClick={handlePermanentNavClick}>Dashboard</NavLink>
              <NavLink to="/registration" className={({ isActive }) => isActive ? 'active' : ''} onClick={handlePermanentNavClick}>Patient Registration</NavLink>
              <NavLink to="/schedule" className={({ isActive }) => isActive ? 'active' : ''} onClick={handlePermanentNavClick}>Schedule</NavLink>
              <NavLink to="/process" className={({ isActive }) => isActive ? 'active' : ''} onClick={handlePermanentNavClick}>Start Dialysis</NavLink> */}
              <NavLink to="/dialysis-flow-chart" className={({ isActive }) => isActive ? 'active' : ''} onClick={handlePermanentNavClick}>Flow Chart</NavLink>
              <NavLink to="/haemodialysis-record-details" className={({ isActive }) => isActive ? 'active' : ''} onClick={handlePermanentNavClick}>HD Record</NavLink>
              <NavLink to="/billing" className={({ isActive }) => isActive ? 'active' : ''} onClick={handlePermanentNavClick}>Billing</NavLink>
              <NavLink to="/history" className={({ isActive }) => isActive ? 'active' : ''} onClick={handlePermanentNavClick}>History</NavLink>
            </div>
          )}
        </div>

        <div className="nav-more-wrapper" ref={responsiveDropdownRef}>
          <button className="nav-more-btn" onClick={handleResponsiveDropdownToggle} aria-expanded={responsiveDropdownOpen} aria-controls="nav-more-dropdown">
          <FaBars /> <FaChevronDown style={{ marginLeft: 4}} />
          </button>
          {responsiveDropdownOpen && (
            <div className="nav-more-dropdown" id="nav-more-dropdown">
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''} onClick={handleResponsiveNavClick}>Dashboard</NavLink>
              <NavLink to="/registration" className={({ isActive }) => isActive ? 'active' : ''} onClick={handleResponsiveNavClick}>Patient Registration</NavLink>
              <NavLink to="/schedule" className={({ isActive }) => isActive ? 'active' : ''} onClick={handleResponsiveNavClick}>Schedule</NavLink>
              <NavLink to="/process" className={({ isActive }) => isActive ? 'active' : ''} onClick={handleResponsiveNavClick}>Start Dialysis</NavLink>
              <NavLink to="/dialysis-flow-chart" className={({ isActive }) => isActive ? 'active' : ''} onClick={handleResponsiveNavClick}>Flow Chart</NavLink>
              <NavLink to="/haemodialysis-record-details" className={({ isActive }) => isActive ? 'active' : ''} onClick={handleResponsiveNavClick}>HD Record</NavLink>
              <NavLink to="/billing" className={({ isActive }) => isActive ? 'active' : ''} onClick={handleResponsiveNavClick}>Billing</NavLink>
              <NavLink to="/history" className={({ isActive }) => isActive ? 'active' : ''} onClick={handleResponsiveNavClick}>History</NavLink>
            </div>
          )}
        </div>
      </div>
      <ul className="nav-list nav-list-responsive">
        <div className="searchBar">
          <input type="search" name="search" placeholder="Search Patient with Name or Card No. or Mobile No."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <li className='nav-list-button'><NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink></li>
        <li className='nav-list-button'><NavLink to="/process" className={({ isActive }) => isActive ? 'active' : ''}>Start Dialysis</NavLink></li>
        <div className="nav-div-main">
          <div className="nav-div">
            <a href="#" className="nav-link text-white" title="Search Patient" onClick={(e) => {
              e.preventDefault();
              alert('Search Patient feature coming soon!');
            }}>
              <i className="fas fa-search  mt-1"></i>
              <FaSearch />
            </a>
          </div>
          <div className="nav-div">
            <a href="#" className="nav-link text-white" onClick={(e) => {
              e.preventDefault();
              alert('Notification feature coming soon!');
            }}>
              <i className="fas fa-bell  mt-1"></i>
              <FaBell />
            </a>
          </div>
          <div className="nav-div">
            <a href="#" className="nav-link text-white" onClick={(e) => {
              e.preventDefault();
              alert('Settings Disabled');
            }}>
              <i className="fas fa-cog  mt-1"></i>
              <FaCog />
            </a>
          </div>
        </div>
      </ul>
    </nav>
  );
};

export default TopNav; 