

# from flask import Flask, request, jsonify
# import torch
# from PIL import Image
# import io

# app = Flask(__name__)

# # Load YOLOv5 model
# YOLOV5_PATH = 'C:/Users/Shipr/OneDrive/Desktop/IEEE/e-wise/e-wise/yolov5'
# BEST_MODEL_PATH = 'C:/Users/Shipr/OneDrive/Desktop/IEEE/e-wise/e-wise/yolov5/runs/train/exp2/weights/best.pt'
# model = torch.hub.load(YOLOV5_PATH, 'custom', path=BEST_MODEL_PATH, source='local')

# @app.route('/uploads', methods=['POST'])
# def upload_file():
#     if 'file' not in request.files:
#         return jsonify({'message': 'No file part', 'detected': False})

#     file = request.files['file']
#     if file.filename == '':
#         return jsonify({'message': 'No selected file', 'detected': False})

#     # Process the image
#     img_bytes = file.read()
#     image = Image.open(io.BytesIO(img_bytes))

#     # Run the model on the image
#     results = model(image)

#     detections = results.pandas().xywh[0]  # Pandas dataframe with results

#     # Check if e-waste items are detected
#     detected_items = detections[detections['name'].isin(['battery', 'PCB', 'mobile phone'])]

#     # If detected items exist, set detected to True
#     if not detected_items.empty:
#         return jsonify({'message': 'E-waste detected!', 'detected': True})
#     else:
#         return jsonify({'message': 'No e-waste detected.', 'detected': False})

# if __name__ == "__main__":
#     app.run(debug=True, port=5001)  # Ensure this is running on a different port than Node.js



from flask import Flask, request, jsonify
import torch
from PIL import Image
import io
from flask_cors import CORS
import os


app = Flask(__name__)
CORS(app)

YOLOV5_PATH = 'C:/Users/Shipr/OneDrive/Desktop/IEEE/e-wise/e-wise/yolov5'
BEST_MODEL_PATH = 'C:/Users/Shipr/OneDrive/Desktop/IEEE/e-wise/e-wise/yolov5/runs/train/exp2/weights/best.pt'
# Load model
model = torch.hub.load(YOLOV5_PATH, 'custom', path=BEST_MODEL_PATH, source='local')
model.conf = float(os.getenv('YOLO_CONF', 0.25))  # confidence threshold
model.iou = float(os.getenv('YOLO_IOU', 0.45))    # NMS IoU threshold
model.max_det = int(os.getenv('YOLO_MAX_DET', 1000))

INTEREST_CLASSES = set([
    'battery', 'pcb', 'mobile', 'mobile phone', 'cell phone',
    'laptop', 'computer', 'electronics', 'charger'
])

@app.route('/uploads', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'message': 'No file part', 'detected': False})

    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No selected file', 'detected': False})

    img_bytes = file.read()
    image = Image.open(io.BytesIO(img_bytes)).convert('RGB')

    # Inference
    results = model(image)

    # Use xyxy pandas output (name, confidence, etc.)
    try:
        df = results.pandas().xyxy[0]
    except Exception as e:
        # Fallback for older versions
        try:
            df = results.pandas().xywh[0]
        except Exception:
            return jsonify({'message': f'Inference parsing error: {str(e)}', 'detected': False})

    # Normalize class names to lowercase
    if 'name' in df.columns:
        df['name'] = df['name'].astype(str).str.lower()

    # Confidence threshold (can override via env)
    conf_thr = float(os.getenv('YOLO_CONF', 0.25))
    df_conf = df[df['confidence'] >= conf_thr]

    # Determine detection based on interested classes
    detected = False
    matched = []
    if 'name' in df_conf.columns:
        for _, row in df_conf.iterrows():
            if row['name'] in INTEREST_CLASSES:
                detected = True
                matched.append({'name': row['name'], 'confidence': float(row['confidence'])})

    # Optional: return debug info
    if request.args.get('debug') == '1':
        try:
            names = list(df_conf['name'].astype(str)) if 'name' in df_conf.columns else []
            confs = list(map(float, df_conf['confidence'])) if 'confidence' in df_conf.columns else []
        except Exception:
            names, confs = [], []
        return jsonify({
            'detected': detected,
            'message': 'Debug results',
            'predictions': [{'name': n, 'confidence': c} for n, c in zip(names, confs)],
            'matched': matched,
            'model_names': getattr(model, 'names', None)
        })

    if detected:
        return jsonify({'message': 'E-waste detected!', 'detected': True, 'matched': matched})
    else:
        return jsonify({'message': 'No e-waste detected.', 'detected': False})

@app.route('/health', methods=['GET'])
def health():
    try:
        _ = getattr(model, 'names', None)
        return jsonify({'status': 'ok', 'model_loaded': bool(_), 'classes': _}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5002)  