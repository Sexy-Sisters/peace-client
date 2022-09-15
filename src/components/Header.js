import React, { useEffect, useState } from "react";
import "../styles/Header.css";
import SignUp from "./SignUp";
import { Link } from "react-router-dom";
import { instance } from "../instance/instance";

function Header() {
  const [modal, setModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [nickname, setNickname] = useState("");
  const onClick = () => {
    setModal((prev) => !prev);
  };
  const changeType = () => {
    setIsSignUp((prev) => !prev);
  };
  const logout = () => {
    localStorage.removeItem('access-token');
    localStorage.removeItem('refresh-token');
    console.log('로그아웃됨!');
    window.location.reload();
  }
  // console.log(localStorage.getItem('access-token'));
  useEffect(() => {
    if (localStorage.getItem('access-token')) {
      (async () => {
        try {
          const response = await instance.get('auth', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('access-token')}`
            }
          });
          console.log(response);
          setNickname(response.data);
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [localStorage.getItem('access-token')]);
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
      {localStorage.getItem('access-token') ?
        <div className="Header-signup">
          <Link to={"/mypage"} className="Header-btn">
            <span>{nickname}</span>
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
      }
      {modal && (
        <SignUp onClick={onClick} changeType={changeType} type={isSignUp} />
      )}
    </header>
  );
}

export default Header;
