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

## 🖥️ Tech Stack

- **Frontend:** React.js  
- **Backend:** Flask (Python), Flask-CORS  
- **Model:** YOLOv8 (Ultralytics)  
- **Tracking:** SORT (Simple Online and Realtime Tracking)  
- **Libraries:** OpenCV, NumPy, Matplotlib, PIL, Scipy 

---
## 🚀 Getting Started

Follow these instructions to set up the project locally and run it on your machine.

### 🔧 Prerequisites

Make sure you have the following installed:

- Python 3.10+
- Flask
- pip (Python package manager)
- Git
- Node.js & npm (for frontend)
- [YOLOv8 Requirements](https://docs.ultralytics.com/) (Ultralytics library)
- Google Chrome or any modern browser

---
### 📥 Clone the Repository

```bash
git clone https://github.com/Kavana-navada/FarmSense-Heatmap.git
cd Heatmap-AI-FarmSense
```
🧠 Backend Setup (Flask API)
Navigate to the backend folder:

```bash
cd backend
```
Create a virtual environment and activate it:

```bash
python -m venv venv
venv\Scripts\activate
```
Run the Flask server:

```bash
python app.py
```
The API will run on http://127.0.0.1:5000/

🌐 Frontend Setup (React Interface)
Navigate to the frontend folder:

```bash
cd ../frontend
```
Install React dependencies:
```bash
npm install
```
Run the frontend development server:
```bash
npm start
```
The interface will open at http://localhost:3000/

---
## ✅ Running the System

Upload an image or video via the frontend.

The system will detect chickens, classify health, track movement, and generate a heatmap.

You can download the annotated video or image and also view the heatmap overlay.

---
## 📊 Results

| Feature | Status |
|--------|--------|
| 🖼️ Image detection | ✅ |
| 🎥 Video tracking | ✅ |
| 🚦 Health classification | ✅ |
| 🗺️ Heatmap generation | ✅ |
| 💾 Output download | ✅ |

---

## 📌 Future Work

- Real-time integration with CCTV streams  
- Disease-specific detection models  
- Web-based live dashboard for farms  

---
## 📜 License

This project is for academic and research purposes only.

