// src/components/ReusableForm.js
import React from "react";
import Logo from "../../assets/images/logo.png"; // Adjust the path as necessary
import { Form } from "react-bootstrap";

const ReusableForm = ({ onSubmit, children }) => {
  return (
    <Form className="shadow p-4 bg-white rounded" onSubmit={onSubmit}>
      <img
        className="img-thumbnail mx-auto d-block mb-2"
        src={Logo}
        alt="logo"
        style={{ width: '85px', height: 'auto' }}
      />

      {children}
    </Form>
  );
};

export default ReusableForm;
