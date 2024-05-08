import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Container, Col, Row } from "react-bootstrap";
import BackgroundImage from "../../../assets/images/background.jpg";
import "../../../Styles/Login_Register_Page/RegisterForm.css";
import Footer from "../../../Components/layout/footer.js";
import ReusableForm from "../../../Components/ui/reusableForm.js";

const RegistrationPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    email: "",
    userId: "",
    password: "",
    favoriteSports: [],
    termsAgreed: false,
    securityQuestion1: "",
    securityAnswer1: "",
    securityQuestion2: "",
    securityAnswer2: "",
  });

  const securityQuestions = [
    "What was the name of your first pet?",
    "What is your mother's maiden name?",
    "What was the make and model of your first car?",
    "In what city were you born?",
    "What is the name of the first school you attended?",
    "What was your favorite food as a child?",
    "What was the name of your childhood best friend?",
    "In what city did your parents meet?",
    "What was your childhood nickname?",
    "What is your oldest sibling's middle name?",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMultiSelectChange = (e) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData((prevState) => ({
      ...prevState,
      favoriteSports: values,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.termsAgreed) {
      alert("You must agree to the terms of service.");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("User registered successfully");
        navigate('/login'); // Redirect to login page
        // Handle successful registration (e.g., clear form, show message, redirect)
      } else {
        console.error("Registration failed");
        // Handle errors or unsuccessful registration
      }
    } catch (error) {
      console.error("Error during registration:", error);
      // Handle network errors or exceptions
    }
  };

  return (
    <div
      className="register__wrapper"
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      <div>
        <Container>
          <Row className="justify-content-md-center">
            <Col md={6}>
              <div className="form-container">
                <ReusableForm onSubmit={handleSubmit}>
                  <h2 className="h4 mb-2 text-center">Register</h2>
                  <Form.Group className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="firstName"
                      required
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastName"
                      required
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Age</Form.Label>
                    <Form.Control
                      type="number"
                      name="age"
                      required
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select name="gender" required onChange={handleChange}>
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      required
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>User ID</Form.Label>
                    <Form.Control
                      type="text"
                      name="userId"
                      required
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      required
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Security Question 1</Form.Label>
                    <Form.Select
                      name="securityQuestion1"
                      value={formData.securityQuestion1}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a question...</option>
                      {securityQuestions.map((question, index) => (
                        <option key={index} value={question}>
                          {question}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Answer</Form.Label>
                    <Form.Control
                      type="text"
                      name="securityAnswer1"
                      value={formData.securityAnswer1}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Security Question 2</Form.Label>
                    <Form.Select
                      name="securityQuestion2"
                      value={formData.securityQuestion2}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a question...</option>
                      {securityQuestions.map((question, index) => (
                        <option key={index} value={question}>
                          {question}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Answer</Form.Label>
                    <Form.Control
                      type="text"
                      name="securityAnswer2"
                      value={formData.securityAnswer2}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Favorite Sports</Form.Label>
                    <Form.Select
                      multiple
                      name="favoriteSports"
                      onChange={handleMultiSelectChange}
                    >
                      <option value="Soccer">Soccer</option>
                      <option value="Basketball">Basketball</option>
                      <option value="Baseball">Baseball</option>
                      <option value="Tennis">Tennis</option>
                      <option value="Cricket">Cricket</option>
                    </Form.Select>
                  </Form.Group>
                  {/* Terms of Service Checkbox */}
                  <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check
                      type="checkbox"
                      label="I agree to all statements in Terms of Service"
                      name="termsAgreed"
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit" className="w-100">
                    Register
                  </Button>
                  {/* Already have an account */}
                  <div className="mt-3">
                    <span>
                      Have an account already?{" "}
                      <Link to="/login">Login here</Link>
                    </span>
                  </div>
                </ReusableForm>
              </div>
            </Col>
          </Row>
        </Container>
        <Footer />
      </div>
    </div>
  );
};

export default RegistrationPage;
