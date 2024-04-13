import React, { useState } from "react";
// import UploadImagePage from "./UploadImagePage";
import "../styles/InsuranceForm.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const InsuranceForm = ({ userData }) => {
  const [insuranceName, setInsuranceName] = useState("");
  const [address, setAddress] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if userData is available and email matches
    if (!userData || userData.email !== event.target.email.value) {
      console.error("Unauthorized access");
      return;
    }

    const formData = {
      insuranceName,
      address,
      email: userData.email,
    };

    try {
      const response = await axios.post("/api/auth/submitForm", formData); // Assuming the endpoint is '/api/submit_insurance_form'

      if (!response.data.success) {
        throw new Error(`Server error: ${response.data.message}`);
      }

      setSubmitted(true);
    } catch (error) {
      console.error("There was an error submitting the form:", error);
    }
  };

  // if (submitted) {
  //   return <UploadImagePage />;
  // }

  if (submitted) {
    return 'Yes';
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="centered-form">
        <h5>Almost there!</h5>
        <div>
          Please provide us some more basic information to provide personalize
          and accurate information.
        </div>
        <div className="form-group">
          <label htmlFor="insuranceName">Insurance Name:</label>
          <input
            type="text"
            id="insuranceName"
            value={insuranceName}
            onChange={(e) => setInsuranceName(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="form-control"
          />
        </div>
        {/* Pass email as hidden input */}
        <input type="hidden" name="email" value={userData ? userData.email : ""} />
        {/* Submit button */}
        <div className="button-container">
          <button type="submit" className="submit-button">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default InsuranceForm;
