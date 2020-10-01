from flask import Flask,request
from tensorflow.keras.models import load_model

app = Flask(__name__)

@app.route('/')
def home():
    return "Hello world"

@app.route('/predict', methods = ['POST'])
def predict_class():
    req_data = request.get_json()
    image_base64 = req_data['image']
    latitude = req_data['location'][0]
    longitude = req_data['location'][1]
    print('Image in base64: {}\nLatitude: {}, Longitude: {}'.format(image_base64, latitude, longitude))
    return req_data

if __name__ == '__main__':
    app.run()    
