// VideoProcessingScreen.jsx
import React from 'react';
import styles from '../styles/ImageProcessingScreen.module.css';
import { FaCheck } from 'react-icons/fa';

const VideoProcessingScreen = ({ progress, completedSteps }) => {
  const steps = [
    'Analyzing Video',
    'Detecting Chickens',
    'Classifying Health',
    'Tracking Movement',
    'Preparing Results'
  ];

  return (
    <div className={styles.container}>
      <h2>Analyzing Video</h2>
      <p>This may take a few minutes depending on the video length</p>

      <div className={styles.spinner}></div>

      <div className={styles.progressBarWrapper}>
        <div className={styles.progressBar}>
          <div className={styles.progress} style={{ width: `${progress}%` }}></div>
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
            {index + 1} {step}{' '}
            {completedSteps.includes(step) ? (
              <FaCheck size={15} color="#28a745" />
            ) : (
              ' '
            )}
          </li>
        ))}
      </ul>

      <p className={styles.processingMsg}>
       Analyzing video frames and extracting chicken health and activity data...
      </p>
    </div>
  );
};

export default VideoProcessingScreen;

    