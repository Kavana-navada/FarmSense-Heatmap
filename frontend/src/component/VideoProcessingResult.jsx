import React from 'react';
import styles from '../styles/VideoProcessingResult.module.css';

const VideoProcessingResult = ({
  videoUrl,
  healthyCount,
  unhealthyCount,
  hotspotCount,
  onGenerateHeatmap,
  onReset,
  heatmapImg
}) => {

  const handleDownloadVideo = () => {
    const link = document.createElement('a');
    link.href = videoUrl;
   // link.download = 'analyzed_video.mp4';
    link.click();
  };

  const handlePlayVideo = () => {
    window.open(videoUrl, '_blank');
  };

  return (
    <section className={styles.resultContainer}>
      <h2>Video Analysis Complete</h2>
      <p className={styles.subtitle}>
        The video has been analyzed for chicken health and movement activity.
      </p>

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
            <button className={styles.playBtn} onClick={handlePlayVideo}>▶ Play Video</button>
            <button className={styles.downloadBtn} onClick={handleDownloadVideo}>⬇ Download Video</button>
            <button className={styles.resetBtn} onClick={onReset}>Analyze Another Video</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoProcessingResult;
