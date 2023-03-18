import React from 'react'

import "./Navbar.css"

function Navbar({title}) {
  return (
        <header className='navbar'>
            <div className='navbar__title navbar__item'>{title}</div>  
        </header>
  )
}

export default Navbar