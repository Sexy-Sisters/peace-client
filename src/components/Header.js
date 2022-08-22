import React, { useState } from "react";
import "../styles/Header.css";
import SignUp from "./SignUp";

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
    <div className="Header">
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
      {/* {signUp && <SignUp onClick={onClickSignUp} />}
      {login && <Login onClick={onClickLogin} />} */}
      {modal && (
        <SignUp onClick={onClick} changeType={changeType} type={isSignUp} />
      )}
    </div>
  );
}

export default Header;
