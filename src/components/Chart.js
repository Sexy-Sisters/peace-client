import React, { useEffect, useState } from "react";
import { Header } from "../allFiles";
import { instance } from "../instance/instance";
import { AiOutlineHeart } from "react-icons/ai";
import { ImMusic } from "react-icons/im";
import { TiPlus } from "react-icons/ti";
import styled from "styled-components";
import "../styles/Chart.scss";
import Modal from 'react-modal';
import ExpirationToken from "../function/ExpirationToken";
import { useRecoilState } from "recoil";
import { snackbarState } from "../atom";

const ChartLeft = styled.div`
  width: 586px;
  display: flex;
  flex-direction: row;
  height: 90px;
  background-color: #fffaf1;
  margin-right: 0;
  border-radius: ${(props) =>
    props.index === 0
      ? "40px 40px 0px 0px"
      : props.index === props.size - 1
        ? "0px 0px 40px 40px"
        : "0"};
`;

function ChartList({ data, index, size }) {
  // const [modal, setModal] = useState(false);
  // const [searchError, setSearchError] = useState('');
  const [snackbar, setSnackbar] = useRecoilState(snackbarState);

  const addPlayList = async () => {
    // setModal(true);
    try {
      const response = await instance.post(
        "playlist/",
        {
          title: data.title,
          singer: data.singer,
          imgUrl: data.imgUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access-token")}`,
          },
        }
      );
      console.log(response);
      // setSearchError('추가완료!');
      setSnackbar({
        isOpen: true,
        message: '추가 완료!',
        severity: 'success',
      })
    } catch (error) {
      console.log(error);
      ExpirationToken(error.response.data.message, addPlayList, setSnackbar);
      // setSearchError(error.response.data.message);
    }
  };

  return (
    <>
      <div className="ChartList-top">
        <div className="ChartList-root">
          <ChartLeft index={index} size={size}>
            <div className="ChartList-rank">
              <div>{index + 1}</div>
            </div>
            <div className="ChartList text">
              <img src={data.imgUrl} alt="앨범커버" />
              <div className="ChartList left">
                <span className="ChartList-name">{data.title}</span>
                <span className="ChartList-artist">{data.singer}</span>
                {/* <span className="ChartList-artist">{hour - data.createdHour}</span> */}
              </div>
              <TiPlus
                size={24}
                style={{ cursor: "pointer" }}
                onClick={() => addPlayList()}
              />
            </div>
          </ChartLeft>
          {index !== size - 1 && <hr />}
        </div>
        <div className="ChartList right long">
          <span>
            <AiOutlineHeart /> {data.point}
          </span>
        </div>
      </div>
      {/* <Modal
        isOpen={modal}
        onRequestClose={() => setModal(false)}
        style={{
          overlay: {
            backgroundColor: "rgba(134, 134, 134, 0.2)",
            zIndex: 100,
          },
          content: {
            width: "700px",
            height: "500px",
            margin: "auto",
            borderRadius: "20px",
            padding: 0,
            overflowX: "hidden",
            backgroundColor: "#FFF9F1",
          },
        }}
      >
        <div className="modal-header"></div>
        {searchError && (
          <div className="song-modal">
            <img src="./images/logo.png" alt="로고" />
            <br />
            <span className="searchError">{searchError}</span>
          </div>
        )}
      </Modal> */}
    </>
  );
}

function Chart() {
  let today = new Date();
  const month =
    today.getMonth() + 1 < 10
      ? `0${today.getMonth() + 1}`
      : `${today.getMonth() + 1}`;
  const date =
    today.getDate() < 10 ? `0${today.getDate()}` : `${today.getDate()}`;
  const WEEKDAY = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  let week = WEEKDAY[today.getDay()];
  const [chart, setChart] = useState([]);
  const [loading, setLoading] = useState(false);

  // console.log(chart);

  useEffect(() => {
    const getSongChart = async () => {
      try {
        setLoading(true);
        const response = await instance.get("chart");
        setChart(response.data);
      } catch (error) {
        console.log(error);
        ExpirationToken(error.response.data.message, getSongChart);
      }
    };
    getSongChart();
    setLoading(false);
  }, []);

  return (
    <div>
      <Header />
      <div className="Chart">
        <div className="date">
          <h3 className="long">{`${month}-${date} ${week}`}</h3>
        </div>
        <div className="Chart-title long">
          <ImMusic className="title-icon" size={60} />
          <div className="title-vertical"></div>
          <h1 className="title">MONTHLY CHART</h1>
        </div>
        {loading ? (
          <div className="nonSearch"></div>
        ) : (
          <div className="ChartList">
            {chart.filter((value, i) => i < 5).length ? (
              chart.map((item, index) => {
                return (
                  <ChartList
                    data={item}
                    key={item.id}
                    index={index}
                    size={chart.length}
                  />
                );
              })
            ) : (
              <div className="nonSearch">
                <img src="./images/sun.png" alt="디자인" className="sun" />{" "}
                {/* <span>노래가 없습니다~</span> */}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Chart;
