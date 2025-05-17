// Updated ImageUploadSection.jsx to trigger processing screen
import React, { useState } from 'react';
import styles from '../styles/VideoUploadSection.module.css';
import { FaImage, FaTimesCircle, FaCloudUploadAlt } from 'react-icons/fa';

const ImageUploadSection = ({ onSubmit }) => {
  const [imageFile, setImageFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) {
      setImageFile(e.dataTransfer.files[0]);
    }
  };

  const removeFile = () => setImageFile(null);

  const formatSize = (size) => (size / 1024).toFixed(1) + ' KB';

  const handleAnalyze = () => {
    if (imageFile && onSubmit) {
      onSubmit(imageFile);
    }
  };

  return (
    <section className={styles.ImguploadSection}>
      <h2>Upload Chicken Image</h2>
      <p className={styles.subtitle}>
        Select or drag & drop a chicken image to detect bounding boxes and health status (Healthy / Unhealthy)
      </p>

      <div
        className={`${styles.uploadCard} ${dragOver ? styles.dragActive : ''}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {!imageFile ? (
          <>
            <FaCloudUploadAlt size={48} color="#28a745" />
            <h3>Upload your image</h3>
            <p>Drag and drop your image file here, or click to browse (JPG, PNG, JPEG)</p>
            <label className={styles.uploadButton}>
              Browse Files
              <input type="file" accept="image/*" onChange={handleFileChange} hidden />
            </label>
            <p className={styles.note}>Maximum file size: 5MB</p>
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
            <div className={styles.fileInfo} style={{ background: "#f8faff" }}>
              <FaImage size={28} color="#28a745" />
              <div>
                <p className={styles.fileName}>{imageFile.name}</p>
                <p className={styles.fileSize}>{formatSize(imageFile.size)}</p>
              </div>
            </div>

            <button className={styles.generateButton} onClick={handleAnalyze}>
              Analyze Image
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ImageUploadSection;
