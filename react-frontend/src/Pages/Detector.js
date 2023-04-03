import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../Components/Navbar'
import { useNavigate } from 'react-router-dom'
import { useStopwatch } from 'react-timer-hook'
import Webcam from "react-webcam";
import './Detector.css'
import { getCameraPermisions, getParticipantId, getStudentId } from '../Helper/Utils/Common'
import { createEngagement } from '../Helper/ApiCalls/DetectorApi';
import toast, { Toaster } from 'react-hot-toast';
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
  const [stream, setStream] = useState()
  const videoRef = useRef(null);
  const photoRef = useRef(null);
  const stripRef = useRef(null);
  const [isGranted, setIsGranted] = useState(false);

  async function submit(frame_data, emotion_engagement) {
    console.log("Emotion Engagement in react:", emotion_engagement)
    const response = await createEngagement({
      "student_id": getStudentId(),
      "participant_id": getParticipantId(),
      "frame_data": frame_data,
      "timestamp": new Date(),
      "emotional_engagement": emotion_engagement,
    });
    console.log(response)
    if(response.data.status != 200) {
      toast.error("An unexpected error occurred.")
    }
  }

  useEffect(() => {
    Promise.all([
     faceapi.nets.tinyFaceDetector.loadFromUri('/static/models'),
     faceapi.nets.faceLandmark68Net.loadFromUri('/static/models'),
     faceapi.nets.faceRecognitionNet.loadFromUri('/static/models'),
     faceapi.nets.faceExpressionNet.loadFromUri('/static/models'),
   ]).then(() => {
      getVideo();
   })
  }, [videoRef])

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 300 } })
      .then(stream => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
        setStream(stream)
      })
      .catch(err => {
        console.error("error:", err);
      });
  };

  const paintToCanvas = () => {
    let video = videoRef.current;
    let photo = photoRef.current;
    let ctx = photo.getContext("2d");

    const width = 320;
    const height = 240;
    photo.width = width;
    photo.height = height;

    return setInterval(() => {
      ctx.drawImage(video, 0, 0, width, height);
    }, 200);
    
  };

  const takePhoto = (emotion_engagement) => {
    let photo = photoRef.current;
    let strip = stripRef.current;

    console.warn(strip);

    const data = photo.toDataURL("image/jpeg");
    submit(photo.toDataURL("image/jpeg"), emotion_engagement)
  };

  const stopStreaming = () => {
    stream.getTracks().forEach((track) => {
      track.stop();
    });
    clearInterval();

    navigate("/survey")
  }

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
    paintToCanvas()
    setTimeout(function () {
       const intervalId = setInterval( async () => {
        let video = videoRef.current;
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
            console.log(emotion, calculate_emotional(emotion, maxVal))

            takePhoto(calculate_emotional(emotion, maxVal))
          } else {
            takePhoto(calculate_emotional('neutral', 0))
          }
        }, 5000)

        return () => {
          clearInterval(intervalId);
          navigate("/survey")
        }
    }, 5000);
  },[photoRef])

  useEffect(() => {
        navigator.permissions.query({ name: "camera" }).then(res => {
          if(res.state == "granted"){
            setIsGranted(true);
          } else {
            setIsGranted(false);
          }
      });
  },[])


  return (
    <div className='page'>
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
        </div>
        <div className='d-flex justify-content-center'>
            <p className='detector__body'>Hi there! The system is currently detecting your student engagement levels. Please do not close this tab while class is still ongoing. Click the end button once the class is finished. You will be redirected to a new page to fill-up the self-reported in-class student engagement survey. This data will be compared to the results computed by using the system. </p>
        </div>
        <div className='d-flex justify-content-center'>
            <MyStopwatch />
        </div>
      <video onCanPlay={() => paintToCanvas()} ref={videoRef} style={{ display: 'none' }}/>
      <canvas ref={photoRef} style={{ display: 'none' }}/>
        <button className='end__btn' onClick={() => stopStreaming()}>End</button>
          </>
        )}    
         {!isGranted && (
          <>
            <div className='content d-flex justify-content-center'>
            <span className='loader__title'>System Not Running</span>
            </div>
        <div className='d-flex justify-content-center'>
            <p className='detector__body'>The system is currently not detecting your student engagement levels. Please accept the permission to use your camera so that the detector can run. Refresh page once allowed and go back to https://msers.site to continue </p>
        </div>
      <video onCanPlay={() => paintToCanvas()} ref={videoRef} style={{ display: 'none' }}/>
      <canvas ref={photoRef} style={{ display: 'none' }}/>
          </>
        )}   
    </div>
  )
}

export default Detector