import React, { useEffect, useState } from "react";
import { Header } from "../allFiles";
import "../styles/MyPage.scss";
import { instance } from "../instance/instance";
import { Link, useNavigate } from "react-router-dom";
import { AiFillLike } from "react-icons/ai";
import { ImCross } from "react-icons/im";
import ExpirationToken from "../function/ExpirationToken";
import styled from "styled-components";
import Modal from "react-modal";
import { useRef } from "react";
import { useRecoilState } from "recoil";
import { userState } from "../atom";

const ImageSpan = styled.span`
  position: absolute;
  left: ${(props) => (props.index * 50) + 40}px;
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
  const [image, setImage] = useState(false);
  const [user, setUser] = useRecoilState(userState);
  const [newProfileImg, setNewProfileImg] = useState([]);
  const selectFile = useRef(null);
  const [imgArr, setImgArr] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem("access-token")) {
      alert("로그인하세요!!!!!!!!!!!");
      nav("/");
    }
    else {
      const getPlayList = async () => {
        try {
          const response = await instance.get(`/playlist/${user?.id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access-token")}`,
            },
          });
          let newImgArr = [];
          console.log(response);
          response.data.forEach(element => {
            newImgArr = [...newImgArr, element.imgUrl];
          });
          setImgArr(newImgArr);
        } catch (error) {
          console.log(error);
          ExpirationToken(error.response.data.message, getPlayList);
        }
      }
      getPlayList();
    }
  }, [user]);
  const { nickName, profileImg, requestedSong, name, email } = user;

  const profileImgFormData = new FormData();

  const deleteSong = async () => {
    try {
      setLoading(true);
      const response = await instance.delete(`song/${requestedSong?.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access-token")}`,
        },
      });
      console.log(response);
      setUser({
        ...user,
        requestedSong: null,
      });
    } catch (error) {
      console.log(error);
      ExpirationToken(error.response.data.message, deleteSong);
    }
    setLoading(false);
  };

  const changeProfileImg = async () => {
    try {
      profileImgFormData.append("image", newProfileImg[0]);
      const response = await instance.put(
        "user/profile/img",
        profileImgFormData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access-token")}`,
            "Content-Type":
              "multipart/form-data; boundary=<calculated when request is sent>",
          },
        }
      );
      console.log(response);
      setUser({
        ...user,
        profileImg: response.data,
      });
    } catch (error) {
      console.log(error);
      ExpirationToken(error.response.data.message, changeProfileImg);
    }
  };
  
  const [modal, setModal] = useState(false);

  const changeImg = (e) => {
    setNewProfileImg(e.target.files);
    setImage(true);
  }

  return (
    <>
      <Header />
      {name && <div className="MyPage-div">
        <div className="MyPage-top">
          <div>
            <div className="MyPage-imgdiv">
              <img src={profileImg} alt="프로필 사진" onClick={() => setModal(true)} className="MyPage-img" />
              {/* <MdOutlineChangeCircle size={40} onClick={() => setModal(true)} className="change" /> */}
              <button onClick={() => setModal(true)} className="changeBtn">
                <img src='/images/change.png' alt="프로필 사진" className="change" />
              </button>
            </div>
            <div className="MyPage-info">
              <div>
                <span className="MyPage nickname">{nickName}</span>
                <span className="MyPage name">{name}</span>
                <button className="MyPage btn">수정</button>
              </div>
              <span className="MyPage email">{email}</span>
            </div>
          </div>
          <div className="MyPage-song">
            <div>
              <h1>오늘 신청곡</h1>
              {!loading ? (
                requestedSong?.title ? (
                  <div className="MyPageSong">
                    <img src={requestedSong.imgUrl} alt="앨범커버" />
                    <div className="MyPageSong-left">
                      <span className="MyPageSong-name">
                        {requestedSong.title}
                      </span>
                      <span className="MyPageSong-artist">
                        {requestedSong.singer}
                      </span>
                    </div>
                    <div className="MyPageSong-right">
                      <AiFillLike size={32} />
                      <span>{requestedSong.numberOfUps}</span>
                    </div>
                    <ImCross onClick={() => deleteSong()} cursor="pointer" size={32} />
                  </div>
                ) : (
                  <Link to="/song">
                    <div className="MyPageSong nonRequest">
                      <span>아직 신청곡이 없습니다!</span>
                      <span>클릭하여 신청</span>
                    </div>
                  </Link>
                )
              ) : (
                <span>로딩중~~~</span>
              )}
            </div>
            <div className="MyPage-playlist">
              <h1>플레이리스트</h1>
              <Link to={`/playlist/${user.id}`}>
                <div className="MyPage-playlist-img">
                  {imgArr && imgArr.map((item, index) => {
                    return <PlayListImages item={item} index={index} key={index} />;
                  })}
                </div>
              </Link>
            </div>
          </div>
        </div>
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
            accept="image/*"
          />
          <span>{selectFile.current?.value.slice(12)}</span>
          <button onClick={() => selectFile.current.click()}>파일 업로드</button>
          <button onClick={() => changeProfileImg()} disabled={!image ? true : false}>프로필 사진 변경하기</button>
        </Modal>
      </div>}
    </>
  );
}
export default MyPage;
