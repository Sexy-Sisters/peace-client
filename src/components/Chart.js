import React, { useEffect, useState } from "react";
import Header from "./Header";
import { instance } from "../instance/instance";
import { AiFillLike } from "react-icons/ai";
import "../styles/Chart.css";
import { getCookie } from "../Cookies";

function ChartList({ data, id }) {
  let today = new Date();
  let hour = today.getHours();
  const [pushed, setPushed] = useState(false);
  const pushLike = async () => {
    try {
      {
        if (pushed) {
          await instance.post(`song/${id}/up`, {
            headers: {
              'Authorization': `Bearer ${getCookie('access-token')}`
            }
          })
          setPushed(true);
        }
        else {
          await instance.delete(`song/${id}/up`, {
            headers: {
              'Authorization': `Bearer ${getCookie('access-token')}`
            }
          })
          setPushed(false);
        }
      };
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="ChartList-div">
      {/* <img src={data.imgUrl} alt="앨범커버" /> */}
      <img src="./images/logo.png" alt="앨범커버" />
      <div>
        <span className="ChartList-name">{data.title}</span>
        <span className="ChartList-artist">{data.singer}</span>
        <span className="ChartList-artist">{hour - data.createdHour}</span>
        <span className="ChartList-artist">{data.userName}</span>
        <span><button onClick={() => pushLike()}><AiFillLike color={pushed ? 'red' : 'black'} /></button> {data.numberOfUps}</span>
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
              chart.map((item) => {
                return <ChartList data={item} key={item.id} id={item.id} />;
              }) : <span>노래가 없습니다.</span>}
          </div>
        </div>
      )}
    </div>
  );
}

export default Chart;
