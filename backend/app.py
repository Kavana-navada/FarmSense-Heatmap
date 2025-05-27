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
from sklearn.cluster import DBSCAN
import mimetypes
from sort_tracker import Sort 
import json




app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = 'outputs'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

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

    with open(os.path.join(OUTPUT_FOLDER, "video_meta.json"), "w") as f:
        json.dump({"width": width, "height": height}, f)

    if fps == 0 or np.isnan(fps):
        fps = 25.0

    fourcc = cv2.VideoWriter_fourcc('X', 'V', 'I', 'D')
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

    print(f"Saving annotated video: {output_path}")
    print(f"Resolution: {width}x{height}, FPS: {fps}")

    tracker = Sort()
    track_positions = {}  # {id: [(x, y), ...]}
    track_health = {}     # {id: 'Healthy' / 'Unhealthy'}

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret or frame is None:
            break

        results = model(frame)[0]
        detections = []
        health_labels = []

        for box in results.boxes:
            x1, y1, x2, y2 = map(float, box.xyxy[0])
            conf = float(box.conf[0])
            cls = int(box.cls[0])
            label = 'Healthy' if cls == 0 else 'Unhealthy'
            detections.append([x1, y1, x2, y2, conf])
            health_labels.append(label)

        if len(detections) > 0:
            trackers = tracker.update(np.array(detections))
            for i, (x1, y1, x2, y2, track_id) in enumerate(trackers):
                cx = int((x1 + x2) / 2)
                cy = int((y1 + y2) / 2)
                track_id = int(track_id)

                # Store positions
                if track_id not in track_positions:
                    track_positions[track_id] = []
                track_positions[track_id].append((cx, cy))

                # Use nearest health label for ID
                if track_id not in track_health and i < len(health_labels):
                    track_health[track_id] = health_labels[i]

                label = track_health.get(track_id, "Chicken")
                color = (255, 0, 0) if label == 'Healthy' else (173, 216, 230)

                # Draw the bounding box
                cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), color, 1)

                # Calculate text size
                (text_width, text_height), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)
                text_offset_x = int(x1)
                text_offset_y = int(y1) - 10

                # Draw filled rectangle as background for text
                cv2.rectangle(frame,
                            (text_offset_x, text_offset_y - text_height - 4),
                            (text_offset_x + text_width, text_offset_y),
                            color,
                            thickness=cv2.FILLED)

                # Draw the label text in white
                cv2.putText(frame, label,
                            (text_offset_x, text_offset_y - 2),
                            cv2.FONT_HERSHEY_SIMPLEX,
                            0.5,
                            (255, 255, 255),
                            thickness=1)


        out.write(frame)

    cap.release()
    out.release()

    # Save tracked chickens as (id, x, y)
    tracked_positions = []
    for track_id, coords in track_positions.items():
        for x, y in coords:
            tracked_positions.append((track_id, x, y))

    np.save(os.path.join(OUTPUT_FOLDER, "tracked_chickens.npy"), tracked_positions)

    return jsonify({
        'annotated_video': output_filename
    })

@app.route('/generate-heatmap', methods=['GET'])
def generate_heatmap():
    try:
        tracked = np.load(os.path.join(OUTPUT_FOLDER, "tracked_chickens.npy"), allow_pickle=True)
        if len(tracked) == 0:
            raise ValueError("No tracked chicken positions available.")

        # Load resolution
        with open(os.path.join(OUTPUT_FOLDER, "video_meta.json")) as f:
            meta = json.load(f)
        width = meta["width"]
        height = meta["height"]


        heatmap = np.zeros((int(height), int(width)), dtype=np.float32)

        # Grid to store unique IDs at each position
        grid = [[set() for _ in range(int(width))] for _ in range(int(height))]

        for tid, x, y in tracked:
            x = int(x)
            y = int(y)
            if 0 <= x < int(width) and 0 <= y < int(height):
                grid[y][x].add(tid)

        for y in range(int(height)):
            for x in range(int(width)):
                heatmap[y, x] = len(grid[y][x])

        heatmap_blurred = gaussian_filter(heatmap, sigma=25)
        normalized = cv2.normalize(heatmap_blurred, None, 0, 255, cv2.NORM_MINMAX)
        heatmap_colored = cv2.applyColorMap(normalized.astype(np.uint8), cv2.COLORMAP_JET)

        heatmap_filename = f"{uuid.uuid4().hex}_heatmap.jpg"
        heatmap_path = os.path.join(OUTPUT_FOLDER, heatmap_filename)
        cv2.imwrite(heatmap_path, heatmap_colored)

        return jsonify({'heatmap_path': f"{OUTPUT_FOLDER}/{heatmap_filename}"})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    


# @app.route('/generate-heatmap', methods=['GET'])
# def generate_heatmap():
#     try:
#         positions = np.load(os.path.join(OUTPUT_FOLDER, "chicken_positions.npy"))
#         if len(positions) == 0:
#             raise ValueError("No chicken positions available.")

#         heatmap = np.zeros((720, 1280), dtype=np.float32)
#         for x, y in positions:
#             if 0 <= x < 1280 and 0 <= y < 720:
#                 heatmap[int(y), int(x)] += 1

#         heatmap_blurred = gaussian_filter(heatmap, sigma=25)
#         normalized = cv2.normalize(heatmap_blurred, None, 0, 255, cv2.NORM_MINMAX)
#         heatmap_colored = cv2.applyColorMap(normalized.astype(np.uint8), cv2.COLORMAP_JET)

#         heatmap_filename = f"{uuid.uuid4().hex}_heatmap.jpg"
#         heatmap_path = os.path.join(OUTPUT_FOLDER, heatmap_filename)
#         cv2.imwrite(heatmap_path, heatmap_colored)

#         return jsonify({'heatmap_path': f"{OUTPUT_FOLDER}/{heatmap_filename}"})
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
