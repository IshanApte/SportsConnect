import React from 'react';
import IconButton from '../ui/iconButton'; // Ensure this is the correct path

const SocialButtons = ({ onLike, likesCount, onCommentToggle, commentsCount, onShare }) => {
  return (
    <div style={containerStyle}>
      <div style={buttonGroupStyle}>
        <IconButton iconName="faThumbsUp" onClick={onLike} ariaLabel="Like" />
        <span style={labelStyle}>Like</span>
        <span>{likesCount}</span>
      </div>
      <div style={dividerStyle}></div>
      <div style={buttonGroupStyle}>
        <IconButton iconName="faComment" onClick={onCommentToggle} ariaLabel="Comment" />
        <span style={labelStyle}>Comment</span>
        <span>{commentsCount}</span>
      </div>
      <div style={dividerStyle}></div>
      <div style={buttonGroupStyle}>
        <IconButton iconName="faShare" onClick={onShare} ariaLabel="Share" />
        <span style={labelStyle}>Share</span>
      </div>
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px', // Adjust the gap between buttons as needed
};

const buttonGroupStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px', // Adjust the gap between icon and text as needed
};

const labelStyle = {
  display: 'inline', // Keep the label inline with the icon
  marginLeft: '4px', // Space between the icon and the text
};

const dividerStyle = {
  height: '24px', // Match the height with your buttons or icon size
  width: '1px',
  backgroundColor: '#d1d1d1', // A light grey color for the divider, adjust as needed
};

export default SocialButtons;
