import React, { useState, useEffect } from "react";
import "../styles/Song.scss";
import { instance } from "../instance/instance";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Header } from "../allFiles";
import { HiOutlineSearch } from 'react-icons/hi';
import {
  musicState,
  songState,
  isSelectedMusicState,
  disabledState,
  userState,
  snackbarState,
} from "../atom";
import Modal from "react-modal";
import ExpirationToken from "../function/ExpirationToken";

function SongList({ item, setRequest }) {
  const setSong = useSetRecoilState(songState);
  const setIsSelectedMusic = useSetRecoilState(isSelectedMusicState);
  const setDisabled = useSetRecoilState(disabledState);
  const selectSong = async () => {
    setSong(`${item.singer} - ${item.title}`);
    setRequest(item);
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
        src={item.imgUrl}
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
  const [snackbar, setSnackbar] = useRecoilState(snackbarState);
  const [request, setRequest] = useState({});

  useEffect(() => {
    if (isSelectedMusic) {
      setMusic([]);
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
    if (localStorage.getItem('access-token')) {

      try {
        setMusic([]);
        setLoading(true);
        setSearchError("");
        const response = await instance.get(`song/search?word=${song}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access-token")}`,
          },
        });
        const songList = response.data;
        // for (let i = 0; i < songList.length; i++) {
        //   if (songList[i].title.includes('19금')) {
        //     songList[i].title = songList[i].title.substr(6, songList[i].title.length);
        //   }
        // }

        if (songList[0].title === '') {
          setSearched(false);
          setSearchError("검색 결과가 없습니다.");
          setDisabled(true);
        } else {
          setSearched(true);
          setSearchError("");
        }
        setMusic(songList);
      } catch (error) {
        console.log(error);
        ExpirationToken(error.response.data.message, search, setSnackbar);
      }
      setLoading(false);
    }
  };

  const requestSong = async () => {
    setModal(true);
    if (!song) {
      // setSearchError("노래가 선택되지 않았습니다.");
      setSnackbar({
        isOpen: true,
        message: '노래가 선택되지 않았습니다.',
        severity: 'error'
      })
    } else {
      try {
        setLoading(true);
        await instance.post("song", request,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access-token")}`,
            },
          }
        );
        // setSearchError("신청 완료!");
        const loginResponse = await instance.get("user/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access-token")}`,
          },
        });
        setUser(loginResponse.data);
        setSong('');
        setSearched(false);
        setSnackbar({
          isOpen: true,
          message: '추가 완료!',
          severity: 'success'
        })
      } catch (res) {
        console.log(res.response.data.message);
        // setSearchError(res.response.data.message, requestSong);
        ExpirationToken(res.response.data.message, requestSong, setSnackbar);
        console.log(res);
      }
      setLoading(false);
    }
  };

  const postPlayList = async () => {
    setModal(true);
    setSearchError('');
    try {
      await instance.post(
        "playlist/",
        request,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access-token")}`,
          },
        }
      );
      setSearchError("추가완료!");
      setSong('');
      setSnackbar({
        isOpen: true,
        message: '추가 완료!',
        severity: 'success',
      })
    } catch (error) {
      console.log(error);
      ExpirationToken(error.response.data.message, postPlayList, setSnackbar);
      setSearchError(error.response.data.message);
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
              placeholder={localStorage.getItem('access-token') ? "신청곡을 검색해보세요." : "로그인하세요~~"}
              disabled={!localStorage.getItem('access-token')}

              onKeyPress={(e) => { if (e.key === 'Enter') search() }}
            />
            <HiOutlineSearch onClick={() => search()} size={24} className="search-btn" />
            <br />
            {song === "" ? (
              <div className="nonSearch">
                <img src="./images/sun.png" alt="디자인" className="sun" />
                <span>{localStorage.getItem('access-token') ? '검색어를 입력해주세요.' : '로그인하세요~~'}</span>
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
                      return <SongList item={item} key={index} setRequest={setRequest} />;
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
      {/* <Modal
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
      </Modal> */}
    </div>
  );
}
export default Song;
