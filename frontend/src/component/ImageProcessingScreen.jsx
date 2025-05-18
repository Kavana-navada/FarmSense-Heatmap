// ImageProcessingScreen.jsx
import React from "react";
import styles from "../styles/ImageProcessingScreen.module.css";
import { FaCheck } from "react-icons/fa";

const ImageProcessingScreen = ({ progress, completedSteps }) => {
  const steps = [
    "Reading Image",
    "Detecting Chickens",
    "Classifying Health",
    "Annotating Output",
  ];

  return (
    <div className={styles.container}>
      <h2>Analyzing Image</h2>
      <p>This may take a few seconds depending on the image size</p>

      <div className={styles.spinner}></div>

      <div className={styles.progressBarWrapper}>
        <div className={styles.progressBar}>
          <div
            className={styles.progress}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className={styles.progressText}>{progress}%</p>
      </div>

      <ul className={styles.steps}>
        {steps.map((step, index) => (
          <li
            key={index}
            className={
              completedSteps.includes(step) ? styles.active : styles.pending
            }
          >
            
            {index+1}{" "}{step} {" "}{completedSteps.includes(step) ? (
              <FaCheck size={15} color="#007bff" />
            ) : (
              `${" "}`
            )}
          </li>
        ))}
      </ul>

      <p className={styles.processingMsg}>
        Running detection model and preparing output image...
      </p>
    </div>
  );
};

export default ImageProcessingScreen;
