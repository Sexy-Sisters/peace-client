import React, { useState, useEffect } from 'react'
import { ImMusic } from 'react-icons/im';
import { instance } from '../instance/instance';
import Header from './Header';

function UserList() {
  const [userList, setUserList] = useState();
  useEffect(() => {
    const getUserList = async () => {
      try {
        const response = await instance.get('user');
        setUserList(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    getUserList();
  }, []);
  return (
    <>
      <Header />
      <div className='PlayList'>
        <div className="Chart-title">
          <ImMusic className="title-icon" size={60} />
          <div className="title-vertical"></div>
          <h1 className="title">PLAYLIST</h1>
        </div>
      </div>
    </>
  )
}

export default UserList