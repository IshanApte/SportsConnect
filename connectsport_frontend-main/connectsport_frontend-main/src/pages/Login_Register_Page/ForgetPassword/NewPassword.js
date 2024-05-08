import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from 'axios'; // Ensure axios is installed for HTTP requests
import ReusableForm from "../../../Components/ui/reusableForm";

const NewPasswordComponent = ({ token, onChangePassword }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""); // State for backend error messages
  const [isPasswordChanged, setIsPasswordChanged] = useState(false); // State to track if the password has been successfully changed

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match."); // Using state-driven message for consistency
      return;
    }

    // Check if the token exists
    if (!token) {
      setError("Invalid or expired token.");
      return;
    }
    
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/change-password`, { 
        newPassword: password,
        token: token // Include the token here
      });
      if (response.data.message === "Password changed successfully") { // Adjust according to your API response
        onChangePassword(); // If you need to do something with the password, pass it as an argument
        setIsPasswordChanged(true); // Update state to indicate password change was successful
        setError(""); // Clear any previous errors
      } else {
        setError('Failed to change password. Please try again.');
      }
    } catch (err) {
      console.error('Error changing password:', err);
      setError(err.response?.data?.message || 'An error occurred while changing the password.');
    }
  };

  if (isPasswordChanged) {
    return (
      <div>
        <Alert variant="success">Password changed successfully. Please <a href="/login">log in</a> with your new password.</Alert>
      </div>
    );
  }

  return (
    <ReusableForm onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Group className="mb-3">
        <Form.Label>New Password</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Confirm New Password</Form.Label>
        <Form.Control
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </Form.Group>
      <div className="d-flex justify-content-center">
        <Button variant="primary" type="submit">
          Change Password
        </Button>
      </div>
    </ReusableForm>
  );
};

export default NewPasswordComponent;
