import React, { useEffect, useState } from "react";
import Header from "./Header";
import { instance } from "../instance/instance";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { ImMusic } from "react-icons/im";
import "../styles/Chart.scss";
import ExpirationToken from "../function/ExpirationToken";

function ChartList({ data, id, index }) {
  const [pushed, setPushed] = useState(false);

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
      <div className="ChartList right long">
        <span>{pushed ? <AiFillLike /> : <AiOutlineLike />} {data.point}</span>
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
        const response = await instance.get("chart");
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
      <div className="Chart">
        <h3 className="long">{`${month}-${today.getDate()} ${week}`}</h3>
        <div className="Chart-title long">
          <ImMusic className="title-icon" size={60} />
          <div className="title-vertical"></div>
          <h1 className="title">MONTHLY CHART</h1>
        </div>
        {loading ?
          <div className="nonSearch"></div> :
          <div className="ChartList">
            {chart.filter((value, i) => i < 5).length ?
              chart.map((item, index) => {
                return <ChartList data={item} key={item.id} id={item.id} index={index} />;
              }) : <div className="nonSearch">
                <img src="./images/sun.png" alt="디자인" className="sun" />{" "}
                <span>노래가 없습니다~</span>
              </div>}
          </div>}
      </div>
    </div>
  );
}

export default Chart;