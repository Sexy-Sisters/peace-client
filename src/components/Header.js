import React, { useState } from "react";
import "../styles/Header.css";
import SignUp from "./SignUp";

function Header() {
  const [signUp, setSignUp] = useState(false);
  const onClick = () => {
    setSignUp((prev) => !prev);
  };
  return (
    <div className="Header">
      <span
        onClick={() => {
          setSignUp(true);
        }}
      >
        회원가입
      </span>
      {signUp && <SignUp onClick={onClick} />}
    </div>
  );
}

export default Header;
