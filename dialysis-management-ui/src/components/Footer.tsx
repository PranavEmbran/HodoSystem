import React, { useState } from 'react';
import './Footer.css';
import { ShortcutsModal } from './Shortcuts-modal';

const Footer: React.FC = () => {
  const [isShortcutsOpen, setShortcutsOpen] = useState(false);

  const toggleFullscreen = (): void => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err: Error) => {
        console.log("Error attempting to enable fullscreen: " + err.message);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className='footer-container'>
      <div className="footer-left">
        <span> © 2025 </span>
        <a href="#">www.hodo.com</a>
        <span>Empowering Entrepreneurs in Healthcare </span>
        <a href="#" onClick={e => { e.preventDefault(); setShortcutsOpen(true); }}>Short Cuts</a>
      </div>
      <div className="footer-right">
        <button onClick={toggleFullscreen} className="fullscreen-btn">
          ⛶
        </button>
      </div>
      <ShortcutsModal isOpen={isShortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
  );
};

export default Footer; 