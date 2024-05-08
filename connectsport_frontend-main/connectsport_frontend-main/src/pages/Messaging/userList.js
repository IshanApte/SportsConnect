import React from 'react';

const UserList = ({ users, onUserSelect }) => (
  <div className="user-list">
    {users.map((user) => (
      <div key={user.userId} onClick={() => onUserSelect(user)} className="user-item">
        <p><strong>{user.userId}</strong></p>
        <p>{user.lastMessage ? user.lastMessage : 'No messages'}</p>
      </div>
    ))}
  </div>
);

export default UserList;
