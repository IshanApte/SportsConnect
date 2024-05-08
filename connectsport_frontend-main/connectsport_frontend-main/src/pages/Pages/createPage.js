import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../services/useAuth"; // Adjust the import path as necessary
import { Button, Form, Dropdown, DropdownButton, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const CreatePage = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    type: "",
    venue: "",
    askForDonations: false, // New field to track donation request option
    donationMobile: "", // Mobile number for donations
    contactNumber: "", // Mobile number to contact
  });

  // State to manage form validation error messages
  const [validationError, setValidationError] = useState("");

  const {currentUser} = useAuth(); // Adjust based on your authentication context/provider setup
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.checked,
    }));
  };

  const handleTypeSelect = (e) => {
    // Resetting date and venue if the type is not event
    const updates = e === "event" ? {} : { date: "", venue: "" };
    setFormData((prev) => ({
      ...prev,
      type: e,
      ...updates,
    }));
    setValidationError(""); // Clear any validation error
  };

  const validateForm = () => {
    if (!formData.title || !formData.description || !formData.type) {
      setValidationError("Title, description, and type are required.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      console.log("Current User ID:", currentUser); 
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/createpage`, {
        ...formData,
        createdBy: currentUser,
      });
      onClose(); // Assuming onClose properly closes the modal
      // navigate(`${process.env.REACT_APP_API_URL}/pages/${response.data._id}`); // Redirect to the newly created page
    } catch (error) {
      console.error("Error creating the page:", error);
    }
  };

  return (
    <div className="create-page-form">
      {validationError && <Alert variant="danger">{validationError}</Alert>}
      <Form onSubmit={handleSubmit}>
        {/* Title */}
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        {/* Description */}
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        {/* Type Selection */}
        <Form.Group className="mb-3">
          <DropdownButton
            title={formData.type || "Select Type"}
            id="dropdown-item-button"
            onSelect={handleTypeSelect}
            required
          >
            <Dropdown.Item eventKey="Event">Event</Dropdown.Item>
            <Dropdown.Item eventKey="Organization">Organization</Dropdown.Item>
          </DropdownButton>
          {!formData.type && (
            <Form.Text className="text-muted">Type is required.</Form.Text>
          )}
        </Form.Group>

        {/* Conditional Fields for Events */}
        {formData.type === "Event" && (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required={formData.type === "Event"}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Venue</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter venue"
                name="venue"
                value={formData.venue}
                onChange={handleInputChange}
                required={formData.type === "Event"}
              />
            </Form.Group>
          </>
        )}

        {/* New Checkbox for Donation Request */}
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check
            type="checkbox"
            label="Ask for Donations"
            name="askForDonations"
            checked={formData.askForDonations}
            onChange={handleCheckboxChange}
          />
        </Form.Group>

        {formData.askForDonations && (
          <Form.Group className="mb-3">
            <Form.Label>Donation Mobile Number</Form.Label>
            <Form.Control
              type="tel"
              placeholder="Enter mobile number for donations"
              name="donationMobile"
              value={formData.donationMobile}
              onChange={handleInputChange}
              pattern="\d{10}"
              title="Donation mobile number should be a 10-digit number without spaces or special characters."
            />
          </Form.Group>
        )}

        {/* Contact Number with Pattern Validation */}
        <Form.Group className="mb-3">
          <Form.Label>Contact Number</Form.Label>
          <Form.Control
            type="tel"
            placeholder="Enter contact number"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleInputChange}
            pattern="\d{10}"
            title="Contact number should be a 10-digit number without spaces or special characters."
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Create Page
        </Button>
      </Form>
    </div>
  );
};

export default CreatePage;
