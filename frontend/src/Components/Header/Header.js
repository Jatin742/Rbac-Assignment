import React, { Fragment, useState } from 'react';
import "./Header.css";
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { logout } from '../../Actions/userAction';
import { GiHamburgerMenu } from "react-icons/gi";
import { ImCross } from "react-icons/im";

const Header = () => {
  const { isAuthenticated, user } = useSelector(state => state.user);
  const dispath = useDispatch();
  const [menu, setMenu] = useState(false);
  const handleMenu = () =>{
    setMenu(!menu);
  }
  const handleLogout = () => {
    dispath(logout());
  }
  return (
    <Fragment>
      <div className="header">
        {menu? 
          <ImCross className='menu-svg'  onClick={handleMenu}/>
          :
          <GiHamburgerMenu className='menu-svg' onClick={handleMenu}/>
        }
        <Link className='logo' to="/">Events</Link>

        <div className={`box1  ${menu ? "menu-active" : "menu-close"}`}>
          {isAuthenticated ?
            <>
              {user.role === "admin" && <>
                <Link className='admin' to="/admin/all-users" >My Users</Link>
                <Link className='admin' to="/admin/all-events" >My Events</Link>
              </>}
              <Link className="profile" to="/user/events">My Profile</Link>
              <Link className='logout' onClick={handleLogout}>Logout</Link>
            </>
            :
            <Link to="/login">Login</Link>}
        </div>
      </div>
      <div
        className={`overlay ${menu ? "active" : ""}`}
        onClick={handleMenu}
      ></div>
    </Fragment>
  )
}

export default Header