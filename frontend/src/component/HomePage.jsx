import React from 'react';
import styles from "../styles/HomePage.module.css";
import ImageUploadFlow from './ImageUploadFlow';
import {FaAngleDown} from 'react-icons/fa';
import VideoUploadFlow from './VideoUploadFlow';

const HomePage = () => {
  const scrollToImageUpload = () => {
    const imageUploadSection = document.getElementById('image-upload-section');
    if (imageUploadSection) {
      imageUploadSection.scrollIntoView({ behavior: 'smooth' });
    }
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
      <img src="/bghenleft.png" alt="Hen Left" className={styles.henLeft} />
      <nav className={styles.navbar}>
        <div className={styles.logoWrapper}>
        <div className={styles.logoText}>🐔 FarmSense</div>
        </div>
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

        <p className={styles.scroll}>Scroll to begin <br /><button onClick={scrollToVideoUpload} className={styles.downArrow}><FaAngleDown size={20}/></button></p>
        
      </div>
       <img src="/bghen.png" alt="Hen Right" className={styles.henRight} />
    </header>
    <div id="video-upload-section">
    <VideoUploadFlow/>
</div>
   <div id="image-upload-section" className={styles.imageUploadSection}>
  <ImageUploadFlow />
</div>

    </>
  );
};

export default HomePage;
