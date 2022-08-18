import React, { useState } from "react";
import "../styles/SignUp.css";

function SignUp(props) {
  const { onClick } = props;
  console.log("asdf");
  const [inputs, setInputs] = useState({
    name: "",
    nickname: "",
    email: "",
    password: "",
  });
  const { name, nickname, email, password } = inputs;
  const onChange = (e) => {
    const { name, value } = e.target;
    const nextInputs = {
      ...inputs,
      [name]: value,
    };
    setInputs(nextInputs);
  };
  const signUp = () => {
    console.log(inputs);
  };
  return (
    <div className="SignUp" onClick={onClick}>
      <div className="modalContainer" onClick={(e) => e.stopPropagation()}>
        <h1 className="SignUp-title">회원가입</h1>
        <div>
          <input
            name="name"
            placeholder="이름"
            value={name}
            onChange={(e) => onChange(e)}
            className="SignUp-input"
          />
          <input
            name="nickname"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => onChange(e)}
            className="SignUp-input"
          />
          <input
            name="email"
            placeholder="이메일주소"
            value={email}
            onChange={(e) => onChange(e)}
            className="SignUp-input"
          />
          <input
            name="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => onChange(e)}
            className="SignUp-input"
          />
        </div>
        <div>
          <button className="SignUp-button" onClick={() => signUp()}>
            가입하기
          </button>
          <button className="SignUp-button">로그인</button>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
