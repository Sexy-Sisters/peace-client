import React from 'react'
import '../styles/MyPage.scss'

function HeaderPoint({ setModal }) {
  return (
    <div className="modal-header-mypage">
      <div className="modal-header-mypage circle">
        <div className="top-circle" style={setModal ? { cursor: 'pointer', backgroundColor: '#EA0303' } : { backgroundColor: '#EA0303' }} onClick={() => setModal(false)}></div>
        <div className="top-circle" style={{ backgroundColor: '#F6C927' }}></div>
        <div className="top-circle" style={{ backgroundColor: '#2A9A0E' }}></div>
      </div>
    </div>
  )
}

export default HeaderPoint