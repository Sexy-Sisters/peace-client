import React, { useRef, useState, useEffect } from "react";
import "../styles/SignUp.scss";
import { AiOutlineCloseCircle, AiOutlineCheckCircle } from 'react-icons/ai';
import { instance } from '../instance/instance';
function SignUp(props) {
  const { onClick, changeType, type } = props;
  const inputRef = useRef([]);
  const checkEmail = useRef();
  const [correctPassword, setCorrectPassword] = useState(false);
  const [signUpInputs, setSignUpInputs] = useState({
    name: "",
    nickName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loginInputs, setLoginInputs] = useState({
    email: "",
    password: "",
  });
  const [signUpStep, setSignUpStep] = useState(1);
  const [sendCode, setSendCode] = useState(true);
  const [issueCode, setIssueCode] = useState("");
  const [certification, setCertification] = useState("　");
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
        password: ""
      });
  };

  useEffect(() => {
    if (signUpInputs.confirmPassword !== "" && signUpInputs.password !== "" && (signUpInputs.confirmPassword === signUpInputs.password)) {
      setCorrectPassword(true);
    }
  }, [signUpInputs.confirmPassword]);

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
      confirmPassword: nextInputs.confirmPassword,
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
    // if (() => checkBlank()) {
    postSignUp();
    setSignUpStep(prev => prev + 1);
    // }
  };
  const Login = async () => {
    try {
      const response = await instance.post("auth", loginInputs);
      const { accessToken, refreshToken } = response.data;
      accessToken && localStorage.setItem('access-token', accessToken);
      refreshToken && localStorage.setItem('refresh-token', refreshToken);
      console.log('로그인됨!');
    } catch (error) {
      console.log(error);
    }
    onClick();
  };

  const postSignUp = async () => {
    try {
      setIssueCode(await instance.post("user", signUpInputs));
      console.log("가입완료!");
    } catch (e) {
      console.log(e);
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
      await instance.post(`user/issue-code?email=${signUpInputs.email}`);
      console.log("인증보냄");
    } catch (error) {
      console.log(error);
    }
  };

  const sendCheckCode = async () => {
    try {
      (await instance.delete(`user/check-code`, {
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
        //회원가입
        <div className="modalContainer" onClick={(e) => e.stopPropagation()}>
          <h1 className="SignUp-title">SIGN UP</h1>
          <div className="SignUp-input-div">
            {signUpStep === 1 ? <><input
              name="name"
              placeholder="이름"
              value={signUpInputs.name}
              onChange={(e) => onChangeSignUp(e)}
              className="SignUp-input"
              ref={(el) => (inputRef.current[0] = el)}
              onKeyPress={(e) => { if (e.key === 'Enter') setSignUpStep(prev => prev + 1) }}
            />
              <input
                name="nickName"
                placeholder="닉네임"
                value={signUpInputs.nickName}
                onChange={(e) => onChangeSignUp(e)}
                className="SignUp-input"
                ref={(el) => (inputRef.current[1] = el)}
                onKeyPress={(e) => { if (e.key === 'Enter') setSignUpStep(prev => prev + 1) }}
              /></> : (
              signUpStep === 2 ?
                <>
                  <div className="email-div">
                    <input
                      name="email"
                      type="email"
                      placeholder="이메일주소"
                      value={signUpInputs.email}
                      onChange={(e) => onChangeSignUp(e)}
                      className="SignUp-input email"
                      ref={(el) => (inputRef.current[2] = el)}
                      onKeyPress={(e) => { if (e.key === 'Enter') sendIssueCode() }}
                    />
                    <button className="sendCheckCode" onClick={() => sendIssueCode()}>
                      인증
                    </button>
                  </div>
                  <div className="email-div">
                    <input
                      name="code"
                      type="text"
                      placeholder="인증번호 확인"
                      className="SignUp-input email"
                      ref={checkEmail}
                      disabled={sendCode}
                      value={issueCode}
                      onChange={(e) => setIssueCode(e.target.value)}
                      onKeyPress={(e) => { if (e.key === 'Enter') sendCheckCode() }}
                    />
                    <button className="sendCheckCode" onClick={() => sendCheckCode()}>
                      확인
                    </button>
                  </div>
                  {/* <span className="certification">{certification}</span> */}
                </> : (signUpStep === 3 ? <>
                  <input
                    name="password"
                    type="password"
                    placeholder="비밀번호"
                    value={signUpInputs.password}
                    onChange={(e) => onChangeSignUp(e)}
                    className="SignUp-input"
                    ref={(el) => (inputRef.current[3] = el)}
                    onKeyPress={(e) => { if (e.key === 'Enter') signUp() }}
                  />
                  <span className="confirm">
                    <input
                      name="confirmPassword"
                      type="password"
                      placeholder="비밀번호 확인"
                      value={signUpInputs.confirmPassword}
                      onChange={(e) => onChangeSignUp(e)}
                      className="SignUp-input confirmPassword"
                      ref={(el) => (inputRef.current[4] = el)}
                      onKeyPress={(e) => { if (e.key === 'Enter') signUp() }}
                    />
                    {correctPassword ? <AiOutlineCheckCircle className="icon" size={24} /> : <AiOutlineCloseCircle className="icon" size={24} />}
                  </span>
                </>
                  : <><img src="./images/logo.png" alt="로고" /><span className="message">회원가입 되었습니다.<br />
                    로그인해주세요!</span></>))}
          </div>
          {signUpStep !== 4 && <div className="step-div">
            <span style={{ backgroundColor: signUpStep >= 1 ? '#7895B2' : '#E3E9EF' }} className='step'></span>
            <span style={{ backgroundColor: signUpStep >= 2 ? '#7895B2' : '#E3E9EF' }} className='step'></span>
            <span style={{ backgroundColor: signUpStep >= 3 ? '#7895B2' : '#E3E9EF' }} className='step'></span>
          </div>}
          <div className="next">
            {signUpStep === 3 ? <button className="SignUp-button" onClick={() => signUp()}>
              회원가입
            </button> : (signUpStep !== 4 && <button className="SignUp-button" onClick={() => setSignUpStep(prev => prev + 1)}>
              NEXT
            </button>)}
          </div>
        </div>
      ) : (
        //로그인
        <div className="Login-modalContainer" onClick={(e) => e.stopPropagation()}>
          <h1 className="Login-title">로그인</h1>
          <div className="Login-input-div">
            <input
              name="email"
              type="email"
              placeholder="이메일주소"
              value={loginInputs.email}
              onChange={(e) => onChangeLogin(e)}
              className="Login-input"
              onKeyPress={(e) => { if (e.key === 'Enter') Login() }}
            />
            <input
              name="password"
              type="password"
              placeholder="비밀번호"
              value={loginInputs.password}
              onChange={(e) => onChangeLogin(e)}
              className="Login-input"
              onKeyPress={(e) => { if (e.key === 'Enter') Login() }}
            />
          </div>
          <div>
            <button
              className="Login-button first"
              onClick={() => changeTypeInModal()}
            >
              회원가입
            </button>
            <button className="Login-button second" onClick={() => Login()}>
              로그인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignUp;