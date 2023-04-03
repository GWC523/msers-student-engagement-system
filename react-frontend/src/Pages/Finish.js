import React, { useRef, useState } from 'react'
import Navbar from '../Components/Navbar'
import Slider, { Range } from 'rc-slider'
import 'rc-slider/assets/index.css'

import './Finish.css'

import Example from '../Assets/Images/example.png'
import Example2 from '../Assets/Images/example2.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createSelfReportEngagement, createSelfReportInfo } from '../Helper/ApiCalls/SurveyApi'
import { getParticipantId, getStudentId } from '../Helper/Utils/Common'
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function Finish() {
  const myRef = useRef(null)
  let navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [isClicked, setIsClicked] = useState(false);
  const [info, setInfo] = useState({
    environment: "",
    lighting_condition: "",
    camera_spec: "",
    computer_spec: ""
  })
  const [answers, setAnswers] = useState([
    {
      slide_no: "1",
      q1: "5",
      q2: "5",
      q3: "5",
      q4: "5",
      q5: "5",
      q6: "5",
      q7: "5",
      q8: "5",
      q9: "5",
      q10: "5",
      q11: "5",
      q12: "5",
    },
    {
      slide_no: "2",
      q1: "5",
      q2: "5",
      q3: "5",
      q4: "5",
      q5: "5",
      q6: "5",
      q7: "5",
      q8: "5",
      q9: "5",
      q10: "5",
      q11: "5",
      q12: "5",
    },
  ])

  const markDefault =                     {
                    10: {
                      label: "1 - highly disagree"
                    },
                    20: {
                      label: "2"
                    },
                    30: {
                      label: "3"
                    },
                    40: {
                      label: "4"
                    },
                    50: {
                      label: "5"
                    },
                    60: {
                      label: "6"
                    },
                    70: {
                      label: "7"
                    },
                    80: {
                      label: "8"
                    },
                    90: {
                      label: "9"
                    },
                    100: {
                      style: { width: "200px" }, 
                      label: "10 - highly agree",
                    },
                  }


  const handleInfoChange = (e) => {
    const { name, value} = e.target;
    setInfo(prevState => ({
        ...prevState,
        [name]: value
    }))
  }

  const handleAnswerChange = (e, index, name) => {

    if(e?.target) {
        const { name, value} = e.target;
        const list = [...answers]
        
        list[index - 1][name] = value;
        setAnswers(list)
    } else {
        const list = [...answers]
        
        list[index - 1][name] = Math.floor(e/10);
        console.log(list)
        setAnswers(list)
    }
  }

  const handleNext = () => {
    myRef.current.scrollIntoView()  
    if(page <= answers.length - 1) {
      setPage(page + 1)
    }
  }

  const handleBack = () => {
    myRef.current.scrollIntoView()  
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

// onAfterChange = (value) => {
//     console.log(value); //eslint-disable-line
//   };

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
      localStorage.clear();
      toast.success("Successfully saved participant info!")
      navigate("/thank-you")
    } else {
      toast.error("An unexpected error occured in saving participant info. Please try again. ")
    }
    console.log(response)
}


