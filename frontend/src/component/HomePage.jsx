import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "../styles/HomePage.module.css";
import ImageUploadSection from './ImageUploadSection';
import VideoUploadSection from './VideoUploadSection';
import ImageUploadFlow from './ImageUploadFlow';

const HomePage = () => {
  const navigate = useNavigate();
  const scrollToImageUpload = () => {
    const imageUploadSection = document.getElementById('image-upload-section');
    if (imageUploadSection) {
      imageUploadSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const goToImageUpload = () => {
  navigate('/upload-image');
};

  const scrollToVideoUpload = () => {
    const videoUploadSection = document.getElementById('video-upload-section');
    if (videoUploadSection) {
      videoUploadSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
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
          <button className={styles.primary} onClick={scrollToImageUpload}>Upload Image</button>
          <button className={styles.secondary} onClick={scrollToVideoUpload}>Upload Video</button>
        </div>

        <p className={styles.scroll}>Scroll to begin ↓</p>
      </div>
    </header>
    <div id="video-upload-section">
    <VideoUploadSection/>
</div>
   <div id="image-upload-section" className={styles.imageUploadSection}>
  <ImageUploadFlow />
</div>

    </>
  );
};

export default HomePage;
