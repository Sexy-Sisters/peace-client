import React, { useEffect, useState } from "react";
import Header from "./Header";
import axios from "axios";
import "../styles/Chart.css";

function ChartList({ data }) {
  return (
    <div className="ChartList-div">
      {/* <img src={data.imgUrl} alt="앨범커버" /> */}
      <img src="./images/logo.png" alt="앨범커버" />
      <div>
        <span className="ChartList-name">{data.title}</span>
        <span className="ChartList-artist">{data.singer}</span>
      </div>
    </div>
  );
}

function Chart() {
  const [chart, setChart] = useState([]);
  const [loading, setLoading] = useState(false);
  const instance = axios.create({
    baseURL: "http://10.150.151.125:8080/api",
  });

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
    console.log(chart);
  }, []);

  const sampleData = [
    {
      id: 1,
      img: "./images/logo.png",
      name: "test1",
      artist: "test1",
    },
    {
      id: 2,
      img: "./images/logo.png",
      name: "test2",
      artist: "test2",
    },
    {
      id: 3,
      img: "./images/logo.png",
      name: "test3",
      artist: "test3",
    },
  ];
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
            {chart.length &&
              chart.map((item) => {
                return <ChartList data={item} key={item.id} />;
              })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Chart;
