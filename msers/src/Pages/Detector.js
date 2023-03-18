import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../Components/Navbar'
import { useNavigate } from 'react-router-dom'
import { useStopwatch } from 'react-timer-hook'
import Webcam from "react-webcam";
import './Detector.css'
import { getParticipantId, getStudentId } from '../Helper/Utils/Common'
import { createEngagement } from '../Helper/ApiCalls/DetectorApi';
import toast, { Toaster } from 'react-hot-toast';



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

  async function submit(frame_data) {
    const response = await createEngagement({
      "student_id": getStudentId(),
      "participant_id": getParticipantId(),
      "frame_data": frame_data,
      "timestamp": new Date(),
    });
    console.log(response)
    if(response.data.status != 200) {
      toast.error("An unexpected error occurred.")
    }
  }

  useEffect(() => {
    getVideo();
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

  const takePhoto = () => {
    let photo = photoRef.current;
    let strip = stripRef.current;

    console.warn(strip);

    const data = photo.toDataURL("image/jpeg");
    submit(photo.toDataURL("image/jpeg"))
  };

  const stopStreaming = () => {
    stream.getTracks().forEach((track) => {
      track.stop();
    });
    clearInterval();

    navigate("/survey")
  }

  useEffect(() => {
    paintToCanvas()
    setTimeout(function () {
       const intervalId = setInterval(() => {
          takePhoto()
        }, 5000)

        return () => {
          clearInterval(intervalId);
          navigate("/survey")
        }
    }, 5000);
  },[photoRef])


  return (
    <div className='page'>
        <Navbar title={"MSERS"}/>
        <Toaster/>
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
      
    </div>
  )
}

export default Detector