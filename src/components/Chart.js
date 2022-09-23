import React, { useEffect, useState } from "react";
import Header from "./Header";
import { instance } from "../instance/instance";
import { AiFillLike } from "react-icons/ai";
import "../styles/Chart.scss";

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
      }
    }
    isPushed();
  }, [data.numberOfUps, id, pushed]);

  return (
    <div className="ChartList-root">
      <div className="ChartList-rank-div">
        <span className="ChartList-rank">{index + 1}</span>
      </div>
      <div className="ChartList-div">
        {/* <img src={data.imgUrl} alt="앨범커버" /> */}
        <img src="./images/logo.png" alt="앨범커버" />
        <div className="ChartList-left">
          <span className="ChartList-name">{data.title}</span>
          <span className="ChartList-artist">{data.singer}</span>
          {/* <span className="ChartList-artist">{hour - data.createdHour}</span> */}
        </div>
        <div className="ChartList-right">
          <span className="ChartList-artist">{data.userName}</span>
          <span><button><AiFillLike color={pushed ? 'red' : 'black'} /></button>{data.point}</span>
        </div>
      </div>
    </div>
  );
}

function Chart() {
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
      {loading ? (
        <div className="Chart-div">
          <div className="Chart-title-div">
            <h1 className="title">Monthly Chart</h1>
          </div>
          <span>로딩중~</span>
          <img src="../images/loading.gif" alt="로딩중~" />
        </div>
      ) : (
        <div className="Chart-div">
          <div className="Chart-title-div">
            <h1 className="title">Monthly Chart</h1>
          </div>
          <div className="ChartList">
            {chart.length ?
              chart.map((item, index) => {
                return <ChartList data={item} key={item.id} id={item.id} index={index} />;
              }) : <span>노래가 없습니다.</span>}
          </div>
        </div>
      )}
    </div>
  );
}

export default Chart;
