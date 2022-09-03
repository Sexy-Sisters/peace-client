import React, { useState, useEffect } from "react";
import Header from "./Header";
import "../styles/Song.css";
import { instance } from '../instance/instance'

function SongList({ item, setSong }) {
  const requestSong = async () => {
    try {
      setSong("");
      console.log(item);
      await instance.post("song", {
        ...item,
        imgUrl: "추가예정",
      });
      console.log("신청완료!");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="SongList-div">
      <span onClick={() => requestSong()}>
        {item.singer} - {item.title}
      </span>
      <br />
    </div>
  );
}

function Song() {
  const [song, setSong] = useState("");
  const [music, setMusic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    search();
    if (song === "") {
      setLoading(false);
      setMusic([]);
    }
  }, [song]);

  const onChange = (e) => {
    setSong(e.target.value);
  };

  const search = async () => {
    setMusic(null);
    setError(null);
    setLoading(true);
    const response = await getSongInfo();
    const songList = JSON.parse(response);
    if (songList.results.trackmatches.track.length === 0) {
      setSearched(false);
    } else {
      setSearched(true);
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
        // console.log(response.data);
        str = JSON.stringify(response.data);
        // console.log(str);
      })
      .catch(function (error) {
        console.log(error);
      });

    return str;
  };

  if (error) return <div>에러 발생..</div>;

  return (
    <div>
      <Header />
      <div className="Song-div">
        <h1 className="title">기상송 신청하기</h1>
        <input
          type="text"
          onChange={(e) => onChange(e)}
          value={song}
          className="Song-input"
        />
        <br />
        {loading ? (
          <>
            <span>로딩중~</span>
            <img src="./images/loading.gif" alt="로딩중~" />
          </>
        ) : searched ? (
          <div className="Song-List">
            {music.map((item, index) => {
              return <SongList item={item} key={index} setSong={setSong} />;
            })}
          </div>
        ) : (
          <span>검색 결과가 없습니다.</span>
        )}
        {/* <input type="file" /> */}
      </div>
    </div>
  );
};
export default Song;
