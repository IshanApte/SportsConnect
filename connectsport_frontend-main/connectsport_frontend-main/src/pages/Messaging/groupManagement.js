import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../services/useAuth";
import "../../Styles/Messaging/manageGroup.css";

const GroupManagement = ({ groupId, onClose }) => {
  const [members, setMembers] = useState([]);
  const [nonMembers, setNonMembers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchGroupMembers();
    fetchNonMemberFriends();
  }, [groupId]);

  const fetchGroupMembers = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/groups/${groupId}/members`)
      .then((response) => {
        setMembers(response.data);
      })
      .catch((error) => console.error("Fetch members failed:", error));
  };

  const fetchNonMemberFriends = () => {
    if (!currentUser) {
        console.error('No current user defined when fetching non-member friends');
        return; // Exit the function if no currentUser to avoid unnecessary request
    }

    axios.get(`${process.env.REACT_APP_API_URL}/groups/${groupId}/nonMemberFriends`, {
        params: { currentUser } // Ensure this matches the query parameter expected by your backend
    })
    .then(response => {
        setNonMembers(response.data);
    })
    .catch(error => {
        console.error('Fetch non-member friends failed:', error);
    });
};

  const handleAddMember = () => {
    if (!selectedUserId) {
      setFeedbackMessage("Please select a user to add.");
      return;
    }
    axios
      .post(`${process.env.REACT_APP_API_URL}/groups/${groupId}/addMember`, {
        userId: selectedUserId,
      })
      .then(() => {
        setFeedbackMessage(`User added successfully.`);
        fetchGroupMembers();
        fetchNonMemberFriends();
        setSelectedUserId("");
      })
      .catch((error) => {
        console.error("Add member failed:", error);
        setFeedbackMessage(`Failed to add user.`);
      });
  };

  const handleRemoveMember = (userId) => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/groups/${groupId}/removeMember`, {
        userId,
      })
      .then(() => {
        setFeedbackMessage(`User removed successfully.`);
        fetchGroupMembers();
      })
      .catch((error) => {
        console.error("Remove member failed:", error);
        setFeedbackMessage(`Failed to remove user.`);
      });
  };

  return (
    <div className="group-management">
      <button onClick={onClose}>X</button>
      <h2>Manage Group Members</h2>
      <div>{feedbackMessage}</div>
      <select
        onChange={(e) => setSelectedUserId(e.target.value)}
        value={selectedUserId}
      >
        <option value="">Select User</option>
        {nonMembers
          .filter(userName => !members.includes(userName)) // Assuming nonMembers are an array of friend names and members are also names
          .map((userName, index) => ( // userName is a string
            <option key={index} value={userName}>
              {userName}
            </option>
          ))}
      </select>
      <button onClick={handleAddMember}>Add Member</button>
      <div style={{ maxHeight: "200px", overflowY: "auto" }}>
        <ul>
          {members.map(
            (
              memberName,
              index // Use memberName directly, and add index for key if names can repeat
            ) => (
              <li key={index}>
                {" "}
                {memberName} {/* Directly display the memberName */}
                <button onClick={() => handleRemoveMember(memberName)}>
                  Remove
                </button>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
};

export default GroupManagement;
