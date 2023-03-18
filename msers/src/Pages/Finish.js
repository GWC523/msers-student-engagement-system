import React, { useState } from 'react'
import Navbar from '../Components/Navbar'

import './Finish.css'

import Example from '../Assets/Images/example.png'
import Example2 from '../Assets/Images/example2.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createSelfReportEngagement, createSelfReportInfo } from '../Helper/ApiCalls/SurveyApi'
import { getParticipantId, getStudentId } from '../Helper/Utils/Common'
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'

function Finish() {
  let navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [info, setInfo] = useState({
    environment: "",
    lighting_condition: "",
    camera_spec: "",
    computer_spec: ""
  })
  const [answers, setAnswers] = useState([
    {
      slide_no: "1",
      q1: "",
      q2: "",
      q3: "",
      q4: "",
      q5: "",
      q6: "",
      q7: "",
      q8: "",
      q9: "",
      q10: "",
      q11: "",
      q12: "",
    },
    {
      slide_no: "2",
      q1: "",
      q2: "",
      q3: "",
      q4: "",
      q5: "",
      q6: "",
      q7: "",
      q8: "",
      q9: "",
      q10: "",
      q11: "",
      q12: "",
    },
  ])

  const handleInfoChange = (e) => {
    const { name, value} = e.target;
    setInfo(prevState => ({
        ...prevState,
        [name]: value
    }))
  }

  const handleAnswerChange = (e, index) => {
    const { name, value} = e.target;
    const list = [...answers]
    
    list[index - 1][name] = value;
    setAnswers(list)
  }

  const handleNext = () => {
    if(page <= answers.length - 1) {
      setPage(page + 1)
    }
  }

  const handleBack = () => {
    if(page > 1) {
      setPage(page - 1)
    }
  }

async function submitSelfReportEngagement(data) {
  const response = await createSelfReportEngagement({
      "student_id": getStudentId(),
      "participant_id": getParticipantId(),
      "slide_no": data.slide_no,
      "q1": data.q1,
      "q2": data.q2,
      "q3": data.q3,
      "q4": data.q4,
      "q5": data.q4,
      "q6": data.q6,
      "q7": data.q7,
      "q8": data.q8,
      "q9": data.q9,
      "q10": data.q10,
      "q11": data.q11,
      "q12": data.q12,
    });
      if(response.data.status != 200) {
          toast.error("An unexpected error occured in saving self report data. Please try again. ")
      }
}

async function submitSelfReportInfo() {
  const response = await createSelfReportInfo({
      "student_id": getStudentId(),
      "participant_id": getParticipantId(),
      "environment": info.environment,
      "lighting_condition": info.lighting_condition,
      "camera_spec": info.camera_spec,
      "computer_spec": info.computer_spec,
    });

    if(response.data.status == 200) {
      toast.success("Successfully saved participant info!")
      navigate("/thank-you")
    } else {
      toast.error("An unexpected error occured in saving participant info. Please try again. ")
    }
    console.log(response)
}


function submit() {

    submitSelfReportInfo();

    answers.map((data) => {
      submitSelfReportEngagement(data)
    })
  }

  return (
    <div className='page'>
        <Navbar title={"MSERS"}/>
         <Toaster/>
         <div className='mt-5 d-flex justify-content-center'>
            <p className='redirect__header'>RESEARCH QUESTIONNAIRE</p>
         </div>
         <div className='finish-content'>
            <p className='redirect__content-header'>Dear Participant,</p>
            <p className='body'>  
              I am Gwyneth Chiu, a fourth-year BS Computer Science student from the University of the
              Philippines - Cebu who is currently in the process of doing my Special Project. Handed to 
              you is the questionnaire that will serve as the instrument from which we will be gathering 
              the much-needed information for this study to be accomplished. I request your utmost honesty
              and full comprehension in answering the questionnaire. In the interest of privacy, rest assured
              that all the information you provide will remain between you and us. Thank you very much for your cooperation.
            </p>
            <p className='body'><b>General Instructions:</b> For part I, please click the box that answers the question. For part III, please fill the input fields to answer the device specification. For part IV,  please choose the option that indicates how much you agree with the statement for each slide.</p>
            <p className='part-header mt-5'><b>Part I.</b> Environment Specification</p>
            <div class="form-group row">
              <label for="inputValue" className="col-sm-4 col-form-label">Where were you when you joined the online class?</label>
              <div className='col-sm-2'>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="environment" id="outdoor" value="outdoor" onChange={(e) => handleInfoChange(e)}/>
                  <label class="form-check-label" for="outdoor">Outdoor</label>
                </div>
              </div>
              <div className='col-sm-2'>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="environment" id="indoor" value="indoor" onChange={(e) => handleInfoChange(e)}/>
                  <label class="form-check-label" for="outdoor">Indoor</label>
                </div>
              </div>
            </div>
            <div class="form-group row">
              <label for="inputValue" className="col-sm-4 col-form-label">What was the lighting condition? </label>
              <div className='col-sm-2'>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="lighting_condition" id="poor" value="poor" onChange={(e) => handleInfoChange(e)}/>
                  <label class="form-check-label" for="poor">Poor</label>
                </div>
              </div>
              <div className='col-sm-2'>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="lighting_condition" id="moderate" value="moderate" onChange={(e) => handleInfoChange(e)}/>
                  <label class="form-check-label" for="moderate">Moderate</label>
                </div>
              </div>
              <div className='col-sm-2'>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="lighting_condition" id="well-lit" value="well-lit" onChange={(e) => handleInfoChange(e)}/>
                  <label class="form-check-label" for="well-lit">Well-lit</label>
                </div>
              </div>
            </div>
            <p className='part-header mt-5'><b>Part III.</b> Device Specification</p>
            <div className="form-group row">
            <label for="inputValue" className="col-sm-3 col-form-label">Camera Model and Specification: <span className='example'>(Example: built-in laptop web cam w/ resolution of 3 MP @ 30fps)</span></label>
              <div class="col-sm-4">
                <textarea className="form-control" id="camera_spec" rows="3" name="camera_spec" value={info?.camera_spec} onChange={(e) => handleInfoChange(e)}/>
              </div>
            </div>
            <div className="form-group row mt-4">
            <label for="inputValue" className="col-sm-3 col-form-label">Computer Model and Specification: <span className='example'>(Example: 2015 Macbook Pro 13” 2.5 GHz Quadcore Intel i5 CPU, 8GB RAM)</span></label>
              <div class="col-sm-4">
                <textarea className="form-control" id="computer_spec" rows="3" name="computer_spec" value={info?.computer_spec} onChange={(e) => handleInfoChange(e)}/>
              </div>
            </div>
            <p className='part-header mt-5'><b>Part IV.</b> Engagement Level on the Online Class</p>

            <div className='form-group mt-5 row d-flex justify-content-center'>
              <div className='col-sm-2 mt-5'>
                <FontAwesomeIcon
                  icon={"less-than"}
                  alt={"back"}
                  aria-hidden="true"
                  className="back-icon"
                  onClick={() => handleBack()}
                />
              </div>
              {page == 1 && (
                 <img src={Example} className="survey__image floating" alt="survey image 1"/>
              )}
              {page == 2 && (
                 <img src={Example2} className="survey__image floating" alt="survey image 2"/>
              )}
              <div className='col-sm-2 d-flex justify-content-end mt-5'>
                <FontAwesomeIcon
                  icon={"greater-than"}
                  alt={"back"}
                  aria-hidden="true"
                  className="next-icon"
                  onClick={() => handleNext()}
                />
              </div>
            </div>
            <p className='mt-2 d-flex justify-content-center bold'>SLIDE {page}</p>

            <p className='mt-5 engagement-header'>Emotional</p>
            <div className="form-group row">
            <label for="inputValue" className="col-sm-4 col-form-label">1. I felt happy in this part of the class</label>
              <div class="col-sm-4">
                <select id="standard__select_2" name="q1" value={answers[page - 1]?.q1} onChange={(e) => handleAnswerChange(e, page)}> {/** to add index */}
                    <option value="" selected disabled>Rate</option> 
                    <option value="1">1 - I don't agree at all</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10 - I very much agree</option>
                </select>
              </div>
            </div>
            <div className="form-group row mt-2">
            <label for="inputValue" className="col-sm-4 col-form-label">2. I felt bored in this part of the class</label>
              <div class="col-sm-4">
                <select id="standard__select_2" name="q2" value={answers[page - 1]?.q2} onChange={(e) => handleAnswerChange(e, page)}>
                    <option value="" selected disabled>Rate</option>
                    <option value="1">1 - I don't agree at all</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10 - I very much agree</option>
                </select>
              </div>
            </div>
            <div className="form-group row mt-2">
            <label for="inputValue" className="col-sm-4 col-form-label">3. I dislike this part of this class</label>
              <div class="col-sm-4">
                <select id="standard__select_2" name="q3" value={answers[page - 1]?.q3} onChange={(e) => handleAnswerChange(e, page)}>
                    <option value="" selected disabled>Rate</option>
                    <option value="1">1 - I don't agree at all</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10 - I very much agree</option>
                </select>
              </div>
            </div>
            <div className="form-group row mt-2">
            <label for="inputValue" className="col-sm-4 col-form-label">4. I felt focused in this part of the class</label>
              <div class="col-sm-4">
                <select id="standard__select_2" name="q4" value={answers[page - 1]?.q4} onChange={(e) => handleAnswerChange(e, page)}>
                    <option value="" selected disabled>Rate</option>
                    <option value="1">1 - I don't agree at all</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10 - I very much agree</option>
                </select>
              </div>
            </div>


            <p className='mt-5 engagement-header'>Behavioral</p>
            <div className="form-group row">
            <label for="inputValue" className="col-sm-4 col-form-label">1. . I am actively engaged in this part of the class (Example: Asking and/or answering questions and being focused on class)</label>
              <div class="col-sm-4">
                <select id="standard__select_2" name="q5" value={answers[page - 1]?.q5} onChange={(e) => handleAnswerChange(e, page)}>
                    <option value="" selected disabled>Rate</option>
                    <option value="1">1 - I don't agree at all</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10 - I very much agree</option>
                </select>
              </div>
            </div>
            <div className="form-group row mt-2">
            <label for="inputValue" className="col-sm-4 col-form-label">2. I am attentive in this part of the class (Example: not doing any off task events, taking notes, not feeling sleepy)</label>
              <div class="col-sm-4">
                <select id="standard__select_2" name="q6" value={answers[page - 1]?.q6} onChange={(e) => handleAnswerChange(e, page)}>
                    <option value="" selected disabled>Rate</option>
                    <option value="1">1 - I don't agree at all</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10 - I very much agree</option>
                </select>
              </div>
            </div>
            <div className="form-group row mt-2">
            <label for="inputValue" className="col-sm-4 col-form-label">2. I am attentive in this part of the class (Example: not doing any off task events, taking notes, not feeling sleepy)</label>
              <div class="col-sm-4">
                <select id="standard__select_2" name="q7" value={answers[page - 1]?.q7} onChange={(e) => handleAnswerChange(e, page)}>
                    <option value="" selected disabled>Rate</option>
                    <option value="1">1 - I don't agree at all</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10 - I very much agree</option>
                </select>
              </div>
            </div>
            <div className="form-group row mt-2">
            <label for="inputValue" className="col-sm-4 col-form-label">4. I felt focused in this part of the class</label>
              <div class="col-sm-4">
                <select id="standard__select_2" name="q8" value={answers[page - 1]?.q8} onChange={(e) => handleAnswerChange(e, page)}>
                    <option value="" selected disabled>Rate</option>
                    <option value="1">1 - I don't agree at all</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10 - I very much agree</option>
                </select>
              </div>
            </div>

            <p className='mt-5 engagement-header'>Cognitive</p>
            <div className="form-group row">
            <label for="inputValue" className="col-sm-4 col-form-label">1. I felt so engaged in the class that I want to learn more about this part</label>
              <div class="col-sm-4">
                <select id="standard__select_2" name="q9" value={answers[page - 1]?.q9} onChange={(e) => handleAnswerChange(e, page)}>
                    <option value="" selected disabled>Rate</option>
                    <option value="1">1 - I don't agree at all</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10 - I very much agree</option>
                </select>
              </div>
            </div>
            <div className="form-group row mt-2">
            <label for="inputValue" className="col-sm-4 col-form-label">2. I am interested in this part of the class</label>
              <div class="col-sm-4">
                <select id="standard__select_2" name="q10" value={answers[page - 1]?.q10} onChange={(e) => handleAnswerChange(e, page)}>
                    <option value="" selected disabled>Rate</option>
                    <option value="1">1 - I don't agree at all</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10 - I very much agree</option>
                </select>
              </div>
            </div>
            <div className="form-group row mt-2">
            <label for="inputValue" className="col-sm-4 col-form-label">3. This part of the class made me curious</label>
              <div class="col-sm-4">
                <select id="standard__select_2" name="q11" value={answers[page - 1]?.q11} onChange={(e) => handleAnswerChange(e, page)}>
                    <option value="" selected disabled>Rate</option>
                    <option value="1">1 - I don't agree at all</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10 - I very much agree</option>
                </select>
              </div>
            </div>
            <div className="form-group row mt-2">
            <label for="inputValue" className="col-sm-4 col-form-label">4. This part made me want to ask myself questions to make sure I understand the class</label>
              <div class="col-sm-4">
                <select id="standard__select_2" name="q12" value={answers[page - 1]?.q12} onChange={(e) => handleAnswerChange(e, page)}>
                    <option value="" selected disabled>Rate</option>
                    <option value="1">1 - I don't agree at all</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10 - I very much agree</option>
                </select>
              </div>
            </div>

            <div className="row mt-5 d-flex justify-content-center">
              <div className="col-sm-2">
                <FontAwesomeIcon
                  icon={"less-than"}
                  alt={"back"}
                  aria-hidden="true"
                  className="back-icon"
                  onClick={() => handleBack()}
                />
              </div>
              <div className="col-sm-2 d-flex justify-content-center">
                <span className='slide-no'>Slide {page}</span>
              </div>
              <div className="col-sm-2 d-flex justify-content-end">
                <FontAwesomeIcon
                  icon={"greater-than"}
                  alt={"next"}
                  aria-hidden="true"
                  className="next-icon"
                  onClick={() => handleNext()}
                />
              </div>
            </div>
            <div className='d-flex justify-content-center mb-5'>
              <button className='submit-btn' onClick={() => submit()}>Submit</button>
            </div>
         </div>
    </div>
  )
}

export default Finish