import os
from transformers import AutoModelForImageClassification, AutoFeatureExtractor
import torch
from flask_cors import CORS
from flask import Flask, request, json
from PIL import Image
import requests
from io import BytesIO
from bs4 import BeautifulSoup
from urllib.parse import urljoin

# Disable CUDA visibility to utilize CPU only
os.environ["CUDA_VISIBLE_DEVICES"] = ""

# Create a Flask application
app = Flask(__name__)
# Enable CORS for all routes
cors = CORS(app)

# Define the model and feature extractor globally
model = AutoModelForImageClassification.from_pretrained('carbon225/vit-base-patch16-224-hentai')
feature_extractor = AutoFeatureExtractor.from_pretrained('carbon225/vit-base-patch16-224-hentai')

def predict(response):
    try:
        # Open and preprocess the image
        image = Image.open(BytesIO(response.content))
        image = image.resize((128, 128))

        # Extract features using the pre-trained feature extractor
        encoding = feature_extractor(images=image.convert("RGB"), return_tensors="pt")

        # Make a prediction using the pre-trained model
        with torch.no_grad():
            outputs = model(**encoding)
            logits = outputs.logits

        # Get the predicted class index and label
        predicted_class_idx = logits.argmax(-1).item()
        predicted_class_label = model.config.id2label[predicted_class_idx]

        return predicted_class_label
    except Exception as e:
        print(f"Error in predicting image: {str(e)}")
        return None

# Default route to check if the server is working
@app.route("/", methods=["GET"])
def default():
    return json.dumps({"Server": "Working"})

# Route to extract images from a webpage and predict their classes
@app.route("/extractimages", methods=["GET"])
def extract_images():
    try:
        src = request.args.get("src")
        response = requests.get(src)
        soup = BeautifulSoup(response.content, 'html.parser')

        # Extract image tags from the webpage
        img_tags = soup.select('div img')
        for img_tag in img_tags:
            img_url = urljoin(src, img_tag['src'])
            response = requests.get(img_url)
            response.raise_for_status()
            predicted_class_label = predict(response)

            # If the predicted class is explicit or suggestive, return the class
            if predicted_class_label == 'explicit' or predicted_class_label == 'suggestive':
                return json.dumps({"class": predicted_class_label})
            
        # If no explicit or suggestive images found, return 'safe' class
        return json.dumps({"class": "safe"})
    except Exception as e:
        print(f"Error in processing images: {str(e)}")
        return json.dumps({"class": "safe"})

# Route to predict the class of a single image
@app.route("/predict", methods=["GET"])
def predict_image():
    try:
        src = request.args.get("src")

        # Download image from the provided URL
        response = requests.get(src)
        response.raise_for_status()

        # Predict the class of the image
        predicted_class_label = predict(response)

        # Return the predictions
        return json.dumps({"class": predicted_class_label})

    except requests.exceptions.RequestException as e:
        return json.dumps({"error": f"Request error: {str(e)}"})
    except Exception as e:
        return json.dumps({"error": f"An unexpected error occurred: {str(e)}"})

# Run the Flask application
if __name__ == "__main__":
    app.run(debug=True)