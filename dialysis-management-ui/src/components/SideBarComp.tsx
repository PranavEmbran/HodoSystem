import React from 'react';
import { NavLink } from 'react-router-dom';
import './SideBar.css';
import { FaCaretRight } from 'react-icons/fa';

interface SideBarCompProps {
    collapsed?: boolean;
}

const today = new Date();
const formattedDate = today.toLocaleDateString('en-GB').replace(/\//g, '/');
// const formattedDate = today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });


const SideBar: React.FC<SideBarCompProps> = ({ collapsed = false }) => {
    const sidebarWidth = collapsed ? '0px' : '250px'; // ADJUST SIDE BAR WIDTH HERE AND ADJUST THE MAIN CONTAINER WIDTH IN Home.css

    return (
        <div
            className={`sidebar ${collapsed ? 'collapsed' : ''}`}
            style={{
                width: sidebarWidth,
                transition: 'width 0.3s ease',
                height: '100vh',
                overflowY: 'auto',
                flexShrink: 0,
                // Set CSS variable so other components can use it
                ['--sidebar-expanded-width' as any]: sidebarWidth,
            }}
        >

            {/* <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}> */}
            {!collapsed && (
                <div className="sidebar-header-section">
                    <div className="sidebar-header-top-wrap">
                        <div className="sidebar-header-img-wrap">
                            {/* <img src="/HoDo-LOGO-BLUE150.png" alt="Profile" className="sidebar-header-img" /> */}
                            <img src="/profileimg.jpg" alt="Profile" className="sidebar-header-img" />
                        </div>
                        <div className="sidebar-header-text-wrap">
                            <div className="sidebar-header-role-top">System Admin</div>
                            <div className="sidebar-header-hospital">HODO Hospital,<br />Kazhakkoottam</div>
                            <div className="sidebar-header-role2">System Admin</div>
                            <div className="sidebar-header-location">@Kottayam <span className="sidebar-header-date">{formattedDate}</span></div>
                        </div>
                    </div>
                    <input
                        type="text"
                        className="sidebar-header-search"
                        placeholder="Search Menu - CTRL + M"
                        tabIndex={-1}
                    />
                </div>
            )}
            <nav>
                <ul>
                    {!collapsed && (<li className="sidebar-title">Dialysis Management</li>)}
                    <li>
                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                            title={collapsed ? "Dashboard" : ""}
                        >
                            <FaCaretRight size={22} />
                            {!collapsed && "Dashboard"}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/registration"
                            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                            title={collapsed ? "Patient Registration" : ""}
                        >
                            <FaCaretRight size={22} />
                            {!collapsed && "Patient Registration"}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/schedule"
                            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                            title={collapsed ? "Schedule" : ""}
                        >
                            <FaCaretRight size={22} />
                            {!collapsed && "Schedule"}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/process"
                            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                            title={collapsed ? "Start Dialysis" : ""}
                        >
                            <FaCaretRight size={22} />
                            {!collapsed && "Start Dialysis"}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/dialysis-flow-chart"
                            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                            title={collapsed ? "Flow Chart" : ""}
                        >
                            <FaCaretRight size={22} />
                            {!collapsed && "Flow Chart"}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/haemodialysis-record-details"
                            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                            title={collapsed ? "Haemodialysis Record Details" : ""}
                        >
                            <FaCaretRight size={22} />
                            {!collapsed && "HD Record"}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/billing"
                            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                            title={collapsed ? "Billing" : ""}
                        >
                            <FaCaretRight size={22} />
                            {!collapsed && "Billing"}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/history"
                            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                            title={collapsed ? "History" : ""}
                        >
                            <FaCaretRight size={22} />
                            {!collapsed && "History"}
                        </NavLink>
                    </li>

                </ul>
            </nav>
            {/* </div> */}
        </div>
    );
};

export default SideBar; 