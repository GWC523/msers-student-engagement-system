import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../Components/Navbar'
import { useNavigate } from 'react-router-dom'
import { useStopwatch } from 'react-timer-hook'
import Webcam from "react-webcam";
import './Detector.css'
import { getCameraPermisions, getParticipantId, getStudentId } from '../Helper/Utils/Common'
import { createEngagement } from '../Helper/ApiCalls/DetectorApi';
import toast, { Toaster } from 'react-hot-toast';
import {disableBodyScroll, clearAllBodyScrollLocks} from "body-scroll-lock"
import * as faceapi from 'face-api.js';




function MyStopwatch() {
  const {
    seconds,
    minutes,
    hours
  } = useStopwatch({ autoStart: true });


  return (
    <div>
      <div className='timer'>
            <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
      </div>
    </div>
  );
}

function Detector() {
  let navigate = useNavigate();
  let lastimg = "";
  const pageRef = useRef(null);
  const [isGranted, setIsGranted] = useState(true);
  const webcamRef = useRef(null);

  const videoConstraints = {
  width: 780,
  height: 400,
  facingMode: "user"
};

  async function submit(frame_data, emotion_engagement) {
    const response = await createEngagement({
      "student_id": getStudentId(),
      "participant_id": getParticipantId(),
      "frame_data": frame_data,
      "last_frame": lastimg,
      "timestamp": new Date(),
      "emotional_engagement": emotion_engagement,
    });
    if(response.data.status != 200) {
      toast.error("An unexpected error occurred.")
    }
    lastimg = frame_data
  }

  useEffect(() => {
    Promise.all([
     faceapi.nets.tinyFaceDetector.loadFromUri('/static/models'),
     faceapi.nets.faceLandmark68Net.loadFromUri('/static/models'),
     faceapi.nets.faceRecognitionNet.loadFromUri('/static/models'),
     faceapi.nets.faceExpressionNet.loadFromUri('/static/models'),
   ])
  }, [])


  const stopStreaming = () => {
    clearInterval();

    navigate("/survey")
  }

  const capture = (emotion_engagement) => {
    const imageSrc = webcamRef.current.getScreenshot();
    submit(imageSrc, emotion_engagement)
  };


  const calculate_emotional = (emotion, emotion_value) => {
    if(emotion == "happy") {
      return emotion_value * 1 * 100
    }
    else if (emotion == "surprise") {
      return emotion_value * 1 * 100
    }
    else if (emotion == "neutral") {
      return emotion_value * 0.8 * 100
    }
    else if (emotion == "sad") {
      return emotion_value * 0.4 * 100
    }
    else if (emotion == "angry") {
      return emotion_value * 0.3 * 100
    }
    else if (emotion == "fear") {
      return emotion_value * 0.25 * 100
    }
    else if (emotion == "disgusted") {
      return emotion_value * 0.2 * 100
    }
  }

  useEffect(() => {
    setTimeout(function () {
       const intervalId = setInterval( async () => {
        if(isGranted) {
            const video = webcamRef.current.video;
            const canvas = faceapi.createCanvasFromMedia(video);
            // Set canvas dimensions
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
                const detections = await faceapi.detectAllFaces 
                  (video, new faceapi.TinyFaceDetectorOptions())
                    .withFaceLandmarks()
                    .withFaceExpressions();

              if(detections[0]?.expressions) {
                let maxVal = -Infinity;
                let emotion = '';
                for (const prop in detections[0].expressions) {
                  if (detections[0].expressions[prop] > maxVal) {
                    maxVal = detections[0].expressions[prop];
                    emotion = prop;
                  }
                }

                capture(calculate_emotional(emotion, maxVal))
              } else {
                capture(calculate_emotional('neutral', 0))
              }
        }
        },6000)

        return () => {
          clearInterval(intervalId);
        }
    }, 10000);
  },[webcamRef])

  useEffect(() => {
      const intervalId = setInterval( async () => {
        navigator.permissions.query({ name: "camera" }).then(res => {
          if(res.state == "granted"){
            setIsGranted(true);
          } else {
            setIsGranted(false);
          }
      });
    }, 1000)

    if(isGranted) {
      return () => {
          clearInterval(intervalId);
        }
    }
  },[])


  return (
    <div className='page' ref={pageRef}>
        <Navbar title={"MSERS"}/>
        <Toaster/>
        {isGranted && (
          <>
          <div className='content d-flex justify-content-center'>
            <div class="loading">
            <span className='loader__title'>System Running</span>
            <div></div>
            <div></div>
            <div></div>
            </div>
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat='image/jpeg'
                className='webcam'
                width={780}
                height={400}
                videoConstraints={videoConstraints}
            /> 
        </div>
        <div className='d-flex justify-content-center'>
            <p className='detector__body'>Hi there! The system is currently detecting your student engagement levels. Please do not close or hide this tab while class is still ongoing. Click the end button once the class is finished. You will be redirected to a new page to fill-up the self-reported in-class student engagement survey. This data will be compared to the results computed by using the system. (Notice: please make sure the camera light is on to ensure that the camera is being used.) </p>
        </div>
        <div className='d-flex justify-content-center'>
            <MyStopwatch />
        </div>
        <div className='d-flex justify-content-center'>
          <button className='end__btn' onClick={() => stopStreaming()}>End</button>
        </div>
          </>
        )}   
         {!isGranted && (
          <>
            <div className='content d-flex justify-content-center'>
            <span className='loader__title'>System Not Running</span>
            </div>
        <div className='d-flex justify-content-center'>
            <p className='detector__body'>The system is currently not detecting your student engagement levels. Please accept the permission to use your camera so that the detector can run.</p>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat='image/jpeg'
                  className='webcam'
                  width={780}
                  height={400}
                  videoConstraints={videoConstraints}
                /> 
        </div>
          </>
        )}   
    </div>
  )
}

export default Detector