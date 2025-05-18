import React from 'react';
import styles from '../styles/VideoProcessingResult.module.css';

const VideoProcessingResult = ({ videoUrl, healthyCount, unhealthyCount, hotspotCount, onGenerateHeatmap, onReset, heatmapImg }) => {
  return (
    <section className={styles.resultContainer}>
      <h2>Video Analysis Complete</h2>
      <p className={styles.subtitle}>The video has been analyzed for chicken health and movement activity.</p>
      <video src={videoUrl} controls className={styles.fullVideo} />
      <p className={styles.videoLabel}>Analyzed Video Preview</p>

      <div className={styles.resultGrid}>
        {heatmapImg && (
          <div className={styles.heatmapLeft}>
            <h4 className={styles.heatmapTitle}>Density-Based Heatmap</h4>
            <img src={heatmapImg} alt="Heatmap" className={styles.heatmapImage} />
          </div>
        )}

        <div className={styles.summaryRight}>
          <h3>Analysis Summary</h3>
          <p><strong>Healthy Chickens:</strong> {healthyCount}</p>
          <p><strong>Unhealthy Chickens:</strong> {unhealthyCount}</p>
          <p><strong>Total Chickens:</strong> {healthyCount + unhealthyCount}</p>
          <p><strong>Activity Hotspots:</strong> {hotspotCount}</p>

          <div className={styles.buttons}>
            <button className={styles.heatmapBtn} onClick={onGenerateHeatmap}>Generate Heatmap</button>
            <button className={styles.resetBtn} onClick={onReset}>Analyze Another Video</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoProcessingResult;
