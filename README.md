# 🐔 Heatmap AI FarmSense

An AI-powered poultry monitoring system that detects and classifies chickens as healthy or unhealthy and visualizes their movement using spatial heatmaps. Designed to help poultry farmers reduce manual labor and optimize space and animal welfare.

---

## 📌 Problem Statement

Manual monitoring in poultry farms is time-consuming and error-prone. Farmers struggle to identify overcrowded zones and early signs of sickness. This project automates the tracking of chickens and generates spatial heatmaps, giving actionable insights into flock distribution and health.

---

## 🎯 Objectives

- 🐥 Detect chickens using YOLOv8
- ❤️ Classify chickens as healthy or unhealthy
- 🎥 Track individual chickens using SORT
- 🗺️ Generate spatial heatmaps of movement density
- 📊 Assist farmers in optimizing space and improving flock health

---

## 🧠 Methodology

### 1. Data Collection
- **2,400 images** collected and annotated using [Roboflow](https://roboflow.com)
- Exported in **YOLOv8 format**

### 2. Preprocessing & Augmentation
- Image size: **640×640**
- Applied:
  - Horizontal flipping
  - Rotation
  - Grayscale conversion
  - Brightness adjustment

### 3. Model Training
- **Model:** YOLOv8s
- **Epochs:** 50
- **Performance:**
  - Precision: **82.26%**
  - Recall: **86.71%**
  - mAP@0.5: **91.44%**

### 4. Object Detection & Tracking
- Tracked using **SORT** algorithm
- Calculated centroids used to build heatmaps

### 5. Health Classification
- Binary classification: `healthy_chicken` vs `unhealthy_chicken`
- Based on feather condition and posture

### 6. Heatmap Generation
- Centroid coordinates mapped into a 2D matrix
- Gaussian blur applied for smooth intensity mapping
- Color-coded using JET colormap

---

## 📊 Results

| Feature | Status |
|--------|--------|
| 🖼️ Image detection | ✅ |
| 🎥 Video tracking | ✅ |
| 🚦 Health classification | ✅ |
| 🗺️ Heatmap generation | ✅ |
| 💾 Output download | ✅ |

> Sample outputs include detection overlays and interactive heatmaps for poultry distribution analysis.

---

## 🖥️ Tech Stack

- **Frameworks**: YOLOv8, SORT
- **Language**: Python
- **Libraries**: OpenCV, NumPy, Matplotlib, Seaborn, Flask (backend), React (frontend)
- **Platform**: Google Colab, local Flask-React deployment

---


