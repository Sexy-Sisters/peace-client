import React from "react";
import Header from "./Header";
import "../styles/Chart.css";

function ChartList({ data }) {
  return (
    <div className="ChartList-div">
      <img src={data.img} alt="앨범커버" />
      <div>
        <span className="ChartList-name">{data.name}</span>
        <span className="ChartList-artist">{data.artist}</span>
      </div>
    </div>
  );
}

function Chart() {
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
      <div className="Chart-div">
        <h1 className="title">BSSM 차트</h1>
        <div className="ChartList">
          {sampleData.map((item) => {
            return <ChartList data={item} key={item.id} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default Chart;
