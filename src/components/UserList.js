import React, { useState, useEffect } from 'react'
import { ImMusic } from 'react-icons/im';
import { instance } from '../instance/instance';
import Header from './Header';
import '../styles/UserList.scss';

function UserListList() {
  return (
    <div>
      wow
    </div>
  )
}

function UserList() {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getUserList = async () => {
      try {
        setLoading(true);
        const response = await instance.get('user');
        setUserList(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    getUserList();
    setLoading(false);
  }, []);
  return (
    <>
      <Header />
      <div className='UserList'>
        <div className="Chart-title">
          <ImMusic className="title-icon" size={60} />
          <div className="title-vertical"></div>
          <h1 className="title">PLAYLIST</h1>
          <div className='UserList-list'>
            {!loading ? userList.map((item) => {
              return <UserListList data={item} key={item.id}></UserListList>
            }) : <>로딩중~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~</>}
          </div>
        </div>
      </div>
    </>
  )
}

export default UserList