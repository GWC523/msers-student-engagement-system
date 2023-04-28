import React, { useEffect, useState } from 'react'
import Navbar from '../Components/Navbar'
import { useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';

//Assets
import "./Homepage.css"

//css
import LandingImage from "../Assets/Images/homepage_image.png"
import { ValidateForm } from '../Helper/Validation/FormValidation'
import InputError from '../Components/InputError'
import { createStudent } from '../Helper/ApiCalls/PersonalDetailsApi'
import { getCameraPermisions, getParticipantId } from '../Helper/Utils/Common';


function Homepage() {
  const [isClicked, setIsClicked] = useState(false)
  const [proceed, setProceed] = useState(false);
  const [personalDetails, setPersonalDetails] = useState({
    name: "",
    student_id: "",
    age: "",
    gender: "",
    year_level: "",
    program: ""
  })
  const [isError, setIsError] = useState({
    name: false,
    student_id: false,
    age: false,
    gender: false,
    year_level: false,
    program: false
  })
  let navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value} = e.target;
    setPersonalDetails(prevState => ({
        ...prevState,
        [name]: value
    }))
  }

  async function submit() {
    if(ValidateForm(personalDetails, setIsError) === true && !isClicked){
        setIsClicked(true);
        const response = await createStudent(personalDetails);
        console.log(response)
        if(response.data.status == 200) {
            localStorage.setItem("participant_id", JSON.stringify(response.data.data?.id));
            localStorage.setItem("student_id", JSON.stringify(response.data.data?.student_id));
            navigate("/detector");
        } else {
            console.log("Error")
            toast.error("An unexpected error occurred. Please try again.")
        }

    } else {
        toast.error("Please fill-up all inputs to proceed.")
    }
  }

  useEffect(() => {
    if(getParticipantId() != null) {
        console.log(getParticipantId())
        navigate("/detector");
    }
  },[])


  return (
    <div className='page'>
        <Navbar title={"MSERS"}/>
        <div className='content'>
            <Toaster/>
            <div className='row'>
                <div className='col-md-6'>
                        {proceed == true && (
                            <>
                            <p className='form__title floating'>Personal Details</p>
                            <div className='row form__content floating'>
                                <div className='col-md-6'>
                                    <input type="text" name="name" className='input__text_1' placeholder='Name' value={personalDetails.name} onChange={(e) => handleChange(e)}/>
                                    <InputError isValid={isError.name} message={'Name is required*'}/>
                                    <input type="number" name="age" className='input__text_1 mt-4' placeholder='Age' value={personalDetails.age} onChange={(e) => handleChange(e)}/>
                                    <InputError isValid={isError.age} message={'Age is required*'}/>
                                    <select id="standard__select" name="year_level" value={personalDetails.year_level} onChange={(e) => handleChange(e)}>
                                        <option value="" selected disabled>Year Level</option>
                                        <option value="1">I</option>
                                        <option value="2">II</option>
                                        <option value="3">III</option>
                                        <option value="4">IV</option>
                                    </select>
                                    <InputError isValid={isError.year_level} message={'Year level is required*'}/>
                                </div>
                                <div className='col-md-6'>
                                    <input type="text" name="student_id" className='input__text_2' placeholder='Student ID' value={personalDetails.student_id} onChange={(e) => handleChange(e)}/>
                                    <InputError isValid={isError.student_id} message={'Student ID is required*'}/>
                                    <select id="standard__select" name="gender" value={personalDetails.gender} onChange={(e) => handleChange(e)}>
                                        <option value="" selected disabled>Sex</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                    <InputError isValid={isError.gender} message={'Gender is required*'}/>
                                    <input type="text" name="program" className='input__text_2 mt-4' placeholder='Program' value={personalDetails.program} onChange={(e) => handleChange(e)}/>
                                    <InputError isValid={isError.program} message={'Program is required*'}/>
                                </div>
                                </div>
                            <p className='form__agreement'>By clicking start, you agree to let the site record your personal data for research purposes. Your data will only be used for this purpose only. Rest assured your data will be protected for privacy and confidentiality. </p>
                            <button className='start__btn' onClick={() => submit()}>Start</button>
                            </>
                        )}
                        {proceed == false && (
                            <>
                            <p className='homepage__title floating'>Multi-dimensional Student Engagement Recognition System (MSERS)</p>
                            <p className='homepage__body floating'>The study's goal is to develop a student engagement detector that covers the three dimensions of engagement: behavioral, emotional, and cognitive engagement in real-time using existing computer-vision algorithms as its foundation and assess its accuracy of this developed integrated system in a synchronous online discussion.</p>
                            <button className='proceed__btn' onClick={() => setProceed(true)}>Proceed</button>
                            </>
                        )}
                </div>
                <div className='col-md-6'>
                    <img src={LandingImage} className="homepage__image floating d-flex" alt="landing image"/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Homepage