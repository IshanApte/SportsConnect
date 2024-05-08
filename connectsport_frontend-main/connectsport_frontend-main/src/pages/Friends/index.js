import React, { useEffect, useState } from "react";
import Navbar from "../../Components/layout/navbar"; // Adjusted for consistent naming convention
import FilterSidebar from "./filterSidebar";
import PeopleList from "./peopleList";
import FriendRequests from "./friendRequests";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../Styles/Friends/friendspage.css";
import { useAuth } from "../../services/useAuth";
import SearchComponent from "../../Components/common/searchComponent";

const App = () => {
  // State to manage search input
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({ sport: "", friend: "" });
  const { isLoggedIn, currentUser, handleLogout } = useAuth();
  // const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    console.log("Filters updated:", filters); // Log when filters are updated
  }, [filters]);

  return (
    <div className="container-fluid p-0">
      {" "}
      {/* Ensure this container is fluid and has no padding */}
      {/* Pass setSearchInput to manage search state */}
      <Navbar
        user={currentUser}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onSearchChange={setSearchInput} // Pass setSearchInput as a prop
      />
      {searchInput && <SearchComponent />}
      <div className="container my-5">
        <div className="row g-4">
          {" "}
          {/* Preserved gap between columns */}
          <FilterSidebar setFilters={setFilters} />
          <PeopleList searchInput={searchInput} filters={filters} />
          <FriendRequests searchInput={searchInput} />
        </div>
      </div>
    </div>
  );
};

export default App;
