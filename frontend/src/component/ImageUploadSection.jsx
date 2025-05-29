// Updated ImageUploadSection.jsx to trigger processing screen
import React, { useState } from 'react';
import styles from '../styles/ImgVideoUploadSection.module.css';
import { FaImage, FaTimesCircle, FaCloudUploadAlt } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ImageUploadSection = ({ onSubmit }) => {
  const [imageFile, setImageFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (isValidImage(file)) {

    setImageFile(file);
    
  } else {
      toast.error('Please upload a valid image file only (JPG, PNG, etc).');

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
  if (isValidImage(file)) {
    setImageFile(file);
   
  } else {

      toast.error('Only image files are allowed.');
  }
};


  const removeFile = () => setImageFile(null);

  const formatSize = (size) => (size / 1024).toFixed(1) + ' KB';

  const handleAnalyze = () => {
    if (imageFile && onSubmit) {
      onSubmit(imageFile);
      console.log("Image file submitted for analysis:", imageFile);
    }
  };

  const isValidImage = (file) => {
  const acceptedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
  return file && acceptedTypes.includes(file.type);
};


  return (
    <>
    <section className={styles.ImguploadSection}>
      <h2>Upload Chicken Image</h2>
      <p className={styles.subtitle}>
        Select or drag & drop a chicken image to detect bounding boxes and health status (Healthy / Unhealthy)
      </p>

      <div
        className={`${styles.uploadCard} ${dragOver ? styles.dragActive : ''}`} style={{background: "#111010"}}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {!imageFile ? (
          <>
            <FaCloudUploadAlt size={48} color="#28a745" />
            <h3>Upload your image</h3>
            <p>Drag and drop your image file here, or click to browse (JPG, PNG, JPEG, WEBP)</p>
            <label className={styles.uploadButton}>
              Browse Files
              <input type="file" accept="image/*" onChange={handleFileChange} hidden />
            </label>
            {/* <p className={styles.note}>Maximum file size: 5MB</p> */}
          </>
        ) : (
          <div className={styles.fileBox} >
            <div className={styles.selectedFile}>
              <p>Selected File</p>
              <FaTimesCircle
                className={styles.removeIcon}
                size={20}
                onClick={removeFile}
                title="Remove File"
              />
            </div>
            <div className={styles.fileInfo} style={{boxShadow:"0 2px 6px rgba(27, 27, 27, 1)" }}>
              <FaImage size={28} color="#28a745" />
              <div>
                <p className={styles.fileName}>{imageFile.name}</p>
                <p className={styles.fileSize}>{formatSize(imageFile.size)}</p>
              </div>
            </div>

            <button className={styles.generateButton} onClick={handleAnalyze} disabled={!isValidImage(imageFile)}>
              Analyze Image
            </button>
            <ToastContainer position="top-center" autoClose={3000} />
          </div>
          
        )}
      </div>
    </section>
 
    
    </>
  );
};

export default ImageUploadSection;
