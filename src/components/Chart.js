import React, { useEffect, useState } from "react";
import Header from "./Header";
import { instance } from "../instance/instance";
import { AiFillLike } from "react-icons/ai";
import "../styles/Chart.scss";
import { ImMusic } from "react-icons/im";


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
    }
  }

  return (
    <div className="ChartList-root">
      <div className="ChartList-rank">
        <span className="ChartList-rank">{index + 1}</span>
      </div>
      <div className="ChartList">
        {/* <img src={data.imgUrl} alt="앨범커버" /> */}
        <img src="./images/logo.png" alt="앨범커버" />
        <div className="ChartList-left">
          <span className="ChartList-name">{data.title}</span>
          <span className="ChartList-artist">{data.singer}</span>
          {/* <span className="ChartList-artist">{hour - data.createdHour}</span> */}
        </div>
        <div className="ChartList-right">
          <span className="ChartList-artist">{data.userName}</span>
          <span><button onClick={() => pushLike()}><AiFillLike color={pushed ? 'red' : 'black'} /></button> {like}</span>
        </div>
      </div>
    </div>
  );
}

function Chart() {
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
      setLoading(false);
    };
    getSongChart();
  }, []);

  return (
    <div>
      <Header />
      <div className="Chart long">
        <h3>{`${month}-${today.getDate()} ${week}`}</h3>
        <div className="Chart-title long">
          <ImMusic className="title-icon" size={60} />
          <div className="title-vertical"></div>
          <h1 className="title">MONTHLY CHART</h1>
        </div>
        {loading ? <><span>로딩중~</span>
          <img src="../images/loading.gif" alt="로딩중~" /></> :
          <div className="ChartList">
            {chart.length ?
              chart.map((item, index) => {
                return <ChartList data={item} key={item.id} id={item.id} index={index} />;
              }) : <span>노래가 없습니다.</span>}
          </div>}
      </div>
    </div>
  );
}

export default Chart;
