import React from 'react';

const SearchBar = ({ onSearchChange, onShowPeople, onShowGroups, onCreateGroup }) => (
  <div className="search-bar">
    <input 
      type="text" 
      placeholder="Search friends or groups..."
      onChange={(e) => onSearchChange(e.target.value)}
    />
    <div>
      <button onClick={onShowPeople}>People</button>
      <button onClick={onShowGroups}>Groups</button>
    </div>
  </div>
);

export default SearchBar;
