import React from 'react'
import Header from './Header.tsx';
import "../styles/NotFound.css";

function NotFound() {
  return (
    <div>
      <Header />
      <div className='NotFound'>
        <span className='NotFound-title'>404 Error</span>
      </div>
    </div>
  )
}

export default NotFound;