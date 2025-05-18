// ImageUploadFlow.js (State Handler)
import React, { useState, useEffect } from 'react';
import ImageUploadSection from './ImageUploadSection';
import ImageProcessingScreen from './ImageProcessingScreen';
import ImageAnalysisResult from './ImageProcessingResult';

const ImageUploadFlow = () => {
  const [step, setStep] = useState('upload');
  const [imageUrl, setImageUrl] = useState('');
  const [healthyCount, setHealthyCount] = useState(0);
  const [unhealthyCount, setUnhealthyCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

 

  const handleSubmit = async (imageFile) => {
  setStep('processing');
  setProgress(0);
  setCompletedSteps([]);

  const formData = new FormData();
  formData.append('image', imageFile);

  const url = URL.createObjectURL(imageFile);
  setImageUrl(url);

  // Animate progress bar + steps
  let p = 0;
  let s = -1;
  const steps = ['Reading Image', 'Detecting Chickens', 'Classifying Health', 'Annotating Output'];
  const interval = setInterval(() => {
    if (p >= 100) {
      clearInterval(interval);
    } else {
      p += 25;
      setProgress(p);
      if (s < steps.length) {
        setCompletedSteps((prev) => [...prev, steps[s]]);
        s++;
      }
    }
  }, 800);

  try {
    const response = await fetch('http://localhost:5000/analyze-image', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    // Ensure progress bar is full before switching screen
    const finish = () => {
      setImageUrl(`http://localhost:5000/${data.output_image}`);
      setHealthyCount(data.healthy_count);
      setUnhealthyCount(data.unhealthy_count);
      setStep('result');
    };

    // If progress is already done, go now; else wait
    if (p >= 100) {
      finish();
    } else {
      const checkReady = setInterval(() => {
        if (p >= 100) {
          clearInterval(checkReady);
          finish();
        }
      }, 300);
    }
  } catch (error) {
    console.error('Error processing image:', error);
  }
};

  const handleReset = () => {
    setStep('upload');
    setImageUrl('');
    setHealthyCount(0);
    setUnhealthyCount(0);
    setProgress(0);
    setCompletedSteps([]);
  };

  if (step === 'processing') {
    return (
      <ImageProcessingScreen
        progress={progress}
        completedSteps={completedSteps}
      />
    );
  }

  if (step === 'result') {
    return (
      <ImageAnalysisResult
        imageUrl={imageUrl}
        healthyCount={healthyCount}
        unhealthyCount={unhealthyCount}
        onReset={handleReset}
      />
    );
  }

  return <ImageUploadSection onSubmit={handleSubmit} />;
};

export default ImageUploadFlow;
