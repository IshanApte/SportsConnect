import React, { useState, useEffect } from "react";
// import "../../Styles/HomePage/profileModal.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Spinner, Alert, ListGroup } from 'react-bootstrap';


const ProfileModal = ({ userId, onClose }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      console.log(`Initiating fetch for user profile: ${userId}`);
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/user/${userId}`
        );
        if (!response.ok) {
          throw new Error(
            `Could not fetch profile, status: ${response.status}`
          );
        }
        const data = await response.json();
        console.log("Profile data received:", data);
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  return (
    <Modal show={true} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>User Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && <div className="text-center"><Spinner animation="border" /></div>}
        {error && <Alert variant="danger">Error: {error}</Alert>}
        {profile && (
          <ListGroup variant="flush">
            <ListGroup.Item><strong>UserID:</strong> {profile.userId}</ListGroup.Item>
            <ListGroup.Item><strong>Name:</strong> {profile.firstName} {profile.lastName}</ListGroup.Item>
            <ListGroup.Item><strong>Gender:</strong> {profile.gender}</ListGroup.Item>
            {profile.emailPublic && <ListGroup.Item><strong>Email:</strong> {profile.email}</ListGroup.Item>}
            <ListGroup.Item><strong>Fav Sports:</strong> {profile.favoriteSports.join(", ")}</ListGroup.Item>
            <ListGroup.Item><strong>Bio:</strong> {profile.bio}</ListGroup.Item>
          </ListGroup>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ProfileModal;