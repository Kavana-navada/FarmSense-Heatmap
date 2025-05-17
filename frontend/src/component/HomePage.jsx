import React from 'react';
import styles from "../styles/HomePage.module.css";
import ImageUploadSection from './ImageUploadSection';
import VideoUploadSection from './VideoUploadSection';
const HomePage = () => {
  return (
    <>
    <header className={styles.heroContainer}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>🐔 FarmSense</div>
      </nav>

      <div className={styles.heroContent}>
        <h1>
           Heatmap AI - FarmSense<br /><span className={styles.highlight}>Chicken Health Detection & Heatmap Generation</span>
        </h1>
        <p>
          Upload poultry images or videos to detect chicken health status<br />
          and visualize overcrowding with smart heatmaps.
        </p>

        <div className={styles.buttonGroup}>
          <button className={styles.primary}>Upload Image</button>
          <button className={styles.secondary}>Upload Video</button>
        </div>

        <p className={styles.scroll}>Scroll to begin ↓</p>
      </div>
    </header>
    <VideoUploadSection/>
    <ImageUploadSection/>
    </>
  );
};

export default HomePage;
