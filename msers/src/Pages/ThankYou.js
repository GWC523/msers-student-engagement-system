import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../Components/Navbar'
import './ThankYou.css'


function ThankYou() {

  return (
    <div className='page'>
        <Navbar title={"MSERS"}/>
             <FontAwesomeIcon
                icon={"heart"}
                alt={"heart"}
                aria-hidden="true"
                className="heart-icon"
                />
            <p className='thank-you-title mt-3 floating'>Thank Your for Your Participation!</p>
            <p className='thank-you-body floating'>The testing session has ended, you can now close this tab. Your participation in this study is greatly appreciated.</p>
    </div>
  )
}

export default ThankYou