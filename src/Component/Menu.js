import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../CSSComponent/main.css";
import "../CSSComponent/main-mediaQuery.css";
import { Contest } from "../App";
import user from '../Image/user.png'

const Menu = ({ toggleMenu }) => {
  const navigate = useNavigate();

  const {random} = useContext(Contest);

  return (
    <div className="menu-container">
      <button className="menu-container-close-btn" onClick={toggleMenu}>
        <i className="ri-close-large-line" />
      </button>
      <div className="user-img-container">
        <div className="user-icon"><i className="icon ri-account-circle-fill" /></div>
      </div>
      <div className="user-detail">
        <div className="name">Guest</div>
        <div className="email">Guest_{random}</div>
      </div>
      <div className="menu-btn">
        <button
          type="button"
          className="menu-in"
          onClick={() => {
            navigate("/login");
          }}
        >
          Log in
        </button>
      </div>
    </div>
  );
};

export default Menu;
