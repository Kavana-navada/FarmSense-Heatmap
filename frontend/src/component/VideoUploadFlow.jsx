// VideoUploadFlow.js
import React, { useState, useEffect } from 'react';
import VideoUploadSection from './VideoUploadSection';
import VideoProcessingScreen from './VideoProcessingScreen';
import VideoProcessingResult from './VideoProcessingResult';

const VideoUploadFlow = () => {
  const [step, setStep] = useState('upload');
  const [videoUrl, setVideoUrl] = useState('');
  const [healthyCount, setHealthyCount] = useState(0);
  const [unhealthyCount, setUnhealthyCount] = useState(0);
  const [hotspotCount, setHotspotCount] = useState(0);
  const [heatmapImg, setHeatmapImg] = useState('');
  const [progress, setProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  const steps = [
    'Analyzing Video',
    'Detecting Chickens',
    'Classifying Health',
    'Tracking Movement',
    'Preparing Results'
  ];

  const handleSubmit = async (videoFile) => {
    console.log("1")
    setStep('processing');
    setProgress(0);
    setCompletedSteps([]);

    const formData = new FormData();
    formData.append('video', videoFile);
    const url = URL.createObjectURL(videoFile);
    setVideoUrl(url);

    // Animate progress bar + steps
    let p = 0;
    let s = -1;
    const interval = setInterval(() => {
      if (p >= 100) {
        clearInterval(interval);
      } else {
        p += 20;
        setProgress(p);
        if (s < steps.length) {
          setCompletedSteps((prev) => [...prev, steps[s]]);
          s++;
        }
      }
    }, 800);

    try {
      console.log("2")
      const res = await fetch('http://localhost:5000/analyze-video', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      const finish = () => {
        setVideoUrl(`http://localhost:5000/${data.annotated_video}`);
        setHealthyCount(data.healthy_count);
        setUnhealthyCount(data.unhealthy_count);
        setHotspotCount(data.hotspots);
        setStep('result');
      };

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
      console.error('Video processing error:', error);
    }
  };

  const handleGenerateHeatmap = async () => {
    try {
      const res = await fetch('http://localhost:5000/generate-heatmap');
      const data = await res.json();
      setHeatmapImg(`http://localhost:5000/${data.heatmap_path}`);
    } catch (error) {
      console.error('Heatmap generation error:', error);
    }
  };

  const handleReset = () => {
    setStep('upload');
    setVideoUrl('');
    setHealthyCount(0);
    setUnhealthyCount(0);
    setHotspotCount(0);
    setHeatmapImg('');
    setProgress(0);
    setCompletedSteps([]);
  };

  if (step === 'processing') {
    return <VideoProcessingScreen progress={progress} completedSteps={completedSteps} />;
  }

  if (step === 'result') {
    return (
      <VideoProcessingResult
        videoUrl={videoUrl}
        healthyCount={healthyCount}
        unhealthyCount={unhealthyCount}
        hotspotCount={hotspotCount}
        heatmapImg={heatmapImg}
        onGenerateHeatmap={handleGenerateHeatmap}
        onReset={handleReset}
      />
    );
  }

  return <VideoUploadSection onSubmit={handleSubmit} />;
};

export default VideoUploadFlow;
