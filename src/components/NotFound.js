import React from 'react'
import { Header } from '../allFiles';
import "../styles/NotFound.scss";

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