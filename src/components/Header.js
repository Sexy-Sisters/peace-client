import React, { useEffect, useState } from "react";
import "../styles/Header.css";
import SignUp from "./SignUp";
import { Link } from "react-router-dom";
import { instance } from "../instance/instance";

function Header() {
  const [modal, setModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const onClick = () => {
    setModal((prev) => !prev);
  };
  const changeType = () => {
    setIsSignUp((prev) => !prev);
  };
  const logout = () => {
    sessionStorage.removeItem('access-token');
    sessionStorage.removeItem('refresh-token');
    console.log('로그아웃됨!');
    window.location.reload();
  }
  return (
    <header>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <span className="Header-logo">BSSM</span>
      </Link>
      <div className="Header-list">
        <Link to="/song">
          <span>기상송 신청</span>
        </Link>
        <Link to="/chart">
          <span>BSSM 차트</span>
        </Link>
        <a href="https://github.com/Wake-Up-Song/Server/issues"><span>피드백</span></a>
      </div>
      {sessionStorage.getItem('access-token') ?
        <div className="Header-signup">
          <Link to={"/mypage"} className="Header-btn">
            <span>프로필</span>
          </Link>
          <span onClick={logout} className="Header-btn">로그아웃</span>
        </div>
        :
        <div className="Header-signup">
          <span
            onClick={() => {
              setIsSignUp(true);
              setModal(true);
            }}
            className="Header-btn"
          >
            회원가입
          </span>
          <span
            onClick={() => {
              setIsSignUp(false);
              setModal(true);
            }}
            className="Header-btn"
          >
            로그인
          </span>
        </div>
      }
      {modal && (
        <SignUp onClick={onClick} changeType={changeType} type={isSignUp} />
      )}
    </header>
  );
}

export default Header;
