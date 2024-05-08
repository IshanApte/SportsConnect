import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Row, Col } from "react-bootstrap";
import axios from "axios";
import ReusableForm from "../../../Components/ui/reusableForm";

const OtpVerificationComponent = ({ onVerifyOtp, token }) => { // Assuming token is passed as a prop
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60); // Assuming you want a countdown from 60 for example
  const [error, setError] = useState("");

  useEffect(() => {
    let countdown = null;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((currentTimer) => currentTimer - 1);
      }, 1000);
    } else {
      clearInterval(countdown);
    }
    return () => clearInterval(countdown);
  }, [timer]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!token) {
      setError("Token not provided or invalid.");
      return;
    }
    axios
      .post(`${process.env.REACT_APP_API_URL}/api/verify-otp`, { token, otp })
      .then((response) => {
        if (response.data.message === "OTP verified") { // Assuming this is your success condition
          console.log("OTP verification successful, calling handleOtpVerified");
          onVerifyOtp(true); // Pass true to indicate successful verification
        } else {
          setError("Incorrect OTP. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error verifying OTP:", error);
        setError("Error during OTP verification. Please try again.");
      });
  };

  const handleResendClick = () => {
    setTimer(30); // Reset the timer when the user requests to resend OTP
    // Implement OTP resend functionality here if needed
  };

  return (
    <ReusableForm onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Group as={Row} className="mb-3 justify-content-center">
        <Col xs={12} md={8} lg={8}>
          <Form.Control
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </Col>
      </Form.Group>
      <Row className="justify-content-center mb-2">
        <Col xs="auto">
          <Button variant="primary" type="submit">
            Verify OTP
          </Button>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs="auto">
          <Button variant="secondary" size="sm" onClick={handleResendClick} disabled={timer > 0} type="button">
            Resend OTP {timer > 0 ? `(${timer}s)` : ""}
          </Button>
        </Col>
      </Row>
    </ReusableForm>
  );
};

export default OtpVerificationComponent;
