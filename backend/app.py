from flask import Flask, request, jsonify, send_file, send_from_directory

from flask_cors import CORS
import os
from werkzeug.utils import secure_filename

import cv2
from ultralytics import YOLO
import numpy as np
from scipy.ndimage import gaussian_filter
import matplotlib.pyplot as plt
import uuid
from PIL import Image, ImageDraw, ImageFont
from collections import Counter

import mimetypes


app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = 'outputs'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# UPLOAD_FOLDER = 'uploads'
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)
# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

model = YOLO('best.pt')


@app.route('/')
def home():
    return "✅ Flask backend is running!"

@app.route('/analyze-image', methods=['POST'])
def analyze_image():
    image_file = request.files['image']
    filename = f"{uuid.uuid4().hex}.jpg"
    input_path = os.path.join(UPLOAD_FOLDER, filename)
    output_path = os.path.join(OUTPUT_FOLDER, filename)

    image_file.save(input_path)
    results = model(input_path)[0]

    healthy_count, unhealthy_count = 0, 0
    for box in results.boxes:
        cls = int(box.cls[0])
        if cls == 0:
            healthy_count += 1
        else:
            unhealthy_count += 1

    annotated = results.plot()
    cv2.imwrite(output_path, annotated)

    return jsonify({
        'output_image': f"{OUTPUT_FOLDER}/{filename}",
        'healthy_count': healthy_count,
        'unhealthy_count': unhealthy_count
    })



@app.route('/outputs/<filename>')
def serve_output_image(filename):
    filepath = os.path.join(OUTPUT_FOLDER, filename)
    return send_file(filepath, as_attachment=True,download_name='analyzed_image.jpg')

# @app.route('/outputs/<path:filename>')
# def serve_output_file(filename):
#     return send_from_directory(OUTPUT_FOLDER, filename, as_attachment=True, download_name='analyzed_video.mp4')



@app.route('/videooutputs/<path:filename>')
def serve_output_file(filename):
    filepath = os.path.join(OUTPUT_FOLDER, filename)
    if not os.path.exists(filepath):
        return "File not found", 404
    mime_type, _ = mimetypes.guess_type(filepath)
    return send_file(filepath, mimetype=mime_type)


@app.route('/analyze-video', methods=['POST'])
def analyze_video():
    video_file = request.files['video']
    filename = f"{uuid.uuid4().hex}.avi"
    input_path = os.path.join(UPLOAD_FOLDER, filename)
    output_filename = f"{uuid.uuid4().hex}_annotated.avi"
    output_path = os.path.join(OUTPUT_FOLDER, output_filename)

    video_file.save(input_path)

    cap = cv2.VideoCapture(input_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    # fallback fps
    if fps == 0 or np.isnan(fps):
        fps = 25.0

    # safer codec and file extension
    fourcc = cv2.VideoWriter_fourcc('X','V','I','D')
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

    # Optional debug
    print(f"Saving annotated video: {output_path}")
    print(f"Resolution: {width}x{height}, FPS: {fps}")

    healthy_count, unhealthy_count = 0, 0
    chicken_positions = []

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret or frame is None:
            break

        results = model(frame)[0]
        for box in results.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            cx = int((x1 + x2) / 2)
            cy = int((y1 + y2) / 2)
            chicken_positions.append((cx, cy))

            conf = float(box.conf[0])
            cls = int(box.cls[0])
            label = 'Healthy' if cls == 0 else 'Unhealthy'

            if cls == 0:
                healthy_count += 1
                color = (0, 255, 0)
            else:
                unhealthy_count += 1
                color = (255, 0, 0 )

            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

        out.write(frame)

    cap.release()
    out.release()

    # Save for heatmap use
    np.save(os.path.join(OUTPUT_FOLDER, "chicken_positions.npy"), chicken_positions)

    return jsonify({
        
        'annotated_video': output_filename
    })


@app.route('/generate-heatmap', methods=['GET'])
def generate_heatmap():
    try:
        positions = np.load(os.path.join(OUTPUT_FOLDER, "chicken_positions.npy"))
        if len(positions) == 0:
            raise ValueError("No chicken positions available.")

        heatmap = np.zeros((720, 1280), dtype=np.float32)
        for x, y in positions:
            if 0 <= x < 1280 and 0 <= y < 720:
                heatmap[int(y), int(x)] += 1

        heatmap_blurred = gaussian_filter(heatmap, sigma=25)
        normalized = cv2.normalize(heatmap_blurred, None, 0, 255, cv2.NORM_MINMAX)
        heatmap_colored = cv2.applyColorMap(normalized.astype(np.uint8), cv2.COLORMAP_JET)

        heatmap_filename = f"{uuid.uuid4().hex}_heatmap.jpg"
        heatmap_path = os.path.join(OUTPUT_FOLDER, heatmap_filename)
        cv2.imwrite(heatmap_path, heatmap_colored)

        return jsonify({'heatmap_path': f"{OUTPUT_FOLDER}/{heatmap_filename}"})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# @app.route('/upload-image', methods=['POST'])
# def upload_image():
#     if 'image' not in request.files:
#         return jsonify({'error': 'No image file in request'}), 400

#     image_file = request.files['image']
#     if image_file.filename == '':
#         return jsonify({'error': 'No selected image file'}), 400

#     filename = secure_filename(image_file.filename)
#     image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
#     image_file.save(image_path)

#     # Load the image using OpenCV
#     img = cv2.imread(image_path)

#     # Run YOLO on the image
#     results = model(img)
#     for r in results:
#         for box in r.boxes:
#             x1, y1, x2, y2 = map(int, box.xyxy[0])
#             conf = box.conf[0].item()
#             label = box.cls[0].item()
            
#             # Use your own class labels here
#             status = "Healthy" if label == 0 else "Unhealthy"
#             color = (0, 255, 0) if label == 0 else (0, 0, 255)

#             cv2.rectangle(img, (x1, y1), (x2, y2), color, 2)
#             cv2.putText(img, f'{status} ({conf:.2f})', (x1, y1 - 10),
#                         cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

#     # Save the processed image
#     output_path = os.path.join(app.config['UPLOAD_FOLDER'], 'output_' + filename)
#     cv2.imwrite(output_path, img)

#     # Return the image file
#     return send_file(output_path, mimetype='image/jpeg')

# @app.route('/upload', methods=['POST'])
# def upload_video():
#     if 'video' not in request.files:
#         return jsonify({'error': 'No video part in request'}), 400

#     file = request.files['video']
#     if file.filename == '':
#         return jsonify({'error': 'No selected file'}), 400

#     filename = secure_filename(file.filename)
#     filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
#     file.save(filepath)

#     # For now, just return the saved path
#     return jsonify({'message': 'Video uploaded successfully!', 'path': filepath}), 200


if __name__ == '__main__':
    app.run(debug=True)
