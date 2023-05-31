from django.http import HttpResponseRedirect
from django.contrib.auth.models import User
from django.shortcuts import render
from rest_framework import permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer, UserSerializerWithToken
from rest_framework.authentication import TokenAuthentication
from django.http import JsonResponse
import simplejson as json

import pandas as pd
import cv2
import dlib
import os
import time
import imutils
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from sklearn.metrics import accuracy_score
from keras.preprocessing.image import ImageDataGenerator,load_img, img_to_array
# from keras.optimizers import Adam
from datetime import date
from datetime import datetime
import deepface
from deepface import DeepFace
from keras.utils import np_utils
from imutils import paths
from imutils import face_utils
import matplotlib.pyplot as plt
import numpy as np
import argparse
import pickle
import PIL
import io
import html
from scipy.spatial import distance as dist
import joblib
from liveliness_network.liveness import LivenessNet
from tensorflow import keras
from tqdm import tqdm

from .models import Event
from .models import People

@api_view(['GET'])
def current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

class UserList(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (TokenAuthentication,)

    def post(self, request, format=None):
        serializer = UserSerializerWithToken(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def capture_image(request):
    data,labels,le,model,faces, img_labels, subjects, net = load_files()

    EYE_AR_THRESH = 0.3
    EYE_AR_CONSEC_FRAMES = 2

    datFile =  "shape_predictor_68_face_landmarks.dat"
    predictor = dlib.shape_predictor(datFile)
    detector = dlib.get_frontal_face_detector()

    (lStart, lEnd) = face_utils.FACIAL_LANDMARKS_IDXS["left_eye"]
    (rStart, rEnd) = face_utils.FACIAL_LANDMARKS_IDXS["right_eye"]

    seconds = time.time()
    end=seconds+15
    COUNTER = 0
    total_blinks = 0
    Liveliness_detection=False
    live_counter=0
    person_recognized=""
    cam = cv2.VideoCapture(0)
    while(True):
        print('total blinks : ' , total_blinks)
        ret, frame = cam.read()
        
        if(end<=time.time()):
            print('Spoof Detected. Please try again... ')
            cv2.putText(frame, 'Spoof Detected', (30, 30),cv2.FONT_HERSHEY_DUPLEX, 1, (0, 200, 0), 1)
            person_recognized="Spoof Detected"
            break
        
        if total_blinks>=3 and live_counter>=10:
            print('face liveliness verified')
            cv2.putText(frame, 'Face Liveliness Verified', (30, 30),cv2.FONT_HERSHEY_DUPLEX, 1, (0, 200, 0), 1)
            Liveliness_detection=True
            person_recognized=recognize_face(frame)
            print(person_recognized)
            break
        # if total_blinks>=1:
        #     cv2.putText(frame, 'Blink Detected', (30, 30),cv2.FONT_HERSHEY_DUPLEX, 1, (0, 200, 0), 1)
        #     print('Blink detected')
        #     Liveliness_detection=True
        #     break
        
        if ret:
            frame1 = imutils.resize(frame, width=800)
            gray = cv2.cvtColor(frame1, cv2.COLOR_BGR2GRAY)
            rects = detector(gray, 0)

        for rect in rects:

            shape = predictor(gray, rect)
            shape = face_utils.shape_to_np(shape)

            leftEye = shape[lStart:lEnd]
            rightEye = shape[rStart:rEnd]
            leftEAR = eye_aspect_ratio(leftEye)
            rightEAR = eye_aspect_ratio(rightEye)

            ear = (leftEAR + rightEAR) / 2.0

            leftEyeHull = cv2.convexHull(leftEye)
            rightEyeHull = cv2.convexHull(rightEye)
            # cv2.drawContours(frame, [leftEyeHull], -1, (0, 255, 0), 1)
            # cv2.drawContours(frame, [rightEyeHull], -1, (0, 255, 0), 1)
            # print('ear: ',ear)
            if ear < EYE_AR_THRESH:

                COUNTER += 1

            else:

                if COUNTER >= EYE_AR_CONSEC_FRAMES:
                    total_blinks += 1

                COUNTER = 0
            

	# grab the frame dimensions and convert it to a blob
        (h, w) = frame.shape[:2]
        blob = cv2.dnn.blobFromImage(cv2.resize(frame, (300, 300)), 1.0, (300, 300), (104.0, 177.0, 123.0))

        # pass the blob through the network and obtain the detections and predictions
        net.setInput(blob)
        detections = net.forward()

        for i in range(0, detections.shape[2]):
        # extract the confidence (i.e., probability) associated with the prediction
            confidence = detections[0, 0, i, 2]
            # filter out weak detections
            if confidence > 0.5:
                # compute the (x, y)-coordinates of the bounding box for the face and extract the face ROI
                box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
                (startX, startY, endX, endY) = box.astype("int")

                # ensure the detected bounding box does fall outside the dimensions of the frame
                startX = max(0, startX)
                startY = max(0, startY)
                endX = min(w, endX)
                endY = min(h, endY)

                # extract the face ROI and then preproces it in the exact same manner as our training data
                face = frame[startY:endY, startX:endX]
                if not face.size>0:
                    continue
                face = cv2.resize(face, (64, 64))
                face = face.astype("float") / 255.0
                face = img_to_array(face)
                face = np.expand_dims(face, axis=0)

                # pass the face ROI through the trained liveness detector model to determine if the face is "real" or "fake"
                preds = model.predict(face)[0]
                j = np.argmax(preds)
                label = le.classes_[j]
                # print(preds)
                # print(j)
                # print(label)

                # draw the label and bounding box on the frame
                label = "{}: {:.4f}".format(label, preds[j])
                
                if preds[j] > 0.50 and j == 1:
                    cv2.rectangle(frame, (startX, startY), (endX, endY),
                    (0, 255, 0), 2)
                    _label = "Liveness: {:.4f}".format(preds[j])
                    cv2.putText(frame, _label, (startX, startY - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
                    live_counter+=1

                else:
                    cv2.rectangle(frame, (startX, startY), (endX, endY),
                    (0, 0, 255), 2)
                    _label = "Fake: {:.4f}".format(preds[j])
                    cv2.putText(frame, _label, (startX, startY - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)

        cv2.imshow("Frame",frame)
        if(cv2.waitKey(1) == ord('q')):
            break
    cam.release()
    cv2.destroyAllWindows()
    return JsonResponse({'name':person_recognized})
    
def recognize_face(frame):
    
    df = DeepFace.find(img_path=frame,db_path = "C:/Users/parva/Downloads/FRAS/Project/train_images", enforce_detection=False)
    if(len(df)>1 and df['VGG-Face_cosine'][0]<0.2):
        return df.iloc[0].identity.split(os.path.sep)[-1].split('/')[0]
    else:
        return 'Face Not Recognized'

@api_view(['POST'])
def save_event(request):
    result=request.data
    
    myModel = Event()
    print(result['eventname'],result['eventdesc'],result['faceslist'])
    myModel.eventname=result['eventname']
    myModel.eventdesc=result['eventdesc']
    myModel.created=date.today()

    now = datetime.now()
    myModel.currenttime = now.strftime("%H:%M:%S")

    myModel.recognized = json.dumps(result['faceslist'])
    myModel.save()
    
    return Response('Done')


@api_view(['GET'])
def attendance(request):
    res=Event.objects.all()
    dicts=[]
    for item in res:
        dic={}
        dic['eventname']=item.eventname
        dic['eventdesc']=item.eventdesc
        dic['created']=item.created
        dic['currenttime']=item.currenttime
        jsonDec = json.decoder.JSONDecoder()
        recognizedlist = jsonDec.decode(item.recognized)
        dic['recognized']=recognizedlist
        dicts.append(dic)
    
    return JsonResponse({'dic':dicts})

@api_view(['POST'])
def search(request):
    event_name=request.data['search']
    res=Event.objects.filter(eventname=event_name)
    jsonDec = json.decoder.JSONDecoder()
    for item in res:
        recognizedlist = jsonDec.decode(item.recognized)
    # print(event_name,res, recognizedlist)
    dicts=[]
    for ele in recognizedlist:
        details=People.objects.filter(name=ele)
        for item in details:
            dic={}
            dic['name']=item.name
            dic['age']=item.age
            dic['rollno']=item.rollno
            dic['phonenumber']=item.phonenumber
            dicts.append(dic)
    return JsonResponse({'dic':dicts})

@api_view(['POST'])
def add_new(request):
    result=request.data
    
    myModel = People()
    print(result['name'],result['age'],result['rollno'],result['phoneno'])
    myModel.name=result['name']
    myModel.age=result['age']
    myModel.rollno=result['rollno']
    myModel.phonenumber = result['phoneno']
    myModel.save()

    name=result['name']
    directory='C:/Users/parva/Downloads/FRAS/Project/train_images/'+name

    if not os.path.exists(directory):
        os.makedirs(directory)
    else:
        print('DIRECTORY with name %s EXIST'%name)
    # Opening vedio mode with frontal face detector
    faceDetect=cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml") #cv2.CascadeClassifier('haarcascade_frontalface_default.xml');
    cam=cv2.VideoCapture(0)
    tn=500
    size =(100, 100)
    k=0
    # for i in tqdm(range(1, 1+ tn)):
    while(True):
        ret,img=cam.read()
        k+=1
        gray=cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)  #for GRAY SCALE IMAGES
        faces=faceDetect.detectMultiScale(gray,1.3,5)
        # faces=faceDetect.detectMultiScale(img,1.3,5)    # FOR COLOR IMAGES
        for(x,y,w,h) in faces:
            res = cv2.resize(gray[y:y+h,x:x+w], size, interpolation = cv2.INTER_AREA)
            cv2.imwrite(directory+'/'+str(name)+'_'+str(k)+'.jpg', res)  #for GRAY SCALE IMAGES

            # cv2.imwrite(directory+'/'+str(name)+'-'+str(sn)+'.jpg'
            #             ,img[y:y+h,x:x+w])  # FOR COLOR IMAGES
            cv2.rectangle(img,(x,y),(x+w,y+h),(0,0,255),2)
            cv2.waitKey(200)
        cv2.imshow('DAtaset Creator',img)
        if k==tn:
            break
        if(cv2.waitKey(1) == ord('q')):
            break
    cam.release()
    cv2.destroyAllWindows()
    print('Task Completed')

    return Response('Done')

@api_view(['GET'])
def train_model(request):
    myfile= 'C:/Users/parva/Downloads/FRAS/Project/train_images/representations_vgg_face.pkl'
    # Try to delete the file 
    try:
        os.remove(myfile)
        df = DeepFace.find(img_path='C:/Users/parva/Downloads/FRAS/Project/train_images/Rachit/frame0.jpg',db_path = "C:/Users/parva/Downloads/FRAS/Project/train_images", enforce_detection=False)

    except OSError as e:  # if failed, report it back to the user
        print ("Error: %s - %s." % (e.filename, e.strerror))

    return Response('Done')

def load_files():
    with open('saved_files/liveliness_dataset.pkl', 'rb') as f:
        p = pickle.load(f)
        
    data = p['data']
    labels = p['labels']
    le = p['le']
    
    mod = keras.models.load_model('saved_files/liveliness_model.h5')

    
    with open('saved_files/recognition_images.pkl', 'rb') as f:
        p = pickle.load(f)
        
    faces = p['faces']
    img_labels = p['img_labels']
    subjects = p['subjects']

    protoPath = 'face_detector/deploy.prototxt'
    modelPath = 'face_detector/res10_300x300_ssd_iter_140000.caffemodel'
    net = cv2.dnn.readNetFromCaffe(protoPath, modelPath)

    return data,labels,le,mod,faces, img_labels, subjects, net

def eye_aspect_ratio(eye):
    A = dist.euclidean(eye[1], eye[5])
    B = dist.euclidean(eye[2], eye[4])
    C = dist.euclidean(eye[0], eye[3])
    ear = (A + B) / (2.0 * C)
    return ear

    