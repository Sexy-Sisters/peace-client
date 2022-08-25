import React, { useState } from "react";
import Header from "./Header";
// import axios from "axios";
import "../styles/Apply.css";

function Apply() {
  const [song, setSong] = useState("");
  const [music, setMusic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onChange = (e) => {
    setSong(e.target.value);
  };

  const search = async () => {
    try {
      setMusic(null);
      setError(null);
      setLoading(true);
      // const response = await getSongInfo();
      // setMusic(response);
    } catch (error) {
      console.log(error.response.status);
      setError(error);
    }
    setLoading(false);
  };

  if (loading) return <div>로딩중..</div>;
  if (error) return <div>에러 발생..</div>;
  console.log(music);

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

export default Apply;
