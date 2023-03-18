from rmn import RMN
import cv2
import dlib
import numpy as np
from unified_detector import Fingertips
from hand_detector.detector import SOLO, YOLO
from gaze_tracking import GazeTracking
from speak_detector.detector import SD
from imutils.video import VideoStream
from imutils import face_utils
import imutils
import time


class MSERS:
    def __init__(self):
          self.enable_emotional = True           

    def detect_emotion(self, frame):
        m = RMN()
        frame = np.fliplr(frame).astype(np.uint8)

        results = m.detect_emotion_for_single_frame(frame)                
        return results[0]["emo_label"],results[0]["emo_proba"]

    def detect_gesture(self, frame, prev_pos):
        hand = YOLO(weights='weights/yolo.h5', threshold=0.8)
        fingertips = Fingertips(weights='weights/fingertip.h5')

        # hand detection
        tl, br = hand.detect(image=frame)

        if tl and br is not None:
            cropped_image = frame[tl[1]:br[1], tl[0]: br[0]]
            height, width, _ = cropped_image.shape

            # gesture classification and fingertips regression
            prob, pos = fingertips.classify(image=cropped_image)
            pos = np.mean(pos, 0)

            # post-processing
            prob = np.asarray([(p >= 0.5) * 1.0 for p in prob])
            for i in range(0, len(pos), 2):
                pos[i] = pos[i] * width + tl[0]
                pos[i + 1] = pos[i + 1] * height + tl[1]

            #detect if moving
            if prev_pos is None:
                prev_pos = pos
                
            for i in range(0, len(pos)):
                # print("val:", pos[i])
                # print("prev_val:", prev_pos[i])   
                if (pos[i] - prev_pos[i]) > 20 or (pos[i] - prev_pos[i]) < -20:
                    # print("moving!")
                    return pos, 1 

            return pos, 0

    def detect_gaze(self, frame):
        gaze = GazeTracking()

        # We send this frame to GazeTracking to analyze it
        gaze.refresh(frame)

        frame = gaze.annotated_frame()

        if gaze.is_blinking():
            # print("Blinking")
            return 0
        elif gaze.is_right():
            # print("Looking right")
            return 0
        elif gaze.is_left():
            # print("Looking left")
            return 0
        elif gaze.is_center():
            # print("Looking center")
            return 1

    def detect_speak(self, frame, detector, predictor, m_start, m_end, prev_mouth_img, i, margin):
        frame = imutils.resize(frame, 800) #default window width
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # detect faces in the grayscale frame
        rects = detector(gray, 0)

        # loop over the face detections
        for rect in rects:
            # determine the facial landmarks for the face region, then
            # convert the facial landmark (x, y)-coordinates to a NumPy
            # array
            shape = predictor(gray, rect)
            shape = face_utils.shape_to_np(shape)

            mouth_shape = shape[m_start:m_end+1]

            leftmost_x = min(x for x, y in mouth_shape) - margin
            bottom_y = min(y for x, y in mouth_shape) - margin
            rightmost_x = max(x for x, y in mouth_shape) + margin
            top_y = max(y for x, y in mouth_shape) + margin

            w = rightmost_x - leftmost_x
            h = top_y - bottom_y

            x = int(leftmost_x - 0.1 * w)
            y = int(bottom_y - 0.1 * h)

            w = int(1.2 * w)
            h = int(1.2 * h)

            mouth_img = gray[bottom_y:top_y, leftmost_x:rightmost_x]

            # loop over the (x, y)-coordinates for the facial landmarks
            # and draw them on the image
            # for (x, y) in mouth_shape:
            # cv2.circle(frame, (x, y), 1, (0, 0, 255), -1)
            cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)

            # confer this
            # https://github.com/seanexplode/LipReader/blob/master/TrackFaces.c#L68
            if prev_mouth_img is None:
                prev_mouth_img = mouth_img
            if SD.is_speaking(prev_mouth_img, mouth_img):
                # print(str(i), "speaking")
                i += 1
                return mouth_img, 1, i

            return mouth_img, 0, i
                

    def detect_emotional_eng(self, frame):
        emotion_data = self.detect_emotion(frame)
        # print(emotion_data)
                
        if emotion_data[0] == "happy":
            emotional_eng = emotion_data[1] * 1 * 100
        elif emotion_data[0] == "surprise":
            emotional_eng = emotion_data[1] * 1 * 100
        elif emotion_data[0] == "neutral":
            emotional_eng = emotion_data[1] * 0.8 * 100
        elif emotion_data[0] == "sad":
            emotional_eng = emotion_data[1] * 0.4 * 100
        elif emotion_data[0] == "angry":
            emotional_eng = emotion_data[1] * 0.3 * 100
        elif emotion_data[0] == "fear":
            emotional_eng = emotion_data[1] * 0.25 * 100
        elif emotion_data[0] == "disgusted":
            emotional_eng = emotion_data[1] * 0.2 * 100
        else:
            emotional_eng = 0

        # print("Emotional Engagement: %.2f" % emotional_eng)    
        return emotional_eng
    
    def detect_behavioral_cognitive_eng(self, frame, prev_pos, detector, predictor, m_start, m_end, prev_mouth_img, i, margin, emotional_data):
        gaze_data = self.detect_gaze(frame)
        emotional_data = self.detect_emotional_eng(frame)
        gesture_data = self.detect_gesture(frame, prev_pos)
        speaker_data = self.detect_speak(frame, detector, predictor, m_start, m_end, prev_mouth_img, i, margin)

        behavioral_eng = ((gaze_data * 0.3) + ((emotional_data/100) * 0.33) + (gesture_data[1] * 0.12) + (speaker_data[1] * 0.25)) * 100
        cognitive_eng = ((gesture_data[1] * 0.3) + (speaker_data[1] * 0.7)) * 100
        # print("----------------------------")
        # print("Gaze data:", gaze_data)
        # print("Emotional data:", emotional_data)
        # print("Gesture Data",gesture_data[1])
        # print("Speaker Data",speaker_data[1])
        # print("----------------------------")
        # print("Behavioral Engagement: %.2f" % behavioral_eng)
        return behavioral_eng, cognitive_eng, gesture_data[0], speaker_data[0], speaker_data[2]
    
    def detect_cognitive_eng(self, frame, prev_pos, detector, predictor, m_start, m_end, prev_mouth_img, i, margin):
        gesture_data = self.detect_gesture(frame, prev_pos)
        speaker_data = self.detect_speak(frame, detector, predictor, m_start, m_end, prev_mouth_img, i, margin)

        cognitive_eng = ((gesture_data[1] * 0.3) + (speaker_data[1] * 0.7)) * 100
        # print("----------------------------")
        # print("Gesture Data",gesture_data[1])
        # print("Speaker Data",speaker_data[1])
        # print("----------------------------")
        # print("Cognitive Engagement: %.2f" % cognitive_eng)
        return cognitive_eng, gesture_data[0], speaker_data[0], speaker_data[2]
    
    def detect_overall_eng(self):

        #SPEAK VARIABLES
        # initialize dlib's face detector (HOG-based) and then create
        # the facial landmark predictor
        detector = dlib.get_frontal_face_detector()
        predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")

        # grab the indices of the facial landmarks for mouth
        m_start, m_end = face_utils.FACIAL_LANDMARKS_IDXS['mouth']

        vid = cv2.VideoCapture(0)
        prev_pos_1 = None
        prev_pos_2 = None
        i1 = 0
        i2 = 0
        margin = 10
        prev_mouth_img_1 = None
        prev_mouth_img_2 = None

        while True:
            ret, frame = vid.read()
            if frame is None or ret is not True:
                continue

            try:
                result_emotional = self.detect_emotional_eng(frame)
                result_behavioral_cognitive = self.detect_behavioral_cognitive_eng(frame, prev_pos_1, detector, predictor, m_start, m_end, prev_mouth_img_1, i1, margin, result_emotional)

                prev_pos_1 = result_behavioral_cognitive[2]
                prev_mouth_img_1 = result_behavioral_cognitive[3]
                i1 = result_behavioral_cognitive[4]

                print("------------------------------")
                print("Emotional engagement:", result_emotional)
                print("Behavioral engagement:", result_behavioral_cognitive[0])
                print("Cognitive engagement:", result_behavioral_cognitive[1])
                print("------------------------------")

            except Exception as err:
                print(err)
                continue
        
        return {"emotional": result_emotional, "behavioral":result_behavioral_cognitive[0], "cognitive": result_behavioral_cognitive[1]}
    
    def detect_overall_eng_per_frame(self, frame):

        #SPEAK VARIABLES
        # initialize dlib's face detector (HOG-based) and then create
        # the facial landmark predictor
        detector = dlib.get_frontal_face_detector()
        predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")

        # grab the indices of the facial landmarks for mouth
        m_start, m_end = face_utils.FACIAL_LANDMARKS_IDXS['mouth']

        prev_pos_1 = None
        i1 = 0
        margin = 10
        prev_mouth_img_1 = None

        result_emotional = self.detect_emotional_eng(frame)
        result_behavioral_cognitive = self.detect_behavioral_cognitive_eng(frame, prev_pos_1, detector, predictor, m_start, m_end, prev_mouth_img_1, i1, margin, result_emotional)

        prev_pos_1 = result_behavioral_cognitive[2]
        prev_mouth_img_1 = result_behavioral_cognitive[3]
        i1 = result_behavioral_cognitive[4]

        print("------------------------------")
        print("Emotional engagement:", result_emotional)
        print("Behavioral engagement:", result_behavioral_cognitive[0])
        print("Cognitive engagement:", result_behavioral_cognitive[1])
        print("------------------------------")
        
        return {"emotional": round(result_emotional, 2), "behavioral": round(result_behavioral_cognitive[0],2), "cognitive": round(result_behavioral_cognitive[1],2)}

#Testing
msers = MSERS()
msers.detect_overall_eng()