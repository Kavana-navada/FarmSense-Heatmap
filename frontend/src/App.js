import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './component/HomePage';
import VideoUploadSection from './component/VideoUploadSection';
import ImageUploadSection from './component/ImageUploadSection';
import ImageProcessingScreen from './component/ImageProcessingScreen';
import ImageProcessingResult from './component/ImageProcessingResult';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/upload-video" element={<VideoUploadSection />} />
        <Route path="/upload-image" element={<ImageUploadSection />} />
        <Route path="/process-image" element={<ImageProcessingScreen />} />
        <Route path="/image-result" element={<ImageProcessingResult />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;