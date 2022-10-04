import React, { useState, useEffect } from "react";
import "../styles/Song.scss";
import { instance } from "../instance/instance";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Header } from "../allFiles";
import {
  musicState,
  songState,
  isSelectedMusicState,
  disabledState,
  userState,
} from "../atom";
import Modal from "react-modal";
import ExpirationToken from "../function/ExpirationToken";
import axios, { AxiosError } from "axios";

function SongList({ item }) {
  const setSong = useSetRecoilState(songState);
  const setIsSelectedMusic = useSetRecoilState(isSelectedMusicState);
  const setDisabled = useSetRecoilState(disabledState);
  const selectSong = async () => {
    setSong(`${item.singer} - ${item.title}`);
    setIsSelectedMusic(true);
    setDisabled(false);
  };

  const [focusStyle, setFocusStyle] = useState("#FFF9F1");
  return (
    <div
      className="SongList-div"
      style={{ backgroundColor: focusStyle }}
      onMouseEnter={() => setFocusStyle("#F5EDE1")}
      onMouseLeave={() => setFocusStyle("#FFF9F1")}
      onClick={() => selectSong()}
    >
      <img
        src="./images/cover.png"
        alt={`${item.singer}의 ${item.title} 앨범 커버`}
      />
      <div className="text">
        <span className="item">{item.title}</span>
        <span className="item">{item.singer}</span>
      </div>
    </div>
  );
}

function Song() {
  const [song, setSong] = useRecoilState(songState);
  const [modal, setModal] = useState(false);
  const [music, setMusic] = useRecoilState(musicState);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [isSelectedMusic, setIsSelectedMusic] =
    useRecoilState(isSelectedMusicState);
  const [disabled, setDisabled] = useRecoilState(disabledState);
  const [focusIndex, setFocusIndex] = useState(-1);
  const [user, setUser] = useRecoilState(userState);

  useEffect(() => {
    if (isSelectedMusic) {
      setMusic([]);
    } else {
      search();
    }
    if (song === "") {
      setLoading(false);
      setMusic([]);
    }
  }, [song]);

  const onKeyDown = (e) => {
    if (e.keyCode === 40) {
      setFocusIndex((prev) => prev + 1);
    } else if (e.keyCode === 38) {
      setFocusIndex((prev) => prev - 1);
    } else if (e.keyCode === 13) {
      setSong(`${music[focusIndex].singer} - ${music[focusIndex].title}`);
      setIsSelectedMusic(true);
      setDisabled(false);
      setFocusIndex(-1);
    }

    if (focusIndex < -1) {
      setFocusIndex(-1);
    }
    if (focusIndex > music.length - 1 && e.keyCode === 38) {
      setFocusIndex(music.length - 1);
    }
  };

  const onChange = (e) => {
    setIsSelectedMusic(false);
    setSong(e.target.value);
  };

  const search = async () => {
    setMusic([]);
    setLoading(true);
    setSearchError("");
    const response = await getSongInfo();
    const songList = JSON.parse(response);
    if (songList.results.trackmatches.track.length === 0) {
      setSearched(false);
      setSearchError("검색 결과가 없습니다.");
      setDisabled(true);
    } else {
      setSearched(true);
      setSearchError("");
    }
    let newSongList = [];
    for (let i = 0; i < songList.results.trackmatches.track.length; i++) {
      newSongList = newSongList.concat({
        singer: songList.results.trackmatches.track[i].artist,
        title: songList.results.trackmatches.track[i].name,
      });
    }
    setMusic(newSongList);
    setLoading(false);
  };

  const getSongInfo = async () => {
    var axios = require("axios");
    var config = {
      method: "get",
      url: `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${song}&api_key=a7b431d3d0705a9bd1b0398f6f6cb0dd&format=json&limit=10`,
      headers: {},
    };

    let str = "";

    await axios(config)
      .then(function (response) {
        str = JSON.stringify(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });

    return str;
  };

  const requestSong = async () => {
    setModal(true);
    if (!song) {
      setSearchError("노래가 선택되지 않았습니다.");
    } else {
      try {
        setLoading(true);
        let newSong = song.split(" - ");
        await instance.post(
          "song",
          {
            title: newSong[1],
            singer: newSong[0],
            imgUrl: "추가예정",
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access-token")}`,
            },
          }
        );
        setSearchError("신청 완료!");
        const loginResponse = await instance.get("user/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access-token")}`,
          },
        });
        setUser(loginResponse.data);
      } catch (res) {
        if (res instanceof AxiosError && res.response) {
          console.log(res.response.data.message);
          setSearchError(res.response.data.message);
          ExpirationToken(res.response.data.message);
          console.log(res);
        }
      }
      setLoading(false);
    }
  };

  const postPlayList = async () => {
    setModal(true);
    setSearchError('');
    try {
      let newSong = song.split(" - ");
      const response = await instance.post(
        "playlist/",
        {
          title: newSong[1],
          singer: newSong[0],
          imgUrl: "추가예정",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access-token")}`,
          },
        }
      );
      console.log(response);
      setSearchError("추가완료!");
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.log(error);
        ExpirationToken(error.response.data.message);
        setSearchError(error.response.data.message);
      }
    }
  };

  return (
    <div>
      <Header />
      <div className="Song-div">
        <div className="Song-div main">
          <div className="modal-header song"></div>
          <div className="Song-div content">
            <input
              type="text"
              onChange={(e) => onChange(e)}
              value={song}
              className="Song-input"
              onKeyDown={(e) => onKeyDown(e)}
              placeholder="신청곡을 검색해보세요."
            />
            <br />
            {song === "" ? (
              <div className="nonSearch">
                <img src="./images/sun.png" alt="디자인" className="sun" />
                <span>검색어를 입력해주세요.</span>
              </div>
            ) : loading ? (
              <>
                <span>로딩중~</span>
                <img src="./images/loading.gif" alt="로딩중~" />
              </>
            ) : (
              searched && (
                <>
                  <div className="Song-List">
                    {music.map((item, index) => {
                      return <SongList item={item} key={index} />;
                    })}
                  </div>
                  <button
                    onClick={() => requestSong()}
                    disabled={disabled}
                    className="request-btn"
                  >
                    신청하기
                  </button>
                  <button
                    onClick={() => postPlayList()}
                    disabled={disabled}
                    className="request-btn"
                  >
                    플레이리스트 추가
                  </button>
                </>
              )
            )}
            {/* <span style={{ color: 'red' }}>{searchError}</span> */}
            <br />
          </div>
        </div>
      </div>
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
        {searchError && !loading && (
          <div className="song-modal">
            <img src="./images/logo.png" alt="로고" />
            <br />
            <span className="searchError">{searchError}</span>
          </div>
        )}
      </Modal>
    </div>
  );
}
export default Song;
