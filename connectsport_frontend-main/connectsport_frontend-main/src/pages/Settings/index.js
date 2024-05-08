import React, { useState, useEffect } from "react";
import "../../Styles/HomePage/settings.css"; // Ensure this path is correct
import { useAuth } from "../../services/useAuth";
import Navbar from "../../Components/layout/navbar"; // Ensure correct import path
import BackgroundImage from "../../assets/images/background.jpg"; // Ensure this path is correct
import { useNavigate } from "react-router-dom"; // Ensure this is correctly imported
import SearchComponent from "../../Components/common/searchComponent";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, currentUser, handleLogout } = useAuth();
  const [searchInput, setSearchInput] = useState("");
  const [emailPublic, setEmailPublic] = useState(false);
  const [error, setError] = useState("");

  const [profile, setProfile] = useState({
    userId: "",
    bio: "",
    email: "",
  });
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    // This checks if the authentication details are defined
    if (isLoggedIn !== undefined && currentUser !== null) {
      setProfile({
        userId: currentUser || "",
        bio: currentUser.bio || "",
        email: currentUser.email || "",
      });
      setLoading(false); // Stop loading when authentication details are loaded
    }
  }, [isLoggedIn, currentUser]);

  useEffect(() => {
    if (isLoggedIn && currentUser) {
      const fetchProfile = async () => {
        setLoading(true); // Start loading state for async operation
        try {
          const userId =
            typeof currentUser === "object" ? currentUser.userId : currentUser;
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/${userId}/settings`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                // Authorization: 'Bearer yourTokenHere', // Add this line if you're using token authentication
              },
            }
          );
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || "Failed to fetch profile");
          }
          setProfile({
            userId: data.userId || "",
            bio: data.bio || "",
            email: data.email || "",
          });
          setEmailPublic(data.emailPublic || false);
        } catch (error) {
          setError(error.message);
          console.error("Error fetching profile:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    }
  }, [currentUser, isLoggedIn]); // Re-run when these dependencies change

  if (loading) {
    return <div>Loading...</div>; // Loading indicator
  }

  if (!isLoggedIn || !currentUser) {
    navigate("/login");
    return <></>; // This will be replaced by the Navigate component once the redirect is complete
  }

  const handleProfileChange = (e) => {
    const { name, value } = e.target; // Destructure for simplicity
    setProfile({ ...profile, [name]: value });
  };

  const handleEmailVisibilityToggle = () => {
    setEmailPublic(!emailPublic);
  };

  const handleImageChange = (e) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      setImagePreviewUrl(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading before API request

    if (!currentUser) {
      console.error("Error: Current user information is missing");
      setError("Current user information is missing");
      setLoading(false);
      return;
    }

    const updatePayload = {
      ...profile,
      emailPublic,
      currentUserId: currentUser, // Assuming 'currentUser.id' is the field you use to identify the user
    };

    console.log("Attempting to update profile for current user:", currentUser);
    console.log("Update data being sent:", updatePayload);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/${currentUser}/settings`,
        {
          // Updated URL
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatePayload),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        console.error("Failed to update profile:", data);
        throw new Error(data.message || "Failed to update profile");
      }
      console.log("Profile updated successfully:", data);
      // Optionally, update UI or provide feedback
    } catch (error) {
      console.error("Failed to update profile:", error);
      setError("Failed to update profile: " + error.message);
    }
    setLoading(false); // Stop loading after API request is done
  };

  return (
    <div className="container-fluid p-0">
      <Navbar
        user={currentUser}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onSearchChange={setSearchInput} // Pass setSearchInput as a prop
      />
      {searchInput && <SearchComponent />}
      <div
        className="settings__wrapper"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      >
        <div className="container mt-5 settings-container">
          <div className="image-preview-container text-center">
            {imagePreviewUrl ? (
              <img
                src={imagePreviewUrl}
                alt="Profile Preview"
                className="image-preview"
              />
            ) : (
              <div className="image-preview">No image</div>
            )}
          </div>
          <h1 className="mb-4 text-center">Settings</h1>
          <form
            onSubmit={handleFormSubmit}
            className="row g-3 bg-white p-4 rounded shadow"
          >
            <div className="mb-3 text-center">
              <label htmlFor="profilePicture" className="form-label">
                Profile Picture:
              </label>
              <input
                type="file"
                className="form-control"
                id="profilePicture"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <div className="mb-3 col-md-6">
              <label htmlFor="username" className="form-label">
                Username:
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                value={profile.userId}
                onChange={handleProfileChange}
              />
            </div>
            <div className="mb-3 col-md-6">
              <label htmlFor="email" className="form-label">
                Email:
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
              />
              <div className="form-check mt-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="emailPublic"
                  checked={emailPublic}
                  onChange={handleEmailVisibilityToggle}
                />
                <label className="form-check-label" htmlFor="emailPublic">
                  Make Email Public
                </label>
              </div>
            </div>
            <div className="mb-3 col-12">
              <label htmlFor="bio" className="form-label">
                Bio:
              </label>
              <textarea
                className="form-control"
                id="bio"
                name="bio"
                value={profile.bio}
                onChange={handleProfileChange}
                rows="3"
              ></textarea>
            </div>
            <div className="col-12 text-center">
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
