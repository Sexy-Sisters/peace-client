import React, { useEffect, useState } from "react";
import "../styles/Header.scss";
import Modal from "react-modal";
import { FiMenu } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { SignUp } from "../allFiles";

function Header() {
  const [dropdown, setDropdown] = useState(false);
  const [modal, setModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const size1050 = useMediaQuery({
    query: "(min-width: 1350px)",
  });
  const logout = () => {
    localStorage.removeItem("access-token");
    localStorage.removeItem("refresh-token");
    localStorage.removeItem("user");
    console.log("로그아웃됨!");
    window.location.reload();
  };
  return (
    <header>
      {size1050 ? (
        <>
          <Link to="/" style={{ textDecoration: "none" }}>
            <img src="/images/logo.png" alt="로고" />
          </Link>
          <div className="Header list">
            <Link to="/song">
              <span className="Header English">SEARCH SONG</span>
            </Link>
            <Link to="/chart">
              <span>
                <span className="Header English">BSSM CHART</span>
              </span>
            </Link>
            <Link to={"/userlist"}>
              <span className="Header English">PLAYLIST</span>
            </Link>
            <a href="https://github.com/Wake-Up-Song/Server/issues">
              <span className="Header English">FEEDBACK</span>
            </a>
          </div>
          {localStorage.getItem("access-token") ? (
            <div className="Header signup">
              <Link to={"/mypage"} className="Header btn">
                <span>PROFILE</span>
              </Link>
              <span onClick={logout} className="Header btn">
                LOGOUT
              </span>
            </div>
          ) : (
            <div className="Header signup">
              <span
                onClick={() => {
                  setIsSignUp(true);
                  setModal(true);
                }}
                className="Header btn"
              >
                SIGN UP
              </span>
              <span
                onClick={() => {
                  setIsSignUp(false);
                  setModal(true);
                }}
                className="Header btn"
              >
                LOGIN
              </span>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="smallSize">
            <Link to="/" style={{ textDecoration: "none" }}>
              <img src="/images/logo.png" alt="로고" />
            </Link>
            <FiMenu size={32} onClick={() => setDropdown((prev) => !prev)} />
          </div>
          {dropdown && (
            <div className="dropdown">
              <Link to="/song" className="dropdown-item">
                <span className="Header English">SEARCH SONG</span>
              </Link>
              <Link to="/chart" className="dropdown-item">
                <span className="Header English">BSSM CHART</span>
              </Link>
              <Link to={"/userlist"} className="dropdown-item">
                <span className="Header English">PLAYLIST</span>
              </Link>
              <a
                href="https://github.com/Wake-Up-Song/Server/issues"
                className="dropdown-item"
              >
              <span className="Header English">FEEDBACK</span>
              </a>
              {!localStorage.getItem("access-token") ? (
                <>
                  <span
                    onClick={() => {
                      setIsSignUp(true);
                      setModal(true);
                    }}
                    className="dropdown-item English"
                    style={{ cursor: "pointer" }}
                  >
                    SIGN UP
                  </span>
                  <span
                    onClick={() => {
                      setIsSignUp(false);
                      setModal(true);
                    }}
                    className="dropdown-item English"
                    style={{ cursor: "pointer" }}
                  >
                    LOGIN
                  </span>
                </>
              ) : (
                <>
                  <Link to={"/mypage"} className="dropdown-item English">
                    <span>PROFILE</span>
                  </Link>
                  <span
                    onClick={logout}
                    className="dropdown-item English"
                    style={{ cursor: "pointer" }}
                  >
                    LOGOUT
                  </span>
                </>
              )}
            </div>
          )}
        </>
      )}
      <Modal
        isOpen={modal}
        onRequestClose={() => setModal(false)}
        style={{
          overlay: {
            backgroundColor: "rgba(134, 134, 134, 0.2)",
            zIndex: 100,
          },
          content: {
            width: "700px",
            height: "500px",
            margin: "auto",
            borderRadius: "20px",
            padding: 0,
            overflowX: "hidden",
            backgroundColor: "#FFF9F1",
          },
        }}
      >
        <div className="modal-header"></div>
        <SignUp type={isSignUp} />
      </Modal>
    </header>
  );
}

export default Header;
