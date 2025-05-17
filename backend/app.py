from flask import Flask, request, jsonify, send_file

from flask_cors import CORS
import os
from werkzeug.utils import secure_filename

import cv2
from ultralytics import YOLO
import numpy as np
from scipy.ndimage import gaussian_filter
import matplotlib.pyplot as plt




app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

model = YOLO('best.pt')


@app.route('/')
def home():
    return "✅ Flask backend is running!"


@app.route('/upload-image', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file in request'}), 400

    image_file = request.files['image']
    if image_file.filename == '':
        return jsonify({'error': 'No selected image file'}), 400

    filename = secure_filename(image_file.filename)
    image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    image_file.save(image_path)

    # Load the image using OpenCV
    img = cv2.imread(image_path)

    # Run YOLO on the image
    results = model(img)
    for r in results:
        for box in r.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            conf = box.conf[0].item()
            label = box.cls[0].item()
            
            # Use your own class labels here
            status = "Healthy" if label == 0 else "Unhealthy"
            color = (0, 255, 0) if label == 0 else (0, 0, 255)

            cv2.rectangle(img, (x1, y1), (x2, y2), color, 2)
            cv2.putText(img, f'{status} ({conf:.2f})', (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

    # Save the processed image
    output_path = os.path.join(app.config['UPLOAD_FOLDER'], 'output_' + filename)
    cv2.imwrite(output_path, img)

    # Return the image file
    return send_file(output_path, mimetype='image/jpeg')

@app.route('/upload', methods=['POST'])
def upload_video():
    if 'video' not in request.files:
        return jsonify({'error': 'No video part in request'}), 400

    file = request.files['video']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    # For now, just return the saved path
    return jsonify({'message': 'Video uploaded successfully!', 'path': filepath}), 200


if __name__ == '__main__':
    app.run(debug=True)
