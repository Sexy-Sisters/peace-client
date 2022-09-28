import React, { useEffect, useState } from "react";
import Header from "./Header";
import "../styles/MyPage.css";
import { instance } from "../instance/instance";
import { Link, useNavigate } from "react-router-dom";
import { AiFillLike } from "react-icons/ai";
import { ImCross } from "react-icons/im";
import ExpirationToken from "../function/ExpirationToken";

function PlayList({ data, id, index }) {

  const deleteSong = async () => {
    try {
      const response = await instance.delete(`playlist/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access-token")}`,
        },
      })
      console.log(response);
    } catch (error) {
      console.log(error);
      ExpirationToken(error.response.data.message);
    }
  }

  return (
    <div className="ChartList-top">
      <div className="ChartList-root">
        <div className="ChartList-rank">
          <div>{index + 1}</div>
        </div>
        <div className="ChartList text">
          {/* <img src={data.imgUrl} alt="앨범커버" /> */}
          <img src="./images/cover.png" alt="앨범커버" />
          <div className="ChartList left">
            <span className="ChartList-name">{data.title}</span>
            <span className="ChartList-artist">{data.singer}</span>
            <ImCross onClick={() => deleteSong()} />
            {/* <span className="ChartList-artist">{hour - data.createdHour}</span> */}
          </div>
        </div>
      </div>
    </div>
  );
}

function MyPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSongExist, setIsSongExist] = useState(false);
  const [playlist, setPlayList] = useState([]);

  const [userInfo, setUserInfo] = useState({});
  useEffect(() => {
    if (localStorage.getItem("access-token")) {
      (async () => {
        try {
          setLoading(true);
          const response = await instance.get("user", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access-token")}`,
            },
          });
          setIsSongExist(response.data.requestedSong ? true : false);
          setUserInfo({
            ...response.data,
            img: "./images/cover.png",
          });
          const playListResponse = await instance.get(
            `playlist/${response.data.id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access-token")}`,
              },
            }
          );
          console.log(playListResponse);
          setPlayList(playListResponse.data);
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
  }, [isSongExist]);
  const { nickName, img, requestedSong, name } = userInfo;

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

  return (
    <>
      <Header />
      <div className="MyPage-div">
        <div className="MyPage-info">
          <img src={img} alt="프로필 사진" className="MyPage-img" />
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
        <div>
          <br /><br />
          <h1>내 플레이리스트</h1>
          {!loading ? (
            playlist ? (
              <div className="ChartList">
                {playlist.map((item, index) => {
                  return <PlayList data={item} key={item.id} id={item.id} index={index} />;
                })}
              </div>
            ) : (
              <div>
                <span>아직 플레이리스트가 없습니다!</span>
                <Link to={"/song"}>신청하러 가기</Link>
              </div>
            )
          ) : (
            <span>로딩중~~~</span>
          )}
        </div>
      </div>
    </>
  );
}
export default MyPage;
