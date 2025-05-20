// VideoUploadFlow.js
import React, { useState } from 'react';
import VideoUploadSection from './VideoUploadSection';
import VideoProcessingScreen from './VideoProcessingScreen';
import VideoProcessingResult from './VideoProcessingResult';

const VideoUploadFlow = () => {
  const [step, setStep] = useState('upload');
  const [videoUrl, setVideoUrl] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
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
    setStep('processing');
    setProgress(0);
    setCompletedSteps([]);

    const formData = new FormData();
    formData.append('video', videoFile);

    let p = 0;
    let s = -1;
    const interval = setInterval(() => {
      if (p >= 99) {
        clearInterval(interval);
      } else {
        p += 1;
        setProgress(p);
        if (s < steps.length) {
          setCompletedSteps((prev) => [...prev, steps[s]]);
          s++;
        }
      }
    }, 1000);

    try {
      const res = await fetch('http://localhost:5000/analyze-video', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      const finish = () => {
        setDownloadUrl(`http://localhost:5000/videooutputs/${data.annotated_video}`);
        setVideoUrl(`http://localhost:5000/videooutputs/${data.annotated_video}`);
        setHealthyCount(data.healthy_count);
        setUnhealthyCount(data.unhealthy_count);
        setHotspotCount(data.hotspots);
        setStep('result');
      };

      if (p >= 99) {
        finish();
      } else {
        const checkReady = setInterval(() => {
          if (p >= 99) {
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

  const handlePlayExternally = () => {
    window.open(videoUrl, '_blank'); // open in VLC or new tab (VLC needs to be default handler)
  };

  const handleReset = () => {
    setStep('upload');
    setVideoUrl('');
    setDownloadUrl('');
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
        downloadUrl={downloadUrl}
        healthyCount={healthyCount}
        unhealthyCount={unhealthyCount}
        hotspotCount={hotspotCount}
        heatmapImg={heatmapImg}
        onGenerateHeatmap={handleGenerateHeatmap}
        onPlayExternally={handlePlayExternally}
        onReset={handleReset}
      />
    );
  }

  return <VideoUploadSection onSubmit={handleSubmit} />;
};

export default VideoUploadFlow;
