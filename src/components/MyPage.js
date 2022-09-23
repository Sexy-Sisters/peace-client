import React, { useEffect, useState } from 'react'
import Header from './Header'
import '../styles/MyPage.css';
import { instance } from '../instance/instance';
import { Link, useNavigate } from 'react-router-dom';
import { AiFillLike } from "react-icons/ai";
import { ImCross } from "react-icons/im";
import RefreshToken from '../hooks/ExpirationToken';

function MyPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSongExist, setIsSongExist] = useState(false);

  const [userInfo, setUserInfo] = useState({});
  useEffect(() => {
    if (localStorage.getItem('access-token')) {
      (async () => {
        try {
          setLoading(true);
          const response = await instance.get('user', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('access-token')}`
            }
          });
          setIsSongExist(response.data.requestedSong ? true : false);
          setUserInfo({
            ...response.data,
            img: './images/logo.png',
          })
        } catch (error) {
          console.log(error);
          RefreshToken(error.response.data.message);
        }
      })();
      setLoading(false);
    }
  }, [isSongExist]);
  const { nickName, img, requestedSong } = userInfo;

  const deleteSong = async () => {
    try {
      setLoading(true);
      const response = await instance.delete(`song/${requestedSong.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access-token')}`
        }
      });
      console.log(response);
      setIsSongExist(false);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  return (
    <>
      <Header />
      <div className='MyPage-div'>
        <div className='MyPage-info'>
          <img src={img} alt='프로필 사진' className='MyPage-img' />
          <h3 className='MyPage-nickname'>{nickName}</h3>
        </div>
        <h1>오늘 신청곡</h1>
        {!loading ? (isSongExist ? <div className="ChartList">
          <div className="ChartList-root">
            <div className="ChartList-div">
              <img src="./images/logo.png" alt="앨범커버" />
              <div className="ChartList-left">
                <span className="ChartList-name">{requestedSong.title}</span>
                <span className="ChartList-artist">{requestedSong.singer}</span>
              </div>
              <div className="ChartList-right">
                <span><AiFillLike /> {requestedSong.numberOfUps}</span>
              </div>
              <ImCross onClick={() => deleteSong()} />
            </div>
          </div>
        </div> : <div><span>아직 신청곡이 없습니다!</span><Link to={'/song'}>신청하러 가기</Link></div>) : <span>로딩중~~~</span>}
      </div>
    </>
  )
}
export default MyPage