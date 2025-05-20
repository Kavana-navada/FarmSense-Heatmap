// VideoUploadFlow.js
import React, { useState } from 'react';
import VideoUploadSection from './VideoUploadSection';
import VideoProcessingScreen from './VideoProcessingScreen';

const VideoUploadFlow = () => {
  const [step, setStep] = useState('upload');
  const [videoUrl, setVideoUrl] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [heatmapImg, setHeatmapImg] = useState('');
  const [progress, setProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [showButtons, setShowButtons] = useState(false);
  const [heatmapGenerated, setHeatmapGenerated] = useState(false);

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
    setShowButtons(false);
    setHeatmapGenerated(false);

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
        if (p===12||p===36||p===63||p===87) {
          if (s < steps.length - 1) {
            //setStep(steps[s + 1]);
          setCompletedSteps((prev) => [...prev, steps[s]]);
          s++;
          }
        }
      }
    }, 1000);

    try {
      const res = await fetch('http://localhost:5000/analyze-video', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      setProgress(100);
      setCompletedSteps(steps);
      console.log('completed steps:', steps);
      p=100;
      
        setDownloadUrl(`http://localhost:5000/videooutputs/${data.annotated_video}`);
        setVideoUrl(`http://localhost:5000/videooutputs/${data.annotated_video}`);
      
        setShowButtons(true);
        console.log('completed:');
      
    } catch (error) {
      console.error('Video processing error:', error);
    }
  };

  const handleGenerateHeatmap = async () => {
    try {
      const res = await fetch('http://localhost:5000/generate-heatmap');
      const data = await res.json();
      setHeatmapImg(`http://localhost:5000/${data.heatmap_path}`);
      setHeatmapGenerated(true);
    } catch (error) {
      console.error('Heatmap generation error:', error);
    }
  };

  const handlePlayExternally = () => {
    window.open(videoUrl, '_blank');
  };

  const handleReset = () => {
    setStep('upload');
    setVideoUrl('');
    setDownloadUrl('');
    setHeatmapImg('');
    setProgress(0);
    setCompletedSteps([]);
    setShowButtons(false);
    setHeatmapGenerated(false);
  };

  if (step === 'processing') {
    return (
      <VideoProcessingScreen
        progress={progress}
        completedSteps={completedSteps}
        showButtons={showButtons}
        videoUrl={videoUrl}
        downloadUrl={downloadUrl}
        heatmapImg={heatmapImg}
        heatmapGenerated={heatmapGenerated}
        onGenerateHeatmap={handleGenerateHeatmap}
        onPlayExternally={handlePlayExternally}
        onReset={handleReset}
      />
    );
  }

  return <VideoUploadSection onSubmit={handleSubmit} />;
};

export default VideoUploadFlow;
