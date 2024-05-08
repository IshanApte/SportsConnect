import React from 'react';
import SearchBar from './searchBar'; // Assuming SearchBar is in the same directory

// Assuming `groups` data and `handleManageGroup` function are passed as props to this component
const SidebarComponent = ({ groups, onSearchChange, onShowPeople, onShowGroups, handleManageGroup }) => (
  <div>
    <SearchBar
      onSearchChange={onSearchChange}
      onShowPeople={onShowPeople}
      onShowGroups={onShowGroups}
    />
    {groups.map(group => (
      <div key={group.id} className="group-item">
        {group.name}
        <button onClick={() => handleManageGroup(group.id)} className="manage-group-btn">Manage</button>
      </div>
    ))}
  </div>
);

export default SidebarComponent;
