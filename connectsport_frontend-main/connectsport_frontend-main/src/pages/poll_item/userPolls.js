import React, { useState, useEffect } from "react";
import { useAuth } from "../../services/useAuth"; // Ensure the path is correct
import SearchComponent from "../../Components/common/searchComponent";
import Navbar from "../../Components/layout/navbar";

function UserPolls() {
  const { isLoggedIn, currentUser, handleLogout } = useAuth();
  const [searchInput, setSearchInput] = useState("");
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/user/${currentUser}/polls`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch polls");
        }

        const pollsData = await response.json();
        setPolls(pollsData);
      } catch (error) {
        console.error("Error fetching user polls:", error);
      }
    };

    if (currentUser) {
      fetchPolls();
    }
  }, [currentUser]);

  const downloadResults = async (pollId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/polls/${pollId}/download`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `poll-${pollId}-results.csv`; // assuming CSV format
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        throw new Error("Failed to download results");
      }
    } catch (error) {
      console.error("Error downloading poll results:", error);
    }
  };

  return (
    <div>
      <Navbar
        user={currentUser}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onSearchChange={setSearchInput}
      />
      {searchInput && <SearchComponent />}
      <div className="container my-4">
      <h2 className="mb-3">My Polls</h2>
      <div className="list-group">
        {polls.map((poll) => (
          <div key={poll._id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
            <div className="ms-2 me-auto">
              <div className="fw-bold">{poll.question}</div>
            </div>
            <button className="btn btn-primary" onClick={() => downloadResults(poll._id)}>
              Download Results
            </button>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

export default UserPolls;
