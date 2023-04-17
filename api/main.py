import cv2
import dlib
import numpy as np
from .unified_detector import Fingertips
from .hand_detector.detector import SOLO, YOLO
from .gaze_tracking import GazeTracking
from .speak_detector.detector import SD
from imutils.video import VideoStream
from imutils import face_utils
import imutils
import time


class MSERS:
    def __init__(self):
          self.enable_emotional = True
          self.margin = 10
        
    def detect_gesture(self, frame, prev_pos):
        hand = YOLO(weights='yolo.h5', threshold=0.8)
        fingertips = Fingertips(weights='fingertip.h5')

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

            if pos is not None: 
                #detect if moving
                if prev_pos is None:
                    prev_pos = pos
                else:
                    # gesture classification and fingertips regression
                    prev_prob, prev_pos = fingertips.classify(image=cropped_image)
                    prev_pos = np.mean(prev_pos, 0)

                    # post-processing
                    prev_prob = np.asarray([(p >= 0.5) * 1.0 for p in prev_prob])
                    for i in range(0, len(prev_pos), 2):
                        prev_pos[i] = prev_pos[i] * width + tl[0]
                        prev_pos[i + 1] = prev_pos[i + 1] * height + tl[1]

                    
                for i in range(0, len(pos)):
                    # print("val:", pos[i])
                    # print("prev_val:", prev_pos[i])   
                    if (pos[i] - prev_pos[i]) > 20 or (pos[i] - prev_pos[i]) < -20:
                        print("moving!")
                        return pos, 1 

                return pos, 0
            else:
                return 0, 0
        return 0, 0

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

    def detect_speak(self, frame, detector, predictor, m_start, m_end, prev_mouth_img, margin):
        frame = imutils.resize(frame, 800) #default window width
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        # detect faces in the grayscale frame
        rects = detector(gray, 0)

        if prev_mouth_img is not None:
            prev_frame = imutils.resize(prev_mouth_img, 800) #default window width
            prev_gray = cv2.cvtColor(prev_frame, cv2.COLOR_BGR2GRAY)
            prev_rects = detector(prev_gray, 0)
       
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

            if mouth_img is not None:
                # confer this
                # https://github.com/seanexplode/LipReader/blob/master/TrackFaces.c#L68
                if prev_mouth_img is None:
                    prev_mouth_img_2 = mouth_img
                else:
                    for prev_rect in prev_rects:
                        prev_shape = predictor(prev_gray, prev_rect)
                        prev_shape = face_utils.shape_to_np(prev_shape)
                        prev_mouth_shape = prev_shape[m_start:m_end+1]

                        prev_leftmost_x = min(x for x, y in prev_mouth_shape) - margin
                        prev_bottom_y = min(y for x, y in prev_mouth_shape) - margin
                        prev_rightmost_x = max(x for x, y in prev_mouth_shape) + margin
                        prev_top_y = max(y for x, y in prev_mouth_shape) + margin

                        prev_w = prev_rightmost_x - prev_leftmost_x
                        prev_h = prev_top_y - prev_bottom_y

                        prev_x = int(prev_leftmost_x - 0.1 * prev_w)
                        prev_y = int(prev_bottom_y - 0.1 * prev_h)

                        prev_w = int(1.2 * prev_w)
                        prev_h = int(1.2 * prev_h)

                        prev_mouth_img_2 = prev_gray[prev_bottom_y:prev_top_y, prev_leftmost_x:prev_rightmost_x]
                if SD.is_speaking(prev_mouth_img_2, mouth_img):
                    return mouth_img, 1

                return mouth_img, 0
            else:
                return 0, 0
    
    def detect_behavioral_cognitive_eng(self, frame, prev_pos, detector, predictor, m_start, m_end, prev_mouth_img, margin, emotional_data):
        gaze_data = self.detect_gaze(frame)
        gesture_data = self.detect_gesture(frame, prev_pos)
        speaker_data = self.detect_speak(frame, detector, predictor, m_start, m_end, prev_mouth_img, margin)

        print(gesture_data)
        print(speaker_data)
        behavioral_eng = ((gaze_data * 0.3) + ((emotional_data/100) * 0.33) + (gesture_data[1] * 0.12) + (speaker_data[1] * 0.25)) * 100
        cognitive_eng = ((gesture_data[1] * 0.3) + (speaker_data[1] * 0.5) + (emotional_data/100 * 0.2)) * 100
        # print("----------------------------")
        # print("Gaze data:", gaze_data)
        # print("Emotional data:", emotional_data)
        # print("Gesture Data",gesture_data[1])
        # print("Speaker Data",speaker_data[1])
        # print("----------------------------")
        # print("Behavioral Engagement: %.2f" % behavioral_eng)
        return behavioral_eng, cognitive_eng, gesture_data[0], speaker_data[0]
    
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
    
    def detect_overall_eng(self, emotional_engagement):

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
                result_behavioral_cognitive = self.detect_behavioral_cognitive_eng(frame, prev_pos_1, detector, predictor, m_start, m_end, prev_mouth_img_1, i1, margin, emotional_engagement)

                prev_pos_1 = result_behavioral_cognitive[2]
                prev_mouth_img_1 = result_behavioral_cognitive[3]
                i1 = result_behavioral_cognitive[4]

                print("------------------------------")
                print("Emotional engagement:", emotional_engagement)
                print("Behavioral engagement:", result_behavioral_cognitive[0])
                print("Cognitive engagement:", result_behavioral_cognitive[1])
                print("------------------------------")

            except Exception as err:
                print(err)
                continue
        
        return {"emotional": emotional_engagement, "behavioral":result_behavioral_cognitive[0], "cognitive": result_behavioral_cognitive[1]}
    
    def detect_overall_eng_per_frame(self, frame, prev_pos_1, prev_mouth_img_1, emotional_engagement):

        #SPEAK VARIABLES
        # initialize dlib's face detector (HOG-based) and then create
        # the facial landmark predictor
        detector = dlib.get_frontal_face_detector()
        predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")

        # grab the indices of the facial landmarks for mouth
        m_start, m_end = face_utils.FACIAL_LANDMARKS_IDXS['mouth']

        result_behavioral_cognitive = self.detect_behavioral_cognitive_eng(frame, prev_pos_1, detector, predictor, m_start, m_end, prev_mouth_img_1, self.margin, emotional_engagement)

        # print("------------------------------")
        # print("Emotional engagement:", result_emotional)
        # print("Behavioral engagement:", result_behavioral_cognitive[0])
        # print("Cognitive engagement:", result_behavioral_cognitive[1])
        # print("------------------------------")
        
        return {"emotional": round(emotional_engagement,2),
                "behavioral":round(result_behavioral_cognitive[0],2), 
                "cognitive": round(result_behavioral_cognitive[1],2),}

