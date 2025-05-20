import React, { useState } from 'react';
import styles from '../styles/ImgVideoUploadSection.module.css';
import { FaPlayCircle, FaTimesCircle, FaCloudUploadAlt } from 'react-icons/fa';

const VideoUploadSection = ({onSubmit}) => {
  const [videoFile, setVideoFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (isValidVideo(file)) {
      setVideoFile(file);
    } else {
      alert('Please upload a valid video file (MP4, MOV, AVI, WEBM).');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (isValidVideo(file)) {
      setVideoFile(file);
    } else {
      alert('Only video files are allowed.');
    }
  };

  const removeFile = () => setVideoFile(null);

  const formatSize = (size) => (size / 1024 / 1024).toFixed(2) + ' MB';

  const isValidVideo = (file) => {
    const acceptedTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/webm'];
    return file && acceptedTypes.includes(file.type);
  };

  const handleAnalyze = () => {
 
    if (videoFile) {
    
      console.log(videoFile)
    }
    if(onSubmit){
      console.log("5")
      console.log(onSubmit)
    }
    if (videoFile && onSubmit) { 
      onSubmit(videoFile);
    }
  } 

  return (
    <section className={styles.uploadSection}>
      <h2>Upload Poultry Farm Video</h2>
      <p className={styles.subtitle}>
        Select or drag & drop your poultry farm video to detect chicken and generate a heatmap 
      </p>

      <div
        className={`${styles.uploadCard} ${dragOver ? styles.dragActive : ''}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {!videoFile ? (
          <>
            <FaCloudUploadAlt size={48} color="#007bff" />
            <h3>Upload your video</h3>
            <p>Drag and drop your video file here, or click to browse files (MP4, MOV, AVI, WEBM)</p>
            <label className={styles.uploadButton}>
              Browse Files
              <input type="file" accept="video/*" onChange={handleFileChange} hidden />
            </label>
            <p className={styles.note}>Maximum file size: 100MB</p>
          </>
        ) : (
          <div className={styles.fileBox}>
            <div className={styles.selectedFile}>
                <p>Selected File</p>
                <FaTimesCircle
              className={styles.removeIcon}
              size={20}
              onClick={removeFile}
              title="Remove File"
            />
            </div>
            <div className={styles.fileInfo}>
              <FaPlayCircle size={28} color="#007bff" />
              <div>
                <p className={styles.fileName}>{videoFile.name}</p>
                <p className={styles.fileSize}>{formatSize(videoFile.size)}</p>
              </div>
              
            </div>
            
            <button className={styles.generateButton} onClick={handleAnalyze} disabled={!isValidVideo(videoFile)}>Analyze Video</button>
          </div>
        )}
      </div>
    </section>
  );
};

export default VideoUploadSection;
