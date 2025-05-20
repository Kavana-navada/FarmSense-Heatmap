// VideoProcessingScreen.jsx
import React, { useState } from "react";
import styles from "../styles/VideoProcessingScreen.module.css";
import { FaCheck } from "react-icons/fa";

const VideoProcessingScreen = ({
  progress,
  completedSteps,
  onGenerateHeatmap,
  onReset,
  heatmapImg,
  videoUrl,
  
}) => {
  const steps = [
    "Analyzing Video",
    "Detecting Chickens",
    "Classifying Health",
    "Tracking Movement",
    "Preparing Results",
  ];

  const [heatmapGenerated, setHeatmapGenerated] = useState(false);

  const handleGenerate = async () => {
    await onGenerateHeatmap();
    setHeatmapGenerated(true);
  };

  return (
    <div className={styles.container}>
      <h2>Analyzing Video</h2>
      <p>This may take a few minutes depending on the video length</p>

      {progress < 100 && <div className={styles.spinner}></div>}

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
            {index + 1} {step}{" "}
            {completedSteps.includes(step) && (
              <FaCheck size={15} color="#28a745" />
            )}
          </li>
        ))}
      </ul>

      {(progress !== 100) ? (
        <p className={styles.processingMsg}>
          Analyzing video frames and extracting chicken health and activity
          data...<br />
          <span  className={styles.processingMsg}>Please Wait</span>
          
        </p>
        
      ) : (
        <div className={styles.resultPanel}>
          <div className={styles.buttonRow}>
             <a
              href={videoUrl}
              className={styles.primaryBtn}
              target="_blank"
              rel="noreferrer"
            >
              Play Video
            </a>
            {heatmapGenerated ? (
              <a href={heatmapImg} download className={styles.downloadLink}>
                Download Heatmap
              </a>
            ) : (
              <button className={styles.generateBtn} onClick={handleGenerate}>
                Generate Heatmap
              </button>
            )}

            <button className={styles.resetBtn} onClick={onReset}>
              Analyze Another Video
            </button>
          </div>

          {heatmapImg && heatmapGenerated && (
            <div className={styles.heatmapWrapper}>
              <img
                src={heatmapImg}
                alt="Heatmap"
                className={styles.heatmapImage}
              />
              {/* <a href={heatmapImg} download className={styles.}>
                Download Heatmap
              </a> */}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoProcessingScreen;
