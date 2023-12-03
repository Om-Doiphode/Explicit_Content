from simpletransformers.classification import ClassificationModel
from flask import Flask, render_template, request
import re
app = Flask(__name__)
def clean_txt(text):
    text = re.sub("'", "", text)
    text = re.sub("(\\W)+", " ", text)
    text = text.lower()
    return text

def fake_news_det(sample):
  inference = ClassificationModel(
      "roberta", "/home/hawkeye/Downloads/checkpoint-7500-epoch-5-20231203T091750Z-001/checkpoint-7500-epoch-5",use_cuda=False
  )
  test_data = clean_txt(sample)
  predictions=(inference.predict([test_data]))
  if predictions[0][0]==0:
    return "REAL"
  else:
    return "FAKE"
  

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        message = request.form['message']
        pred = fake_news_det(message)
        print(pred)
        return render_template('index.html', prediction=pred)
    else:
        return render_template('index.html', prediction="Something went wrong")

if __name__ == '__main__':
    app.run(debug=True)