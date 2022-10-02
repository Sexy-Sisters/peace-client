import React from 'react'
import Header from './Header.tsx'
import '../styles/PlayList.scss';
import { ImMusic, ImCross } from 'react-icons/im';
import { instance } from '../instance/instance';
import ExpirationToken from '../function/ExpirationToken';
import { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";

function PlayListList({ data, id, index }) {

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
    <div className="ChartList-root">
      <div className="ChartList-rank">
        <div>{index + 1}</div>
      </div>
      <div className="ChartList text">
        <img src="/images/cover.png" alt="앨범커버" />
        <div className="ChartList left">
          <span className="ChartList-name">{data.title}</span>
          <span className="ChartList-artist">{data.singer}</span>
          <ImCross onClick={() => deleteSong()} />
        </div>
      </div>
    </div>
  );
}

function PlayList() {
  const [loading, setLoading] = useState(false);
  const [playlist, setPlayList] = useState([]);

  const param = useParams();

  useEffect(() => {
    const getPlayList = async () => {
      try {
        setLoading(true);
        const playListResponse = await instance.get(
          `playlist/${param.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access-token")}`,
            },
          }
        );
        setPlayList(playListResponse.data);
        console.log(playListResponse);
      } catch (error) {
        console.log(error);
        ExpirationToken(error.response.data.message);
      }
    }
    getPlayList();
    setLoading(false);
  }, []);

  return (
    <>
      <Header />
      <div className='PlayList'>
        <div className="Chart-title">
          <ImMusic className="title-icon" size={60} />
          <div className="title-vertical"></div>
          <h1 className="title">PLAYLIST</h1>
        </div>
      </div>
      <div>
        {!loading ? (
          playlist ? (
            <div className="ChartList">
              {playlist.map((item, index) => {
                return <PlayListList data={item} key={item.id} id={item.id} index={index} />;
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
  )
}

export default PlayList