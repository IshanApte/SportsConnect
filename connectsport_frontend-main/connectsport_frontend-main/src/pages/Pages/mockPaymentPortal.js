// MockPaymentPortal.js
import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

const MockPaymentPortal = ({ show, handleClose, handlePaymentSuccess }) => {
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cardHolderName: "",
    cvv: "",
    amount: "",
  });
  const [validationError, setValidationError] = useState("");
  
  const validateCardDetails = () => {
    // Reset validation error and ensure specific logging
    setValidationError("");
    let isValid = true;

    if (!/^\d{12}$/.test(paymentDetails.cardNumber)) {
        const error = "Invalid card number; must be 12 digits.";
        console.error("Validation error:", error);
        setValidationError(error);
        isValid = false; // Mark as invalid and continue to check others
    }
    if (!/^\d{3}$/.test(paymentDetails.cvv)) {
        const error = "Invalid CVV; must be 3 digits.";
        console.error("Validation error:", error);
        setValidationError(error => error + "\n" + error); // Append if there's already an error
        isValid = false;
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentDetails.expiryDate)) {
        const error = "Invalid expiry date; must be in MM/YY format.";
        console.error("Validation error:", error);
        setValidationError(error => error + "\n" + error);
        isValid = false;
    }
    return isValid;
};
  const handleChange = (e) => {
    setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value });
  };

  const submitPayment = () => {
    if (!validateCardDetails()) {
      // If validation fails, stop further execution.
      return;
    }

    // Simulate payment processing
    console.log("Processing payment with details:", paymentDetails);
    setTimeout(() => {
      console.log("Payment successful");
      handlePaymentSuccess(paymentDetails);
      handleClose();
    }, 2000); // Simulate delay
  };
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Mock Payment Portal</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {validationError && <Alert variant="danger">{validationError}</Alert>}
        <Form>
          <Form.Group>
            <Form.Label>Card Number</Form.Label>
            <Form.Control
              type="text"
              name="cardNumber"
              value={paymentDetails.cardNumber}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Expiry Date (MM/YY)</Form.Label>
            <Form.Control
              type="text"
              name="expiryDate"
              placeholder="MM/YY"
              value={paymentDetails.expiryDate}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Card Holder Name</Form.Label>
            <Form.Control
              type="text"
              name="cardHolderName"
              value={paymentDetails.cardHolderName}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>CVV</Form.Label>
            <Form.Control
              type="text"
              name="cvv"
              value={paymentDetails.cvv}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Donation Amount</Form.Label>
            <Form.Control
              type="number"
              name="amount"
              value={paymentDetails.amount}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={submitPayment}>
          Submit Payment
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MockPaymentPortal;
