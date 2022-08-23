import React, { useState } from "react";
import "../styles/SignUp.css";

function SignUp(props) {
  const { onClick, changeType, type } = props;
  const [signUpInputs, setSignUpInputs] = useState({
    name: "",
    nickname: "",
    email: "",
    password: "",
  });
  const [loginInputs, setLoginInputs] = useState({
    email: "",
    password: "",
  });

  const changeTypeInModal = () => {
    changeType();
    type
      ? setSignUpInputs({
          name: "",
          nickname: "",
          email: "",
          password: "",
        })
      : setLoginInputs({
          email: "",
          password: "",
        });
  };

  const onChangeSignUp = (e) => {
    const { name, value } = e.target;
    const nextInputs = {
      ...signUpInputs,
      [name]: value,
    };
    setSignUpInputs(nextInputs);
  };

  const onChangeLogin = (e) => {
    const { name, value } = e.target;
    const nextInputs = {
      ...loginInputs,
      [name]: value,
    };
    setLoginInputs(nextInputs);
  };

  const signUp = () => {
    console.log(signUpInputs);
    onClick();
  };
  const Login = () => {
    console.log(loginInputs);
    onClick();
  };

  return (
    <div className="SignUp" onClick={onClick}>
      {type ? (
        <div className="modalContainer" onClick={(e) => e.stopPropagation()}>
          <h1 className="SignUp-title">회원가입</h1>
          <div>
            <input
              name="name"
              placeholder="이름"
              value={signUpInputs.name}
              onChange={(e) => onChangeSignUp(e)}
              className="SignUp-input"
            />
            <input
              name="nickname"
              placeholder="닉네임"
              value={signUpInputs.nickname}
              onChange={(e) => onChangeSignUp(e)}
              className="SignUp-input"
            />
            <input
              name="email"
              placeholder="이메일주소"
              value={signUpInputs.email}
              onChange={(e) => onChangeSignUp(e)}
              className="SignUp-input"
            />
            <input
              name="password"
              placeholder="비밀번호"
              value={signUpInputs.password}
              onChange={(e) => onChangeSignUp(e)}
              className="SignUp-input"
            />
          </div>
          <div>
            <button className="SignUp-button" onClick={() => signUp()}>
              가입하기
            </button>
            <button
              className="SignUp-button"
              onClick={() => changeTypeInModal()}
            >
              로그인
            </button>
          </div>
        </div>
      ) : (
        <div className="modalContainer" onClick={(e) => e.stopPropagation()}>
          <h1 className="Login-title">로그인</h1>
          <div>
            <input
              name="email"
              placeholder="이메일주소"
              value={loginInputs.email}
              onChange={(e) => onChangeLogin(e)}
              className="Login-input"
            />
            <input
              name="password"
              placeholder="비밀번호"
              value={loginInputs.password}
              onChange={(e) => onChangeLogin(e)}
              className="Login-input"
            />
          </div>
          <div>
            <button className="Login-button" onClick={() => Login()}>
              로그인
            </button>
            <button
              className="Login-button"
              onClick={() => changeTypeInModal()}
            >
              회원가입
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignUp;
