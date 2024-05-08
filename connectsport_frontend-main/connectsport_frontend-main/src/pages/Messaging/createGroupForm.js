import React, { useState } from "react";
import axios from "axios";
import "../../Styles/Messaging/createGroupForm.css"; // Ensure this CSS file exists and is styled correctly

const CreateGroupForm = ({ userId, friends, onClose, onCreate }) => {
  // Added userId prop for the current user
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [groupName, setGroupName] = useState("");

  const handleFriendToggle = (friendId) => {
    setSelectedFriends((prevSelected) =>
      prevSelected.includes(friendId)
        ? prevSelected.filter((id) => id !== friendId)
        : [...prevSelected, friendId]
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const groupMembers = [...selectedFriends, userId]; // Add the user's ID to the group members
    axios
      .post(`${process.env.REACT_APP_API_URL}/groups`, {
        name: groupName,
        members: groupMembers,
      })
      .then((response) => {
        onCreate(response.data); // Lift the state up
        console.log("Group created successfully:", response.data);
        setGroupName("");
        setSelectedFriends([]);
        onClose(); // Close the form
      })
      .catch((error) => {
        console.error("Error creating group:", error);
      });
  };

  return (
    <div className="create-group-form-container">
      <form onSubmit={handleSubmit} className="create-group-form">
        <div className="form-header">
          <button type="button" onClick={onClose} className="close-btn">
            X
          </button>
          <h2>Create New Group</h2>
        </div>
        <label>
          Group Name:
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
          />
        </label>
        <fieldset>
          <legend>Select Friends</legend>
          {friends.map((friend) => (
            <label key={friend.userId} className="friend-selection-label">
              <input
                type="checkbox"
                checked={selectedFriends.includes(friend.userId)}
                onChange={() => handleFriendToggle(friend.userId)}
              />
              {friend.userId}
            </label>
          ))}
        </fieldset>
        <button type="submit">Create Group</button>
      </form>
    </div>
  );
};

export default CreateGroupForm;
