import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setProcessedImage(null);
  };

  const handleImageUpload = async () => {
    if (!image) return alert('Please select an image.');

    const formData = new FormData();
    formData.append('image', image);

    try {
      const res = await axios.post('http://127.0.0.1:5000/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
      });

      const imageBlob = res.data;
      const imageUrl = URL.createObjectURL(imageBlob);
      setProcessedImage(imageUrl);
    } catch (err) {
      alert('Image upload failed.');
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '30px auto', textAlign: 'center' }}>
      <h2>🖼️ Upload Image for Health Detection</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <br /><br />
      <button onClick={handleImageUpload}>Upload Image</button>

      {processedImage && (
        <div>
          <h3>🔍 Analyzed Result</h3>
          <img src={processedImage} alt="Processed" style={{ width: '100%', marginTop: '20px' }} />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
