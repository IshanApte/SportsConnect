import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import ReusableForm from "../../../Components/ui/reusableForm";

const SecurityQuestionsComponent = ({ token, onVerifyAnswers }) => {
  // Token is now passed as a prop
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!token) {
        setError("No verification token found.");
        return;
      }
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/security-questions`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const fetchedQuestions = response.data.questions || {};
        // Convert the questions object to an array format if necessary
        const questionsArray = Object.keys(fetchedQuestions).map((key) => ({
          question: fetchedQuestions[key], // Assuming the question text is the value
        }));
        setQuestions(questionsArray);
        setAnswers(
          questionsArray.reduce((acc, item) => {
            acc[item.question] = ""; // Use the question text as the key
            return acc;
          }, {})
        );
      } catch (err) {
        console.error("Error fetching security questions:", err);
        setError("Failed to load security questions.");
      }
    };
    fetchQuestions();
  }, [token]);

  const handleChange = (event, question) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [question]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    if (!token) {
      setError("Submission error: No verification token provided.");
      return; // Exit the function if there is no token
    }

    try {
      const formattedAnswers = Object.entries(answers).map(([question, answer]) => ({ question, answer }));

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/verify-answers`,
        { answers: formattedAnswers }, // Adjust based on your backend's expected format
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        console.log("Security questions verified successfully.");
        if (!response.data.emailSent) {
            console.log("However, OTP email could not be sent.");
            // Optionally handle this case, e.g., show a warning message but allow the user to proceed
        }
        onVerifyAnswers(); // Proceed to OTP step regardless of email status
    } else {
        setError(response.data.message || "Verification failed. Please try again.");
    }
    } catch (err) {
      console.error("Error verifying answers:", err);
      setError(err.response?.data?.message || "Error during verification. Please try again.");
    }
};


  return (
    <div>
      <ReusableForm onSubmit={handleSubmit}>
        {/* {token ? (
          <Alert variant="success">Token received</Alert>
        ) : (
          <Alert variant="danger">No token found</Alert>
        )} */}
        {error && <Alert variant="danger">{error}</Alert>}
        {questions.length > 0 ? (
          questions.map((item, index) => (
            <Form.Group key={index} className="mb-3">
              <Form.Label>{item.question}</Form.Label>{" "}
              {/* Make sure you are accessing the question property */}
              <Form.Control
                type="text"
                value={answers[item.question] || ""}
                onChange={(e) => handleChange(e, item.question)}
                required
              />
            </Form.Group>
          ))
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            {error ? (
              <Alert variant="danger">{error}</Alert>
            ) : (
              "Loading security questions..."
            )}
          </div>
        )}
        <Button
          type="submit"
          disabled={
            questions.length === 0 ||
            Object.values(answers).some((answer) => !answer.trim())
          }
        >
          Submit Answers
        </Button>
      </ReusableForm>
    </div>
  );
};

export default SecurityQuestionsComponent;
