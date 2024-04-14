import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth0 } from "@auth0/auth0-react";
import { FaMoneyBillAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/ImageUpload.css";

const UploadAndDisplayImage = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const navigate = useNavigate();

  const goToTalkBot = () => {
    navigate("/talkbot"); // The path you defined for TalkBot in your routes
  };

  const goToTalkBot02 = () => {
    navigate("/talkbot02"); // The path you defined for TalkBot in your routes
  };

  // 1. ADD: STATE TO STORE RESPONSE TEXT DATA
  const [textData, setTextData] = useState(null);

  const { user } = useAuth0();
  const uploadImage = async () => {
    // clicking this button will send image to server

    // if no image, need to alert user to get one
    if (!selectedImage) {
      alert("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage); // "file" for backend endpoint
    formData.append("insurance", "UNITED HEALTHCARE");

    formData.append("userName", user.name);
    formData.append("userEmail", user.email);

    console.log(user.name);
    console.log(user.email);
    console.log(formData);

    // use HTTP response to send data
    try {
      const response = await fetch("http://127.0.0.1:5000/image", {
        // replace with endpoint URL
        method: "POST",
        body: formData,
      });

      console.log("Response from backend:", response);
      // if no correct status code, throw error
      if (!response.ok) {
        throw new Error("Failed to upload image");
      }
      const textData = await response.json();

      // 2. UPDATE STATE
      setTextData(textData);

      console.log("Received JSON from backend:", textData);

      // todo: handle success response
      // need to send something to user indicating such
    } catch (error) {
      console.error("Uploading failed", error);
      // further error handling steps?
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", height: "100vh" }}>
      {/* Left half (White background) */}
      <div
        style={{
          flex: 1,
          color: "#095d7e",
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FaMoneyBillAlt size={150} />
        <h1 style={{ marginTop: "20px" }}> Trans-Bill </h1>
        <h1> Medical Bill Error Detector </h1>

        <div onClick={goToTalkBot} className="div-button">
          Know more about Insurances.
        </div>
        {textData &&
          Object.entries(textData)
            .filter(
              ([code, details]) =>
                details.percent_difference < 0 &&
                Math.abs(details.percent_difference) > 10
            )
            .map(([code, details]) => (
              <div key={code}>
                <p>
                  <strong>Code:</strong> {code}
                </p>
                <p>
                  <strong>Your Cost:</strong> ${details.your_cost}
                </p>
                <p>
                  <strong>Average Cost:</strong> ${details.avg_cost.toFixed(2)}
                </p>
                <p>
                  <strong>Percent Difference:</strong>
                  <span style={{ color: "red" }}>
                    {details.percent_difference.toFixed(2)}%
                  </span>
                </p>
                <div className="talkbotbuttons">
                  <div onClick={goToTalkBot02} className="div-button">
                    Get Personalized Assistance
                  </div>
                </div>
              </div>
            ))}
      </div>

      {/* Right half (Blue background) */}
      <div
        style={{
          flex: 1,
          color: "white",
          backgroundColor: "#095d7e",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="text-center">
          <h2>Get Started with Your Bill Analysis</h2>
          <div>
            Upload your medical bill to check for discrepancies and potential
            overcharges. Our analysis is quick, secure, and confidential.
          </div>

          {selectedImage && (
            <div className="mt-3">
              <img
                alt="Selected"
                width={"250px"}
                src={URL.createObjectURL(selectedImage)}
                className="img-thumbnail"
              />
              <br />
              <button
                className="btn btn-danger mt-2"
                onClick={() => setSelectedImage(null)}
              >
                Remove Image
              </button>
            </div>
          )}

          <div className="form-group mt-4">
            <input
              id="fileInput"
              className="file-input"
              type="file"
              name="myImage"
              onChange={(event) => setSelectedImage(event.target.files[0])}
              style={{ display: "none" }} // Hide the actual file input
            />
            <label htmlFor="fileInput" className="btn btn-file-input">
              Choose File
            </label>
            <button className="btn btn-upload" onClick={uploadImage}>
              Upload Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadAndDisplayImage;
