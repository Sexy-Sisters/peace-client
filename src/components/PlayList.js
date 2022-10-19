import React from "react";
import "../styles/PlayList.scss";
import { ImMusic, ImCross } from "react-icons/im";
import { instance } from "../instance/instance";
import ExpirationToken from "../function/ExpirationToken";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Header } from "../allFiles";
import { useRecoilState } from "recoil";
import { userState } from "../atom";

function PlayListList({ data, index, size, userId, setRender }) {
  const [user, setUser] = useRecoilState(userState);
  const deleteSong = async () => {
    try {
      const response = await instance.delete(`playlist/${data.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access-token")}`,
        },
      });
      console.log(response);
      setRender(prev => !prev);
    } catch (error) {
      console.log(error);
      ExpirationToken(error.response.data.message, deleteSong);
    }
  };

  return (
    <>
      <div className="ChartList-playlist">
        <div className="ChartList-rank">
          <div>{index + 1}</div>
        </div>
        <div className="ChartList text">
          <img src={data.imgUrl} alt="앨범커버" />
          <div className="ChartList left">
            <span className="ChartList-name">{data.title}</span>
            <span className="ChartList-artist">{data.singer}</span>
          </div>
          {user.id === parseInt(userId) && <div className="ChartList-playlist-right">
            <ImCross onClick={() => deleteSong()} style={{ cursor: "pointer" }} />
          </div>}
        </div>
      </div>
      {index !== size - 1 && <hr />}
    </>
  );
}

function PlayList() {
  const [loading, setLoading] = useState(false);
  const [playlist, setPlayList] = useState([]);
  const [render, setRender] = useState(false);

  const param = useParams();

  useEffect(() => {
    if (localStorage.getItem('access-token')) {
      const getPlayList = async () => {
        try {
          setLoading(true);
          const playListResponse = await instance.get(`playlist/${param.id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access-token")}`,
            },
          });
          setPlayList(playListResponse.data);
          console.log(playListResponse);
        } catch (error) {
          console.log(error);
          ExpirationToken(error.response.data.message, getPlayList);
        }
        setLoading(false);
      };
      getPlayList();
    }
  }, [param.id, render]);

  return (
    <>
      <Header />
      <div className="PlayList">
        <div className="Chart-title">
          <ImMusic className="title-icon" size={60} />
          <div className="title-vertical"></div>
          <h1 className="title">PLAYLIST</h1>
        </div>
      </div>
      <div className="ChartList-playlist-root">
        {!loading ? (
          playlist ? (
            <div className="ChartList">
              {playlist.map((item, index) => {
                return (
                  <PlayListList
                    data={item}
                    key={item.id}
                    userId={param.id}
                    index={index}
                    size={playlist.length}
                    setRender={setRender}
                  />
                );
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
      
    </>
  );
}

export default PlayList;
