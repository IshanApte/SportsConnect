import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faComment, faShare } from '@fortawesome/free-solid-svg-icons';

// A utility function to map icon names to FontAwesomeIcon component icons
const iconMap = {
  'faThumbsUp': faThumbsUp,
  'faComment': faComment,
  'faShare': faShare,
};

const IconButton = ({ iconName, onClick, ariaLabel }) => {
  const icon = iconMap[iconName]; // Get the corresponding icon from the iconMap

  return (
    <button onClick={onClick} aria-label={ariaLabel} style={buttonStyle}>
      {/* Render the FontAwesomeIcon component */}
      <FontAwesomeIcon icon={icon} style={iconStyle} />
    </button>
  );
};

const buttonStyle = {
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  padding: '10px',
  fontSize: '24px',
  color: 'gray', // Adjust color to match your theme
};

const iconStyle = {
  // Add styles for the icon if necessary
};

export default IconButton;
