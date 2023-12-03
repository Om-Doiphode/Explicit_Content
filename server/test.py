from transformers import AutoModelForImageClassification, AutoFeatureExtractor
import torch
from PIL import Image
import numpy as np
from io import BytesIO


feature_extractor = AutoFeatureExtractor.from_pretrained('carbon225/vit-base-patch16-224-hentai')
model = AutoModelForImageClassification.from_pretrained('carbon225/vit-base-patch16-224-hentai')
image = Image.open(r'new.jpg')
image = image.resize((128, 128))
# image = np.array(image)
# image = image.astype("float") / 255.0
# image = np.expand_dims(image, axis=0)
encoding = feature_extractor(image.convert("RGB"), return_tensors="pt")
with torch.no_grad():
    outputs = model(**encoding)
    logits = outputs.logits

predicted_class_idx = logits.argmax(-1).item()
print(model.config.id2label[predicted_class_idx])