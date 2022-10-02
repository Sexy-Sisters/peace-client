import React, { useEffect, useState } from "react";
import "../styles/Header.scss";
import SignUp from "./SignUp";
import Modal from "react-modal";
import { Link } from "react-router-dom";

function Header() {
  const [modal, setModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const logout = () => {
    localStorage.removeItem('access-token');
    localStorage.removeItem('refresh-token');
    localStorage.removeItem('user');
    console.log('로그아웃됨!');
    window.location.reload();
  }
  return (
    <header>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <img src="/images/logo.png" alt="로고" />
      </Link>
      <div className="Header list">
        <Link to="/song">
          <span>기상송 신청</span>
        </Link>
        <Link to="/chart">
          <span><span className="Header English">BSSM</span> 차트</span>
        </Link>
        <Link to={'/userlist'}>
          <span>플레이리스트</span>
        </Link>
        <a href="https://github.com/Wake-Up-Song/Server/issues"><span>피드백</span></a>
      </div>
      {localStorage.getItem('access-token') ?
        <div className="Header signup">
          <Link to={"/mypage"} className="Header btn">
            <span>PROFILE</span>
          </Link>
          <span onClick={logout} className="Header btn">LOGOUT</span>
        </div>
        :
        <div className="Header signup">
          <span
            onClick={() => {
              setIsSignUp(true);
              setModal(true);
            }}
            className="Header btn"
          >
            SIGN UP
          </span>
          <span
            onClick={() => {
              setIsSignUp(false);
              setModal(true);
            }}
            className="Header btn"
          >
            LOGIN
          </span>
        </div>
      }
      <Modal isOpen={modal}
        onRequestClose={() => setModal(false)}
        style={{
          overlay: {
            backgroundColor: "rgba(134, 134, 134, 0.2)",
            zIndex: 100,
          },
          content: {
            width: "700px",
            height: "500px",
            margin: "auto",
            borderRadius: "20px",
            padding: 0,
            overflowX: "hidden",
            backgroundColor: '#FFF9F1',
          },
        }}>
        <div className="modal-header"></div>
        <SignUp type={isSignUp} />
      </Modal>
    </header>
  );
}

export default Header;
