/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from "react";
import { ImMusic } from "react-icons/im";
import { instance } from "../instance/instance";
import "../styles/UserList.scss";
import { Link } from "react-router-dom";
import { Header } from "../allFiles";
import { css } from '@emotion/react';
import ExpirationToken from "../function/ExpirationToken";

function UserListList({ data, index, size }) {
  return (
    <>
      <Link to={`/playlist/${data.id}`}>
        <div className="UserList-text" css={css`
        background-color: #fffaf1;
          display: flex;
          justify-content: left;
          align-items: center;
          height: 90px;
          line-height: 20px;
          gap: 10px;
          border-radius: ${size === 1
            ? "40px"
            : index === 0
              ? "40px 40px 0px 0px"
              : index === size - 1
                ? "0px 0px 40px 40px"
                : "0"};
        `}>
          <img src={data.profileImg} alt="앨범커버" />
          <div className="UserList-left">
            <span className="UserList-name">{data.nickName}</span>
            <span className="UserList-artist">{data.name}</span>
          </div>
        </div>
        {index !== size - 1 && <hr />}
      </Link>
    </>
  );
}

function UserList() {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getUserList = async () => {
      try {
        setLoading(true);
        const response = await instance.get("user");
        setUserList(response.data);
      } catch (error) {
        console.log(error);
        ExpirationToken(error.response.data.message, getUserList);
      }
    };
    getUserList();
    setLoading(false);
  }, []);
  return (
    <>
      <Header />
      <div className="UserList">
        <div className="User-title">
          <ImMusic className="title-icon" size={60} />
          <div className="title-vertical"></div>
          <h1 className="title">USERLIST</h1>
        </div>
        <div className="UserListList">
          {!loading ? (
            userList.map((item, index) => {
              return <UserListList data={item} key={item.id} index={index} size={userList.length}></UserListList>;
            })
          ) : (
            <>로딩중~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~</>
          )}
        </div>
      </div>
    </>
  );
}

export default UserList;
