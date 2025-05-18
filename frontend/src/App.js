import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './component/HomePage';
import VideoUploadSection from './component/VideoUploadSection';
import ImageUploadSection from './component/ImageUploadSection';
import ImageProcessingScreen from './component/ImageProcessingScreen';
import ImageProcessingResult from './component/ImageProcessingResult';
import ImageUploadFlow from './component/ImageUploadFlow';
import VideoUploadFlow from './component/VideoUploadFlow';
import VideoProcessingScreen from './component/VideoProcessingScreen';
import VideoProcessingResult from './component/VideoProcessingResult';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/upload-video/*" element={<VideoUploadFlow />} />
        <Route path="/upload-image/*" element={<ImageUploadFlow />} />
        <Route path="/process-image" element={<ImageProcessingScreen />} />
        <Route path="/image-result" element={<ImageProcessingResult />} />
        <Route path="/process-video" element={<VideoProcessingScreen />} />
        <Route path="/video-result" element={<VideoProcessingResult />} />
       

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;