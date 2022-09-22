import React, { useEffect, useState } from 'react'
import Header from './Header'
import '../styles/MyPage.css';
import { instance } from '../instance/instance';
import { Link, useNavigate } from 'react-router-dom';
import { AiFillLike } from "react-icons/ai";

function MyPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem('access-token')) {
      console.log('로그인하세용~');
      nav('/');
    }
  }, [])
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
          setUserInfo({
            ...response.data,
            img: './images/logo.png',
          })
          console.log(response.data.requestedSong.title)
        } catch (error) {
          console.log(error);
        }
      })();
      setLoading(false);
    }
  }, []);
  console.log(loading);
  const { nickName, img, requestedSong } = userInfo;
  return (
    <>
      <Header />
      <div className='MyPage-div'>
        <div className='MyPage-info'>
          <img src={img} alt='프로필 사진' className='MyPage-img' />
          <h3 className='MyPage-nickname'>{nickName}</h3>
        </div>
        <h1>오늘 신청곡</h1>
        {!loading ? (requestedSong ? <div className="ChartList">
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
            </div>
          </div>
        </div> : <div><span>아직 신청곡이 없습니다!</span><Link to={'/song'}>신청하러 가기</Link></div>) : <span>로딩중~~~</span>}
      </div>
    </>
  )
}
export default MyPage