import React, { useState } from "react";
import "../../Styles/HomePage/NavBar.css";
import { useAuth } from "../../services/useAuth"; // Ensure this is the correct path
import NavItem from "./navItem"; // Ensure the file name matches with case sensitivity
import Logo from "../../assets/images/logo.png"; // Ensure this is the correct path
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const Navbar = ({ onSearchChange }) => {
  const [searchInput, setSearchInput] = useState("");
  const { isLoggedIn, currentUser, handleLogout } = useAuth();

  const handleSearchChange = (e) => {
    const newValue = e.target.value;
    setSearchInput(newValue);
    if (onSearchChange) {
      onSearchChange(newValue);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-header">
        <a href="/" className="navbar-brand">
          <img src={Logo} alt="Company Logo" className="navbar-logo" />
          <span className="navbar-brand-name">ConnectSport</span>
        </a>
      </div>

      <div className="navbar-search">
        <input
          type="text"
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="Search..."
          className="search-input"
        />
        <button className="search-button">
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>

      <div className="navbar-expand">
        <ul className="navbar-nav">
          {isLoggedIn && (
            <NavItem link={`/home/${currentUser || 'user'}`} active>
              Home
            </NavItem>
          )}
          {isLoggedIn && <NavItem link={`/${currentUser || 'user'}/messages`}>Messages</NavItem>}
          {isLoggedIn && <NavItem link={`/${currentUser || 'user'}/friends`}>Friends</NavItem>}
          {isLoggedIn && <NavItem link={`/${currentUser || 'user'}/pages`}>Pages</NavItem>}
          {isLoggedIn && <NavItem link={`/${currentUser || 'user'}/notifications`}>Notifications</NavItem>}
          {isLoggedIn && <NavItem link={`/${currentUser || 'user'}/settings`}>Settings</NavItem>}
        </ul>
      </div>

      {isLoggedIn && (
        <div className="navbar-extra">
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