function submit() {

    if(!isClicked) {
      setIsClicked(true);
      submitSelfReportInfo();

      answers.map((data) => {
        submitSelfReportEngagement(data)
      })

    }
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
            <p className='body'><b>General Instructions:</b> For part I, please click the box that answers the question. For part II, please fill the input fields to answer the device specification. For part III,  please choose the option that indicates how much you agree with the statement for each slide.</p>
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
            <p className='part-header mt-5'><b>Part II.</b> Device Specification</p>
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
            <p ref={myRef} className='part-header mt-5'><b>Part III.</b> Engagement Level on the Online Class</p>

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
                <Slider 
                  min={10}
                  max={100}
                  value={(Math.floor(answers[page - 1]?.q1)*10)} 
                  onChange={(e) => handleAnswerChange(e, page, "q1")}
                  trackStyle={{ backgroundColor: '#E0E45B', height: 5}}
                  handleStyle={{borderColor: '#00A98C', backgroundColor: '#00A98C'}}
                  dotStyle={{ borderColor: '#00A98C' }}
                  activeDotStyle={{ borderColor: '#E0E45B' }}
                  className="slider"
                  marks={markDefault}
                  />
              </div>
            </div>
            <div className="form-group row mt-5">
            <label for="inputValue" className="col-sm-4 col-form-label">2. I felt bored in this part of the class</label>
              <div class="col-sm-4">
                <Slider 
                  min={10}
                  max={100}
                  value={(Math.floor(answers[page - 1]?.q2)*10)} 
                  onChange={(e) => handleAnswerChange(e, page, "q2")}
                  trackStyle={{ backgroundColor: '#E0E45B', height: 5}}
                  handleStyle={{borderColor: '#00A98C', backgroundColor: '#00A98C'}}
                  dotStyle={{ borderColor: '#00A98C' }}
                  activeDotStyle={{ borderColor: '#E0E45B' }}
                  className="slider"
                  marks={markDefault}
                  />
              </div>
            </div>
            <div className="form-group row mt-5">
            <label for="inputValue" className="col-sm-4 col-form-label">3. I dislike this part of this class</label>
              <div class="col-sm-4">
                <Slider 
                  min={10}
                  max={100}
                  value={(Math.floor(answers[page - 1]?.q3)*10)} 
                  onChange={(e) => handleAnswerChange(e, page, "q3")}
                  trackStyle={{ backgroundColor: '#E0E45B', height: 5}}
                  handleStyle={{borderColor: '#00A98C', backgroundColor: '#00A98C'}}
                  dotStyle={{ borderColor: '#00A98C' }}
                  activeDotStyle={{ borderColor: '#E0E45B' }}
                  className="slider"
                  marks={markDefault}
                  />
              </div>
            </div>
            <div className="form-group row mt-5">
            <label for="inputValue" className="col-sm-4 col-form-label">4. I felt focused in this part of the class</label>
              <div class="col-sm-4">
                <Slider 
                  min={10}
                  max={100}
                  value={(Math.floor(answers[page - 1]?.q4)*10)} 
                  onChange={(e) => handleAnswerChange(e, page, "q4")}
                  trackStyle={{ backgroundColor: '#E0E45B', height: 5}}
                  handleStyle={{borderColor: '#00A98C', backgroundColor: '#00A98C'}}
                  dotStyle={{ borderColor: '#00A98C' }}
                  activeDotStyle={{ borderColor: '#E0E45B' }}
                  className="slider"
                  marks={markDefault}
                  />
              </div>
            </div>


            <p className='mt-5 engagement-header'>Behavioral</p>
            <div className="form-group row">
            <label for="inputValue" className="col-sm-4 col-form-label">1. . I am actively engaged in this part of the class (Example: Asking and/or answering questions and being focused on class)</label>
              <div class="col-sm-4">
                <Slider 
                  min={10}
                  max={100}
                  value={(Math.floor(answers[page - 1]?.q5)*10)} 
                  onChange={(e) => handleAnswerChange(e, page, "q5")}
                  trackStyle={{ backgroundColor: '#E0E45B', height: 5}}
                  handleStyle={{borderColor: '#00A98C', backgroundColor: '#00A98C'}}
                  dotStyle={{ borderColor: '#00A98C' }}
                  activeDotStyle={{ borderColor: '#E0E45B' }}
                  className="slider"
                  marks={markDefault}
                  />
              </div>
            </div>
            <div className="form-group row mt-2">
            <label for="inputValue" className="col-sm-4 col-form-label">2. I am attentive in this part of the class (Example: not doing any off task events, taking notes, not feeling sleepy)</label>
              <div class="col-sm-4">
                <Slider 
                  min={10}
                  max={100}
                  value={(Math.floor(answers[page - 1]?.q6)*10)} 
                  onChange={(e) => handleAnswerChange(e, page, "q6")}
                  trackStyle={{ backgroundColor: '#E0E45B', height: 5}}
                  handleStyle={{borderColor: '#00A98C', backgroundColor: '#00A98C'}}
                  dotStyle={{ borderColor: '#00A98C' }}
                  activeDotStyle={{ borderColor: '#E0E45B' }}
                  className="slider"
                  marks={markDefault}
                  />
              </div>
            </div>
            <div className="form-group row mt-5">
            <label for="inputValue" className="col-sm-4 col-form-label">3. I felt positive in this part of the class. </label>
              <div class="col-sm-4">
                <Slider 
                  min={10}
                  max={100}
                  value={(Math.floor(answers[page - 1]?.q7)*10)} 
                  onChange={(e) => handleAnswerChange(e, page, "q7")}
                  trackStyle={{ backgroundColor: '#E0E45B', height: 5}}
                  handleStyle={{borderColor: '#00A98C', backgroundColor: '#00A98C'}}
                  dotStyle={{ borderColor: '#00A98C' }}
                  activeDotStyle={{ borderColor: '#E0E45B' }}
                  className="slider"
                  marks={markDefault}
                  />
              </div>
            </div>
            <div className="form-group row mt-5">
            <label for="inputValue" className="col-sm-4 col-form-label">4. I felt focused in this part of the class</label>
              <div class="col-sm-4">
               <Slider 
                  min={10}
                  max={100}
                  value={(Math.floor(answers[page - 1]?.q8)*10)} 
                  onChange={(e) => handleAnswerChange(e, page, "q8")}
                  trackStyle={{ backgroundColor: '#E0E45B', height: 5}}
                  handleStyle={{borderColor: '#00A98C', backgroundColor: '#00A98C'}}
                  dotStyle={{ borderColor: '#00A98C' }}
                  activeDotStyle={{ borderColor: '#E0E45B' }}
                  className="slider"
                  marks={markDefault}
                  />
              </div>
            </div>

            <p className='mt-5 engagement-header'>Cognitive</p>
            <div className="form-group row">
            <label for="inputValue" className="col-sm-4 col-form-label">1. I felt so engaged in the class that I want to learn more about this part</label>
              <div class="col-sm-4">
               <Slider 
                  min={10}
                  max={100}
                  value={(Math.floor(answers[page - 1]?.q9)*10)} 
                  onChange={(e) => handleAnswerChange(e, page, "q9")}
                  trackStyle={{ backgroundColor: '#E0E45B', height: 5}}
                  handleStyle={{borderColor: '#00A98C', backgroundColor: '#00A98C'}}
                  dotStyle={{ borderColor: '#00A98C' }}
                  activeDotStyle={{ borderColor: '#E0E45B' }}
                  className="slider"
                  marks={markDefault}
                  />
              </div>
            </div>
            <div className="form-group row mt-5">
            <label for="inputValue" className="col-sm-4 col-form-label">2. I am interested in this part of the class</label>
              <div class="col-sm-4">
                <Slider 
                  min={10}
                  max={100}
                  value={(Math.floor(answers[page - 1]?.q10)*10)} 
                  onChange={(e) => handleAnswerChange(e, page, "q10")}
                  trackStyle={{ backgroundColor: '#E0E45B', height: 5}}
                  handleStyle={{borderColor: '#00A98C', backgroundColor: '#00A98C'}}
                  dotStyle={{ borderColor: '#00A98C' }}
                  activeDotStyle={{ borderColor: '#E0E45B' }}
                  className="slider"
                  marks={markDefault}
                  />
              </div>
            </div>
            <div className="form-group row mt-5">
            <label for="inputValue" className="col-sm-4 col-form-label">3. I asked questions/participated in this part of the class.</label>
              <div class="col-sm-4">
                <Slider 
                  min={10}
                  max={100}
                  value={(Math.floor(answers[page - 1]?.q11)*10)} 
                  onChange={(e) => handleAnswerChange(e, page, "q11")}
                  trackStyle={{ backgroundColor: '#E0E45B', height: 5}}
                  handleStyle={{borderColor: '#00A98C', backgroundColor: '#00A98C'}}
                  dotStyle={{ borderColor: '#00A98C' }}
                  activeDotStyle={{ borderColor: '#E0E45B' }}
                  className="slider"
                  marks={markDefault}
                  />
              </div>
            </div>
            <div className="form-group row mt-5">
            <label for="inputValue" className="col-sm-4 col-form-label">4. This part made me want to ask myself questions to make sure I understand the class</label>
              <div class="col-sm-4">
                <Slider 
                  min={10}
                  max={100}
                  value={(Math.floor(answers[page - 1]?.q12)*10)} 
                  onChange={(e) => handleAnswerChange(e, page, "q12")}
                  trackStyle={{ backgroundColor: '#E0E45B', height: 5}}
                  handleStyle={{borderColor: '#00A98C', backgroundColor: '#00A98C'}}
                  dotStyle={{ borderColor: '#00A98C' }}
                  activeDotStyle={{ borderColor: '#E0E45B' }}
                  className="slider"
                  marks={markDefault}
                  />
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
              {page == answers.length && (
                <button className='submit-btn' onClick={() => submit()}>Submit</button>
              )}
            </div>
         </div>
    </div>
  )
}

export default Finish