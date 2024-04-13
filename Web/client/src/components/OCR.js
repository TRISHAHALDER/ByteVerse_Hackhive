import React, { useEffect, useState } from "react";
import { createWorker } from "tesseract.js";
import "../App1.css";

function OCR() {
  const [ocrText, setOcrText] = useState("");
  const [progress, setProgress] = useState(0);
  const [imageData, setImageData] = useState(null);
  const worker = createWorker({
    logger: (m) => {
      setProgress((m.progress * 100).toFixed(2));
    },
  });

  const convertImageToText = async () => {
    if (!imageData) return;
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const {
      data: { text },
    } = await worker.recognize(imageData);
    setOcrText(text);
  };

  useEffect(() => {
    convertImageToText();
  }, [imageData]);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageDataUri = reader.result;
      setImageData(imageDataUri);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="App">
      <div>
        <span className="source-file">
          <label htmlFor="file-source">Choose an Image</label>
          <input
            type="file"
            id="file-source"
            onChange={(e) => handleImageChange(e)}
            accept="image/*"
          />
        </span>
        <img src={imageData} alt="" className="image-preview" />
      </div>
      <div className="display-flex">
        <span className="progress">
          <label htmlFor="progress"> progress - {progress}%</label>
          <meter
            id="progress"
            min="0"
            max="100"
            low={30}
            high={60}
            optimum={90}
            value={progress}
          >
            0%
          </meter>
        </span>
        <p>{ocrText}</p>
      </div>
    </div>
  );
}

export default OCR;
