// components/ImageProcessingScreen.jsx
import React from 'react';
import styles from '../styles/ImageProcessingScreen.module.css';
const ImageProcessingScreen = () => {
  return (
    <div className={styles.container}>
      <h2>Analyzing Image</h2>
      <p>This may take a few seconds depending on the image size</p>
      <div className={styles.spinner}></div>
      <div className={styles.progressBar}>
        <div className={styles.progress}></div>
      </div>
      <ul className={styles.steps}>
        <li className={styles.active}>1. Reading Image</li>
        <li>2. Detecting Chickens</li>
        <li>3. Classifying Health</li>
        <li>4. Annotating Output</li>
      </ul>
      <p className={styles.processingMsg}>Running detection model and preparing output image...</p>
    </div>
  );
};

export default ImageProcessingScreen;