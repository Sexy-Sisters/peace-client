import React, { useRef, useState } from "react";
import axios from "axios";
import "../styles/SignUp.css";

function SignUp(props) {
  const instance = axios.create({
    baseURL: "http://10.150.151.125:8080/api",
  });
  const { onClick, changeType, type } = props;
  const inputRef = useRef([]);
  const checkEmail = useRef();
  const [signUpInputs, setSignUpInputs] = useState({
    name: "test1",
    nickName: "test1",
    email: "jsm8109jsm@gmail.com",
    password: "",
    confirmPassword: "",
  });
  const [loginInputs, setLoginInputs] = useState({
    email: "",
    password: "",
  });
  const [sendCode, setSendCode] = useState(true);
  const [issueCode, setIssueCode] = useState("");
  const [certification, setCertification] = useState("");

  const changeTypeInModal = () => {
    changeType();
    type
      ? setSignUpInputs({
          name: "",
          nickName: "",
          email: "",
          password: "",
          confirmPassword: "",
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
    setSignUpInputs({
      name: nextInputs.name,
      nickName: nextInputs.nickName,
      email: nextInputs.email,
      password: nextInputs.password,
    });
  };

  const onChangeLogin = (e) => {
    const { name, value } = e.target;
    const nextInputs = {
      ...loginInputs,
      [name]: value,
    };
    setLoginInputs({
      email: nextInputs.email,
      password: nextInputs.password,
    });
  };

  const signUp = () => {
    if (() => checkBlank()) {
      postSignUp();
      onClick();
    }
  };
  const Login = () => {
    console.log(loginInputs);
    onClick();
  };

  const postSignUp = async () => {
    try {
      setIssueCode(await instance.post("user", signUpInputs));
    } catch (e) {
      console.log(e.data);
    }
  };

  const checkBlank = () => {
    for (let i = 0; i < inputRef.current.length; i++) {
      if (inputRef.current[i].value === "") {
        console.log(inputRef.current[i].name + "을 입력하세요");
        inputRef.current[i].focus();
        return false;
      }
    }
    return true;
  };

  const sendIssueCode = async () => {
    setSendCode(false);
    try {
      await instance.get(`user/issue-code?email=${signUpInputs.email}`);
      console.log("인증보냄");
    } catch (error) {
      console.log(error);
    }
  };

  const sendCheckCode = async () => {
    try {
      (await instance.post(`user/check-code`, {
        code: issueCode,
        email: signUpInputs.email,
      })) && setCertification("인증 성공!");
    } catch (error) {
      console.log(error);
      alert("인증에 실패했습니다.");
      onClick();
    }
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
              ref={(el) => (inputRef.current[0] = el)}
            />
            <input
              name="nickName"
              placeholder="닉네임"
              value={signUpInputs.nickName}
              onChange={(e) => onChangeSignUp(e)}
              className="SignUp-input"
              ref={(el) => (inputRef.current[1] = el)}
            />
            <input
              name="email"
              type="email"
              placeholder="이메일주소"
              value={signUpInputs.email}
              onChange={(e) => onChangeSignUp(e)}
              className="SignUp-input email"
              ref={(el) => (inputRef.current[2] = el)}
            />
            <button className="sendCheckCode" onClick={() => sendIssueCode()}>
              인증받기
            </button>
            <input
              name="code"
              type="text"
              placeholder="인증번호 확인"
              className="SignUp-input email"
              ref={checkEmail}
              disabled={sendCode}
              value={issueCode}
              onChange={(e) => setIssueCode(e.target.value)}
            />
            <button className="sendCheckCode" onClick={() => sendCheckCode()}>
              확인하기
            </button>
            <br />
            <span className="certification">{certification}</span>
            <input
              name="password"
              type="password"
              placeholder="비밀번호"
              value={signUpInputs.password}
              onChange={(e) => onChangeSignUp(e)}
              className="SignUp-input"
              ref={(el) => (inputRef.current[3] = el)}
            />
            <input
              name="confirmPassword"
              type="password"
              placeholder="비밀번호 확인"
              value={signUpInputs.confirmPassword}
              onChange={(e) => onChangeSignUp(e)}
              className="SignUp-input"
              ref={(el) => (inputRef.current[4] = el)}
            />
          </div>
          <div>
            <button
              className="SignUp-button"
              onClick={() => changeTypeInModal()}
            >
              로그인
            </button>
            <button className="SignUp-button" onClick={() => signUp()}>
              가입하기
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
            <button
              className="Login-button"
              onClick={() => changeTypeInModal()}
            >
              회원가입
            </button>
            <button className="Login-button" onClick={() => Login()}>
              로그인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignUp;
