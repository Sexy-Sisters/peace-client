import React, { useEffect, useState } from "react";
import Header from "./Header";
import { instance } from "../instance/instance";
import { AiFillLike } from "react-icons/ai";
import "../styles/Chart.css";

function ChartList({ data, index }) {
  let today = new Date();
  let hour = today.getHours();
  console.log(index);
  return (
    <div className="ChartList-div">
      {/* <img src={data.imgUrl} alt="앨범커버" /> */}
      <img src="./images/logo.png" alt="앨범커버" />
      <div>
        <span className="ChartList-name">{data.title}</span>
        <span className="ChartList-artist">{data.singer}</span>
        <span className="ChartList-artist">{hour - data.createdHour}</span>
        <AiFillLike />
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
        const response = await instance.get("song");
        console.log(response.data);
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
          <span>로딩중~</span>
        </div>
      ) : (
        <div className="Chart-div">
          <h1 className="title">BSSM 차트</h1>
          <div className="ChartList">
            {chart.length ?
              chart.map((item, index) => {
                return <ChartList data={item} key={index} />;
              }) : <span>노래가 없습니다.</span>}
          </div>
        </div>
      )}
    </div>
  );
}

export default Chart;
