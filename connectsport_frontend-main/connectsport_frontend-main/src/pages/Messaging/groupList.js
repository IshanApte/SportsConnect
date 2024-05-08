import React from 'react';

const GroupList = ({ groups, onGroupSelect, onManageGroup }) => (
    <div className="group-list">
      {groups.map(group => (
        <div key={group.id} className="group-item">
          <div onClick={() => onGroupSelect({ id: group.name, type: 'groups' })} className="group-name">
            {group.name}
          </div>
          {/* Adding a manage button for each group */}
          <button onClick={() => onManageGroup(group.name)} className="manage-group-btn">Manage</button>
        </div>
      ))}
    </div>
);

export default GroupList;
