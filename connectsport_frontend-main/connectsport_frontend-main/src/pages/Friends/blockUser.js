import React, { useState, useEffect } from "react";
import { useAuth } from "../../services/useAuth";
import "../../Styles/Friends/blockUser.css";

const BlockUser = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { currentUser } = useAuth(); // Assuming currentUser contains userId
  const [refetchTrigger, setRefetchTrigger] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState(new Set());

  useEffect(() => {
    // Add a check to ensure currentUser is defined
    if (currentUser) {
      fetch(
        `${process.env.REACT_APP_API_URL}/blocked-users?userId=${currentUser}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            const blockedIds = new Set(data.map((user) => user.userId));
            setBlockedUsers(blockedIds);
          } else {
            console.error("Expected an array, received:", data);
            // Handle cases where data is not an array
          }
        })
        .catch((error) =>
          console.error("Error fetching blocked users:", error)
        );
    }

    if (searchTerm) {
      fetch(
        `${process.env.REACT_APP_API_URL}/block/search?searchTerm=${searchTerm}&userId=${currentUser}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          const resultsWithFullName = data.map((user) => ({
            ...user,
            isBlocked: blockedUsers.has(user.userId),
            fullName: `${user.firstName} ${user.lastName}`,
          }));
          setSearchResults(resultsWithFullName);
        })
        .catch((error) => console.error("Error searching users:", error));
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, refetchTrigger, currentUser, blockedUsers]);

  const handleBlockUnblock = (user) => {
    const action = user.isBlocked ? "unblock" : "block";
    if (currentUser) {
      fetch(`${process.env.REACT_APP_API_URL}/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser,
          targetUserId: user.userId,
        }),
      })
        .then((response) => response.json())
        .then(() => {
          setRefetchTrigger(!refetchTrigger);
          if (user.isBlocked) {
            blockedUsers.delete(user.userId);
          } else {
            blockedUsers.add(user.userId);
          }
          setBlockedUsers(new Set(blockedUsers));
        })
        .catch((error) => console.error(`Error ${action}ing user:`, error));
    }
  };

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
  };

  return (
    <div className="block-user-container">
      <input
        className="search-input"
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search users to block or unblock"
      />
      <div className="results-container">
        {searchResults.map((user) => (
          <div key={user.userId} className="result-item">
            {user.fullName}
            <button
              className={`block-button ${user.isBlocked ? 'unblock' : 'block'}`}
              onClick={() => handleBlockUnblock(user)}
            >
              {user.isBlocked ? "Unblock" : "Block"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlockUser;