// components/Stories.js
import React from 'react';

const Stories = () => {
  return (
    <div className="d-flex align-items-center justify-content-start p-2" style={{overflowX: 'auto', whiteSpace: 'nowrap'}}>
      {/* Example story */}
      <div className="p-2">
        <img src="path/to/image" className="rounded-circle" alt="Story" style={{width: '60px', height: '60px'}} />
      </div>
      {/* Repeat for more stories */}
    </div>
  );
}

export default Stories;
