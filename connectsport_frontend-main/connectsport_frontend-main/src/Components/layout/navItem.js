import React from 'react';
import '../../Styles/HomePage/NavItem.css'; // Importing the CSS file for styling

const NavItem = ({ children, link, active, disabled }) => {
  const className = `nav-item ${active ? 'active' : ''} ${disabled ? 'disabled' : ''}`;
  return (
    <li className={className}>
      <a href={link} className="nav-link">
        {children}
      </a>
    </li>
  );
};

export default NavItem;
