import io
import base64
from flask import Flask,request,jsonify
from PIL import Image
##from tensorflow.keras.models import load_model
import cv2
import numpy as np

app = Flask(__name__)

def stringToImage(base64_string):
    imgdata = base64.b64decode(base64_string)
    return Image.open(io.BytesIO(imgdata))

def toRGB(image):
    return cv2.cvtColor(np.array(image), cv2.COLOR_BGR2RGB)    

@app.route('/')
def home():
    return jsonify({"res": "Hello world"})

@app.route('/predict', methods = ['GET'])
def predict_class():
    IMAGE_RESIZE = 224
    req_data = request.get_json()

    ## Loading model
    ##model = load_model('../../model/utils/weights/untrained.h5')

    ## Converting base64 image to cv2 readable image
    image_base64 = req_data['image']
    PIL_image = stringToImage(image_base64)
    image = toRGB(PIL_image)

    ## Predicting class 
    image_resized = cv2.resize(image, (IMAGE_RESIZE,IMAGE_RESIZE))
    ##pred = model.predict(image_resized) 
    ##class_value = np.argmax(pred, axis = 0)

    return jsonify({"class": "0"})

if __name__ == '__main__':
    app.run(host = '0.0.0.0')    
