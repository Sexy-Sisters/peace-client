import React, { useEffect, useState } from "react";
import Header from "./Header";
import "../styles/MyPage.css";
import { instance } from "../instance/instance";
import { Link, useNavigate } from "react-router-dom";
import { AiFillLike } from "react-icons/ai";
import { ImCross } from "react-icons/im";
import { MdOutlineChangeCircle } from "react-icons/md";
import ExpirationToken from "../function/ExpirationToken";
import styled from "styled-components";
import Modal from 'react-modal';
import { useRef } from "react";

const ImageSpan = styled.span`
  position: absolute;
  left: ${(props) => props.index * 20}px;
`;

const PlayListImages = ({ item, index }) => {
  return (
    <ImageSpan index={index}>
      <span className="imgdiv">
        <img src={item} alt="앨범커버" />
      </span>
    </ImageSpan>
  );
};

function MyPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSongExist, setIsSongExist] = useState(false);
  const [image, setImage] = useState(false);
  const [changingImg, setChangingImg] = useState(false);
  const [playlist, setPlayList] = useState([]);
  // const [newProfileImg, setNewProfileImg] = useState("");
  const selectFile = useRef("");
  const imgArr = [
    "/images/cover.png",
    "/images/cover.png",
    "/images/cover.png",
  ];

  const [userInfo, setUserInfo] = useState({});
  useEffect(() => {
    if (localStorage.getItem("user")) {
      (async () => {
        try {
          setLoading(true);
          setUserInfo(JSON.parse(localStorage.getItem("user")));
          if (JSON.parse(localStorage.getItem("user")).requestedSong) {
            setIsSongExist(true);
          }
        } catch (error) {
          console.log(error);
          ExpirationToken(error.response.data.message);
        }
      })();
      setLoading(false);
    } else {
      alert("로그인하세요!!!!!!!!!!!");
      nav("/");
    }
  }, [isSongExist, playlist]);
  const { nickName, profileImg, requestedSong, name } = userInfo;

  const profileImgFormData = new FormData();

  const deleteSong = async () => {
    try {
      setLoading(true);
      const response = await instance.delete(`song/${requestedSong.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access-token")}`,
        },
      });
      console.log(response);
      setIsSongExist(false);
    } catch (error) {
      console.log(error);
      ExpirationToken(error.response.data.message);
    }
    setLoading(false);
  };


  const changeProfileImg = async () => {
    try {
      await instance.put(
        "user/profile/img",
        profileImgFormData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access-token")}`,
            "Content-Type": "multipart/form-data; boundary=<calculated when request is sent>",
          },
        }
      );
      // console.log(response);
      const loginResponse = await instance.get("user/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access-token')}`,
        },
      });
      localStorage.setItem('user', JSON.stringify({
        ...loginResponse.data,
      }));
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const [modal, setModal] = useState(false);

  const changeImg = (e) => {
    console.log(e.target.files);
    profileImgFormData.append('image', e.target.files[0]);
    setImage(true);
  }

  return (
    <>
      <Header />
      <div className="MyPage-div">
        <div className="MyPage-info">
          <img src={profileImg} alt="프로필 사진" onClick={() => setModal(true)} className="MyPage-img" />
          {/* <MdOutlineChangeCircle size={40} onClick={() => setModal(true)} className="change" /> */}
          <button onClick={() => setModal(true)} className="changeBtn">
            <img src='/images/change.png' alt="프로필 사진" className="change" />
          </button>
        </div>
        <h2 className="MyPage-nickname">{name}</h2>
        <h3 className="MyPage-nickname">{nickName}</h3>
        <h1>오늘 신청곡</h1>
        {!loading ? (
          isSongExist ? (
            <div className="ChartList">
              <div className="ChartList-root">
                <div className="ChartList-div">
                  <img src="./images/cover.png" alt="앨범커버" />
                  <div className="ChartList-left">
                    <span className="ChartList-name">
                      {requestedSong.title}
                    </span>
                    <span className="ChartList-artist">
                      {requestedSong.singer}
                    </span>
                  </div>
                  <div className="ChartList-right">
                    <span>
                      <AiFillLike /> {requestedSong.numberOfUps}
                    </span>
                  </div>
                  <ImCross onClick={() => deleteSong()} />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <span>아직 신청곡이 없습니다!</span>
              <Link to={"/song"}>신청하러 가기</Link>
            </div>
          )
        ) : (
          <span>로딩중~~~</span>
        )}
        <br />
        <br />
        <h1>플레이리스트</h1>
        <button onClick={() => changeProfileImg()}>변경하기</button>

        <Link to={`/playlist/${localStorage.getItem("user") && JSON.parse(localStorage.getItem("user")).id}`}>
          <div>
            {imgArr.map((item, index) => {
              return <PlayListImages item={item} index={index} key={index} />;
            })}
          </div>
        </Link>
        <Modal isOpen={modal}
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
              backgroundColor: '#FFF9F1',
            },
          }}>
          <div className="modal-header"></div>
          <img src={profileImg} alt="프로필 사진" className="original-img" />
          <input
            type="file"
            style={{ display: "none" }}
            ref={selectFile} //input에 접근 하기위해 useRef사용
            onChange={(e) => changeImg(e)}
          />
          {/* <span>{newProfileImg[0].slice(12)}</span> */}
          <button onClick={() => selectFile.current.click()}>파일 업로드</button>
          <button onClick={() => changeProfileImg()} disabled={!image ? true : false}>프로필 사진 변경하기</button>
        </Modal>
      </div>
    </>
  );
}
export default MyPage;
