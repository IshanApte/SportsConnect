import React, { useState, useEffect } from "react";
import { useAuth } from "../../services/useAuth"; 

const FilterSidebar = ({ setFilters }) => {
  const [sportsOptions, setSportsOptions] = useState([]);
  const [friendsOptions, setFriendsOptions] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Fetch sports options from the backend
    fetch(`${process.env.REACT_APP_API_URL}/sports-options`, {
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => setSportsOptions(data))
      .catch((error) => console.error("Error fetching sports options:", error));

      if (currentUser) {
        console.log(`Fetching friends options for user ${currentUser}...`);
        fetch(`${process.env.REACT_APP_API_URL}/friends-options?userId=${currentUser}`, {
          headers: { "Content-Type": "application/json" },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Friends options received:", data);
            setFriendsOptions(data);
        })
        .catch(error => {
            console.error("Error fetching friends options:", error);
            setFriendsOptions([]); // Set to empty array in case of errors
        });
    } else {
        console.log("Current user is undefined, skipping fetch for friends options");
    }
}, [currentUser]); 

  return (
    <div className="col-md-3 mb-4">
      <div className="card">
        <div className="card-body">
          <h3 className="card-title">Filter</h3>
          <select
            className="form-select mb-3"
            onChange={(e) => {
              console.log("Sport selected:", e.target.value); // Log selected sport
              setFilters((prev) => ({ ...prev, sport: e.target.value }));
            }}
          >
            <option value="">Select Sport</option>
            {sportsOptions.map((sport) => (
              <option key={sport} value={sport}>
                {sport}
              </option>
            ))}
          </select>
          <select
            className="form-select"
            onChange={(e) => {
              console.log("Friend selected:", e.target.value); // Log selected friend
              setFilters((prev) => ({ ...prev, friend: e.target.value }));
            }}
          >
            <option value="">Select Friend</option>
            {friendsOptions.map((friend) => (
              <option key={friend.userId} value={friend.userId}>
                {friend.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
