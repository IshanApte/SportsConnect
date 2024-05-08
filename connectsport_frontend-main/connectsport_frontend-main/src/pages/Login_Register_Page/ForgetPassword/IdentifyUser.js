import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import '../../../Styles/Login_Register_Page/forgetPassword.css';
import BackgroundImage from '../../../assets/images/background.jpg';
import ReusableForm from '../../../Components/ui/reusableForm';
import axios from 'axios';

const IdentityVerificationComponent = ({ onVerifyIdentity }) => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State for storing the error message

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(''); // Reset error message at the beginning of submission
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/verify-user`, { email });
      if (response.data.message === 'No user found with this email.') {
        setErrorMessage(response.data.message); // Set error message if no user found
      } else {
        // Assuming the token is in response.data.token
        const token = response.data.token;
        // You can store the token in localStorage, sessionStorage, or pass it directly if using a redirect
        localStorage.setItem('userToken', token); // Store the token for future use
        console.log({ token });
        // Execute the callback function with email and token when verification is successful
        onVerifyIdentity({email, token}); // Pass email and token for further actions or navigation
      }
    } catch (error) {
      console.error('Failed to send email:', error);
      if (error.response && error.response.data && error.response.data.message) {
        // If the error response contains a message, display it
        setErrorMessage(error.response.data.message);
      } else {
        // For network errors or other exceptions
        setErrorMessage('Failed to send email. Please try again later.');
      }
    }
  };

  return (
    <div className="forget__wrapper" style={{ backgroundImage: `url(${BackgroundImage})` }}>
      <div className="forget__backdrop"></div>
      <ReusableForm onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Email or Username</Form.Label>
          <Form.Control
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        {/* Display error message if there is any */}
        {errorMessage && <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>}

        <div className="d-flex justify-content-center">
          <Button variant="primary" type="submit" className="w-20">
            Verify
          </Button>
        </div>
      </ReusableForm>
    </div>
  );
};

export default IdentityVerificationComponent;
