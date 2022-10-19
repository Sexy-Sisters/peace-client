import React, { useState, useEffect } from "react";
import "../styles/SignUp.scss";
import { AiOutlineCloseCircle, AiOutlineCheckCircle, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { instance } from '../instance/instance';
import { useRecoilState } from "recoil";
import { snackbarState } from "../atom";
import { useRef } from "react";
function SignUp({ type }) {
  const [snackbar, setSnackbar] = useRecoilState(snackbarState);
  const [correctPassword, setCorrectPassword] = useState(false);
  const [visible, setVisible] = useState(false);
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
  const [disabled, setDisabled] = useState(false);
  const [issueCode, setIssueCode] = useState("");
  const [certification, setCertification] = useState(false);
  const [loginResult, setLoginResult] = useState(0);
  const lastBtn = useRef(null);

  useEffect(() => {
    if (signUpInputs.confirmPassword !== "" && signUpInputs.password !== "" && (signUpInputs.confirmPassword === signUpInputs.password)) {
      setCorrectPassword(true);
    }
    else {
      setCorrectPassword(false);
    }
  }, [signUpInputs.confirmPassword, signUpInputs.password]);

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
    postSignUp();
    setSignUpStep(prev => prev + 1);
  };
  const Login = async () => {
    try {
      const response = await instance.post("auth", loginInputs);
      const { accessToken, refreshToken } = response.data;
      accessToken && localStorage.setItem('access-token', accessToken);
      refreshToken && localStorage.setItem('refresh-token', refreshToken);
      setLoginResult(1);
      console.log('로그인됨!');
    } catch (error) {
      console.log(error);
      setLoginResult(-1);
    }
  };

  const postSignUp = async () => {
    try {
      setIssueCode(await instance.post("user", signUpInputs));
      console.log("가입완료!");
    } catch (e) {
      console.log(e);
    }
  };

  // if(window.event.keyCode === 13){
  //   console.log('asdffads');
  // }


  const sendIssueCode = async () => {
    console.log(signUpInputs.email)
    if (/^20[0-9]{7}@bssm.hs.kr$/g.test(signUpInputs.email)) {
      setSendCode(false);
      try {
        await instance.post(`user/issue-code?email=${signUpInputs.email}`);
        setSnackbar({
          isOpen: true,
          message: '인증을 보냈습니다. 이메일을 확인하세요.',
          severity: 'success'
        })
      } catch (error) {
        console.log(error);
      }
    }
    else {
      setSnackbar({
        isOpen: true,
        severity: 'error',
        message: '학교 이메일 계정만 사용 가능합니다.'
      })
    };
  };

  const sendCheckCode = async () => {
    try {
      const requestObj = {
        code: issueCode,
        email: signUpInputs.email,
      }
      await instance.delete(`user/check-code`, { data: requestObj });
      setCertification(true);
      setSnackbar({
        isOpen: true,
        message: '인증완료!',
        severity: 'success'
      })
    } catch (error) {
      console.log(error);
      setSnackbar({
        isOpen: true,
        message: '인증에 실패했습니다.',
        severity: 'error'
      })
      setSignUpInputs({
        ...signUpInputs,
        email: '',
      })
      setIssueCode('');
    }
  }
  useEffect(() => {
    const { name, nickName, password, confirmPassword } = signUpInputs;
    if ((signUpStep === 2 && !certification) || (type && (name === "" || nickName === "")) || (signUpStep === 3 && (password === "" || confirmPassword === "")) || (!type && (!/^20[0-9]{7}@bssm.hs.kr$/g.test(loginInputs.email) || loginInputs.password === ""))) {
      setDisabled(true);
    }
    else {
      setDisabled(false);
    }
  }, [certification, loginInputs.email, loginInputs.password, signUpInputs, signUpStep, type]);

  const reLogin = () => {
    setLoginResult(0);
    setLoginInputs({
      email: "",
      password: "",
    });
  }

  useEffect(() => {
    console.log(lastBtn.current);
    lastBtn.current && lastBtn?.current.focus();
  }, [loginResult]);

  return (
    <div className="SignUp">
      {type ? (
        //회원가입
        <>
          {signUpStep !== 4 && <h1 className="SignUp-title">SIGN UP</h1>}
          <div className="SignUp-input-div">
            {signUpStep === 1 ? <><input
              name="name"
              placeholder="이름"
              value={signUpInputs.name}
              onChange={(e) => onChangeSignUp(e)}
              className="SignUp-input"
              onKeyPress={(e) => { if (e.key === 'Enter' && !disabled) setSignUpStep(prev => prev + 1); }}
            />
              <input
                name="nickName"
                placeholder="닉네임"
                value={signUpInputs.nickName}
                onChange={(e) => onChangeSignUp(e)}
                className="SignUp-input"
                onKeyPress={(e) => { if (e.key === 'Enter' && !disabled) setSignUpStep(prev => prev + 1) }}
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
                    onKeyPress={(e) => { if (e.key === 'Enter' && !disabled) signUp() }}
                  />
                  <div className="confirm">
                    <input
                      name="confirmPassword"
                      type="password"
                      placeholder="비밀번호 확인"
                      value={signUpInputs.confirmPassword}
                      onChange={(e) => onChangeSignUp(e)}
                      className="SignUp-input confirmPassword"
                      onKeyPress={(e) => { if (e.key === 'Enter' && !disabled) signUp() }}
                    />
                    {correctPassword ? <AiOutlineCheckCircle className="icon" size={24} /> : <AiOutlineCloseCircle className="icon" size={24} />}
                  </div>
                </>
                  : <><img src="/images/logo.png" alt="로고" /><span className="message">회원가입 되었습니다.<br />
                    로그인해주세요!</span></>))}
          </div>
          {signUpStep !== 4 && <div className="step-div">
            <span style={{ backgroundColor: signUpStep >= 1 ? '#7895B2' : '#E3E9EF' }} className='step'></span>
            <span style={{ backgroundColor: signUpStep >= 2 ? '#7895B2' : '#E3E9EF' }} className='step'></span>
            <span style={{ backgroundColor: signUpStep >= 3 ? '#7895B2' : '#E3E9EF' }} className='step'></span>
          </div>}
          <div className="next">
            {signUpStep === 3 ? <button className="SignUp-button" onClick={() => signUp()} disabled={disabled}>
              회원가입
            </button> : (signUpStep !== 4 && <button className="SignUp-button" onClick={() => {
              if (signUpStep === 1 && !/^[가-힣]{2,4}$/.test(signUpInputs.name)) {
                setSnackbar({
                  isOpen: true,
                  severity: 'error',
                  message: '반드시 본명을 입력해주세요!'
                })
                setSignUpInputs({
                  ...signUpInputs,
                  name: '',
                })
              }
              else {
                setSignUpStep(prev => prev + 1);
              }
            }} disabled={disabled}>
              NEXT
            </button>)}
          </div>
        </>
      ) : (
        //로그인
        (loginResult === 1 ? <div className="loginResult">
          <img src="/images/logo.png" alt="로고" />
          <span>로그인 완료! (´ฅω•ฅ｀)</span>
          <span>평화로운 아침을 만들어보세요.</span>
          <button className="SignUp-button result" onClick={() => window.location.reload()}
            onKeyPress={(e) => { if (e.key === 'Enter') window.location.reload() }} ref={lastBtn}>확인</button>
        </div> : loginResult === -1 ? <div className="loginResult">
          <img src="/images/logo.png" alt="로고" />
          <span>로그인 실패 ｡°(´∩ω∩`)°｡</span>
          <span>이메일이나 비밀번호를 확인해주세요.</span>
          <button className="SignUp-button result re" onClick={() => reLogin()}
            onKeyPress={(e) => { if (e.key === 'Enter') window.location.reload() }} ref={lastBtn}>다시 로그인하기</button>
        </div> : (<div className="SignUp-modalContainer" onClick={(e) => e.stopPropagation()}>
          <h1 className="SignUp-title">LOGIN</h1>
          <div className="SignUp-input-div">
            <input
              name="email"
              type="email"
              placeholder="이메일주소"
              value={loginInputs.email}
              onChange={(e) => onChangeLogin(e)}
              className="SignUp-input"
              onKeyPress={(e) => { if (e.key === 'Enter') Login() }}
            />
            <div className="confirm">
              <input
                name="password"
                type={visible ? "text" : "password"}
                placeholder="비밀번호"
                value={loginInputs.password}
                onChange={(e) => onChangeLogin(e)}
                className="SignUp-input"
                onKeyPress={(e) => { if (e.key === 'Enter') Login() }}
              />
              {visible ? <AiOutlineEye className="icon button" size={24} onClick={() => setVisible(prev => !prev)} /> : <AiOutlineEyeInvisible className="icon button" size={24} onClick={() => setVisible(prev => !prev)} />}
            </div>
          </div>
          <div className="next">
            <button className="SignUp-button login" onClick={() => Login()} disabled={disabled}>
              로그인
            </button>
          </div>
        </div>))
      )
      }
    </div >
  );
}

export default SignUp;