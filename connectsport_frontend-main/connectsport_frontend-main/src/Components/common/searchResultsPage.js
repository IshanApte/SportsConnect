// SearchResultsPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import ProfileModal from "../features/profileModel";
import Navbar from "../../Components/layout/navbar";
import { useAuth } from "../../services/useAuth";
import "../../Styles/HomePage/search.css";
import SearchComponent from "../../Components/common/searchComponent";

const SearchResultsPage = () => {
  const { search } = useLocation();
  const [results, setResults] = useState({ users: [], pages: [], posts: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { isLoggedIn, currentUser, handleLogout } = useAuth();
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const fetchSearchResults = async () => {
      console.log("Fetching search results");
      setIsLoading(true);
      try {
        console.log(`Request URL: /search${search}`);
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/search${search}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("Search results received:", data);
        setResults(data);
      } catch (error) {
        console.error("Failed to fetch search results:", error);
        setError("Failed to fetch search results. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSearchResults();
  }, [search]);

  if (isLoading) {
    return <div>Loading search results...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  // Function to handle the profile click, which opens the modal
  const handleProfileClick = (user) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setShowProfileModal(false);
    setSelectedUser(null); // Clear the selected user
  };
  const SearchResultItem = ({ children, onClick }) => (
    <div onClick={onClick} className="search-result-item">
      {children}
    </div>
  );


  return (
    <div className="container-fluid p-0">
      <Navbar
        user={currentUser}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onSearchChange={setSearchInput}
      />
      {searchInput && <SearchComponent />}
      <div className="search-results-page">
        <h2>Search Results</h2>
        <div className="search-section">
          <h3>Users</h3>
          <div className="results-list">
            {results.users.length > 0 ? (
              results.users.map((user) => (
                <SearchResultItem key={user._id} onClick={() => handleProfileClick(user)}>
                  {user.firstName} {user.lastName}
                </SearchResultItem>
              ))
            ) : (
              <p className="no-results">No user results found.</p>
            )}
          </div>
        </div>
        <div className="search-section">
          <h3>Pages</h3>
          <div className="results-list">
            {results.pages.length > 0 ? (
              results.pages.map((page) => (
                <SearchResultItem key={page._id}>
                  <Link to={`/pages/${page._id}`}>{page.title}</Link>
                </SearchResultItem>
              ))
            ) : (
              <p className="no-results">No page results found.</p>
            )}
          </div>
        </div>
        <div className="search-section">
          <h3>Posts</h3>
          <div className="results-list">
            {results.posts.length > 0 ? (
              results.posts.map((post) => (
                <SearchResultItem key={post._id}>
                  <div className="post-content">
                    <p>User ID: {post.userId}</p>
                    <p>{post.content}</p>
                  </div>
                  {post.image && post.image.url && (
                    <img src={post.image.url} alt="Post" className="img-fluid" />
                  )}
                </SearchResultItem>
              ))
            ) : (
              <p className="no-results">No post results found.</p>
            )}
          </div>
        </div>
        {showProfileModal && selectedUser && (
          <ProfileModal userId={selectedUser._id} onClose={handleCloseModal} />
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
