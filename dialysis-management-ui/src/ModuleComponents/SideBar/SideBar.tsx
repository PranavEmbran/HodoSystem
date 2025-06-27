import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";
// import { GraphIcon } from '@primer/octicons-react'
// import { PlusCircleIcon } from '@primer/octicons-react'
// import { ListUnorderedIcon } from '@primer/octicons-react'
// import { ReportIcon } from '@primer/octicons-react'
// import { ShieldCheckIcon } from '@primer/octicons-react'
// import { FileDirectoryIcon } from '@primer/octicons-react'
// import { LocationIcon } from '@primer/octicons-react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
// import logo from '../assets/logo.png';
import sidebarLogo from "../assets/sidebarLogo.png";

interface SideBarProps {
  collapsed?: boolean;
}

const SideBar: React.FC<SideBarProps> = ({ collapsed = false }) => {
  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-content">
        <div className="sidebar-top">
          <a
            href=""
            className={`sidebar-profile ${collapsed ? "collapsed" : ""}`}
          >
            <img src={sidebarLogo} alt="" />
          </a>
          <div className="sidebar-text">
            <h6 className="sidebar-heading">System Admin</h6>
            <h4 className="sidebar-para">HODO Hospital,</h4>
            <p className="sidebar-para">Kazhakkottam</p>
            <p className="sidebar-para2">System Admin</p>
          </div>
        </div>
        <div className={`searchbar ${collapsed ? "collapsed" : ""}`}>
          <div className="sidebar-date">
            <h6 className="sidebar-date-heading">
              @Anchal {new Intl.DateTimeFormat('en-GB', {
                day:'2-digit',
                month:'2-digit',
                year:'numeric'
              }).format(new Date())}
            </h6>
          </div>
          <input
            type="text"
            className="searchbar-input"
            placeholder="Search Menu- Ctrl + M"
          />
        </div>
      </div>
      <nav>
        <ul>
          <li className="sidebar-title">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? "sidebar-heading2 active" : "sidebar-heading2"
              }
              title=""
            >
              central sterile Department
            </NavLink>
          </li>
          <ul className="sidebar-sublist">
            <li>
              <NavLink
                to="/request-management"
                style={{fontWeight:400,color:"#cccccc"}}
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
                title={collapsed ? "Request Management" : ""}
              >
                <span>
                  <FontAwesomeIcon icon={faCaretRight} />
                </span>
                {!collapsed && "Request Management"}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/receive-items" style={{fontWeight:400,color:"#cccccc"}}
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
                title={collapsed ? "Receive Items" : ""}
              >
                <span>
                  <FontAwesomeIcon icon={faCaretRight} />
                </span>
                {!collapsed && "Receive Items"}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/sterilization-process" style={{fontWeight:400,color:"#cccccc"}}
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
                title={collapsed ? "Sterilization Process" : ""}
              >
                <span>
                  <FontAwesomeIcon icon={faCaretRight} />
                </span>
                {!collapsed && "Sterilization Process"}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/issue-item" style={{fontWeight:400,color:"#cccccc"}}
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
                title={collapsed ? "Issue Item" : ""}
              >
                <span>
                  <FontAwesomeIcon icon={faCaretRight} />
                </span>
                {!collapsed && "Issue Item"}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/stock-management" style={{fontWeight:400,color:"#cccccc"}}
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
                title={collapsed ? "Stock Management" : ""}
              >
                <span>
                  <FontAwesomeIcon icon={faCaretRight} />
                </span>
                {!collapsed && "Stock Management"}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/consumption-reports" style={{fontWeight:400,color:"#cccccc"}}
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
                title={collapsed ? "Consumption Reports" : ""}
              >
                <span>
                  <FontAwesomeIcon icon={faCaretRight} />
                </span>
                {!collapsed && "Consumption Reports"}
              </NavLink>
            </li>
          </ul>
        </ul>
      </nav>
    </div>
  );
};

export default SideBar;
