import os
from flask_cors import CORS
from flask import Flask, request, json, Response
import re
from simpletransformers.classification import ClassificationModel


os.environ["CUDA_VISIBLE_DEVICES"] = ""

app = Flask(__name__)
cors = CORS(app)
inference = ClassificationModel(
      "roberta", "/home/hawkeye/Downloads/checkpoint-7500-epoch-5-20231203T091750Z-001/checkpoint-7500-epoch-5",use_cuda=False
  )

def clean_txt(text):
    text = re.sub("'", "", text)
    text = re.sub("(\\W)+", " ", text)
    text = text.lower()
    return text


@app.route('/')
def home():
    return json.dumps({"Server":"Working"})


@app.route('/predict', methods=["POST"])
def fake_news_det():
  try:
    data=request.get_json()

    if not data or "sample" not in data:
            return Response(response=json.dumps({"error": "Missing 'sample' parameter"}), status=400, mimetype="application/json")
    
    sample=data["sample"]
    test_data = clean_txt(sample)
    predictions=(inference.predict([test_data]))
    if predictions[0][0]==0:
        return json.dumps({"result":"REAL"})
    else:
        return json.dumps({"result":"FAKE"})
  except Exception as e:
     return Response(response=json.dumps({"error":str(e)}))

if __name__ == "__main__":
    app.run(debug=True)