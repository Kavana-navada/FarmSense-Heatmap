import React from 'react';
import styles from '../styles/ImageProcessingResult.module.css';

const ImageAnalysisResult = ({ imageUrl, healthyCount, unhealthyCount, onReset }) => {
  return (
    <section className={styles.resultContainer}>
      <h2>Chicken Health Analysis Complete</h2>
      <p className={styles.subtitle}>Below is the detection result showing bounding boxes and health classification</p>

      <div className={styles.grid}>
        <div className={styles.leftPanel}>
          <img src={imageUrl} alt="Analyzed Output" className={styles.resultImage} />
          <p className={styles.imageLabel}>Analyzed Output Image</p>
        </div>

        <div className={styles.rightPanel}>
          <h3>Analysis Summary</h3>
          <p><strong>Healthy Chickens:</strong> {healthyCount}</p>
          <p><strong>Unhealthy Chickens:</strong> {unhealthyCount}</p>

          <div className={styles.buttons}>
            <a href={imageUrl} download className={styles.downloadBtn}>Download Output</a>
            
            <button onClick={onReset} className={styles.resetBtn}>Analyze Another Image</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageAnalysisResult;