import React, { useEffect, useState } from "react";
import Header from "./Header";
import { instance } from "../instance/instance";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import "../styles/Chart.scss";
import { ImMusic } from "react-icons/im";
import ExpirationToken from "../function/ExpirationToken";


function ChartList({ data, id, index }) {
  const [pushed, setPushed] = useState(false);
  const [like, setLike] = useState(data.numberOfUps);

  useEffect(() => {
    const isPushed = async () => {
      try {
        const response = await instance.get(`song/${id}/up`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access-token')}`
          }
        });
        setPushed(response.data);
      } catch (error) {
        console.log(error);
        ExpirationToken(error.response.data.message);
      }
    }
    isPushed();
  }, [data.numberOfUps, id, pushed]);

  const pushLike = async () => {
    pushed ? cancelLike() : upLike();
  }

  const upLike = async () => {
    if (!localStorage.getItem('access-token')) {
      alert('로그인이 필요합니다!');
      return;
    }
    try {
      const response = await instance.post(`song/${id}/up`, null, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access-token')}`
        }
      });
      console.log(response);
      setLike(response.data);
      setPushed(true);
      console.log('따봉박음!');
    } catch (error) {
      console.log(error);
      ExpirationToken(error.response.data.message);
    }
  }

  const cancelLike = async () => {
    if (!localStorage.getItem('access-token')) {
      alert('로그인이 필요합니다!');
      return;
    }
    try {
      const response = await instance.delete(`song/${id}/up`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access-token')}`
        }
      });
      console.log(response.data);
      setLike(response.data);
      setPushed(false);
      console.log('따봉취소!');
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
            {/* <span className="ChartList-artist">{hour - data.createdHour}</span> */}
          </div>
        </div>
      </div>
      <div className="ChartList right">
        <span className="ChartList-username">{data.userName}</span>
        <span>{pushed ? <AiFillLike onClick={() => pushLike()} /> : <AiOutlineLike onClick={() => pushLike()} />} {like}</span>
      </div>
    </div>
  );
}

function Main() {
  let today = new Date();
  const month = today.getMonth() + 1 < 10 ? `0${today.getMonth() + 1}` : `${today.getMonth() + 1}`;
  const WEEKDAY = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  let week = WEEKDAY[today.getDay()];
  const [chart, setChart] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getSongChart = async () => {
      try {
        setLoading(true);
        const response = await instance.get("song");
        setChart(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getSongChart();
    setLoading(false);
  }, []);

  return (
    <div>
      <Header />
      <div className="Chart">
        <h3>{`${month}-${today.getDate()} ${week}`}</h3>
        <div className="Chart-title">
          <ImMusic className="title-icon" size={60} />
          <div className="title-vertical"></div>
          <h1 className="title">DAILY CHART</h1>
        </div>
        {loading ? <><span>로딩중~</span>
          <img src="../images/loading.gif" alt="로딩중~" /></> :
          <div className="ChartList">
            {chart.filter((value, i) => i < 5).length ?
              chart.map((item, index) => {
                return <ChartList data={item} key={item.id} id={item.id} index={index} />;
              }) : <span>노래가 없습니다.</span>}
          </div>}
      </div>
    </div>
  );
}

export default Main;
