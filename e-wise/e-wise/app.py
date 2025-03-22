

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


app = Flask(__name__)
CORS(app)

YOLOV5_PATH = 'C:/Users/Shipr/OneDrive/Desktop/IEEE/e-wise/e-wise/yolov5'
BEST_MODEL_PATH = 'C:/Users/Shipr/OneDrive/Desktop/IEEE/e-wise/e-wise/yolov5/runs/train/exp2/weights/best.pt'
model = torch.hub.load(YOLOV5_PATH, 'custom', path=BEST_MODEL_PATH, source='local')

@app.route('/uploads', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'message': 'No file part', 'detected': False})

    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No selected file', 'detected': False})

    img_bytes = file.read()
    image = Image.open(io.BytesIO(img_bytes))

    results = model(image)

    detections = results.pandas().xywh[0] 

    print(detections)

    detected_items = detections[detections['name'].isin(['battery', 'PCB', 'mobile phone'])]

    detected_items = detected_items[detected_items['confidence'] >= 0.5]

    if not detected_items.empty:
        return jsonify({'message': 'E-waste detected!', 'detected': True})
    else:
        return jsonify({'message': 'No e-waste detected.', 'detected': False})

if __name__ == "__main__":
    app.run(debug=True, port=5001)  