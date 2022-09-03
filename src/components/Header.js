import React, { useState } from "react";
import "../styles/Header.css";
import SignUp from "./SignUp";
import { Link } from "react-router-dom";

function Header() {
  const [modal, setModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const onClick = () => {
    setModal((prev) => !prev);
  };
  const changeType = () => {
    setIsSignUp((prev) => !prev);
  };
  return (
    <header>
      <Link to="/">
        <img src="./images/logo.png" alt="로고" className="Header-logo" />
      </Link>
      <div className="Header-list">
        <Link to="/song">
          <span>기상송 신청</span>
        </Link>
        <span>BSSM 차트</span>
        <span>투표하기</span>
        <span>피드백</span>
      </div>
      <div className="Header-signup">
        <span
          onClick={() => {
            setIsSignUp(true);
            setModal(true);
          }}
        >
          회원가입
        </span>
        <span
          onClick={() => {
            setIsSignUp(false);
            setModal(true);
          }}
        >
          로그인
        </span>
      </div>
      {modal && (
        <SignUp onClick={onClick} changeType={changeType} type={isSignUp} />
      )}
    </header>
  );
}

export default Header;
