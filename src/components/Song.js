import React, { useState, useEffect } from "react";
import Header from "./Header";
import axios from "axios";
// import axios from "axios";
import "../styles/Song.css";

function Song() {
  const [song, setSong] = useState("");
  const [music, setMusic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onChange = (e) => {
    setSong(e.target.value);
  };

  const search = async () => {
    setMusic(null);
    setError(null);
    setLoading(true);
    const response = await getSongInfo();
    console.log(response);
    setMusic(response);
    setLoading(false);
  };

  const getSongInfo = async () => {
    var axios = require("axios");

    var config = {
      method: "get",
      url: `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${song}&api_key=a7b431d3d0705a9bd1b0398f6f6cb0dd&format=json`,
      headers: {},
    };

    try {
      return JSON.stringify((await axios(config)).data)
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) return <div>로딩중..</div>;
  if (error) return <div>에러 발생..</div>;
  // console.log(music);

  return (
    <div>
      <Header />
      <div className="Apply-div">
        <h1 className="title">기상송 신청하기</h1>
        <input type="text" onChange={(e) => onChange(e)} value={song} />
        <button onClick={search}>검색</button>
        {/* <input type="file" /> */}
      </div>
    </div>
  );
}

export default Song;
