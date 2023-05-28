import React, { useEffect, useState } from 'react'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import "../src/Theme.css"

function Dashboard() {
    const [showNotifications, setShowNotifications] = useState(false);
    const navigate = useNavigate()
    const location = useLocation();

    axios.defaults.withCredentials = true;

    const handleIconClick = () => {
        setShowNotifications(!showNotifications);
    };

    axios.defaults.withCredentials = true;
    useEffect(() => {
        axios.get('http://localhost:5000/verifyManager')
            .then(res => {
                if (res.data.Status === "Success") {
                    if (res.data.role === "Manager") {
                        navigate('/');
                    }
                } else {
                    navigate('/login')
                }
            })
    }, [])

    const handleLogout = () => {
        axios.get('http://localhost:5000/logout')
            .then(res => {
                navigate('/login')
            }).catch(err => console.log(err));
    }
    return (
        <div className="container-fluid text-font">
            <div className="row flex-nowrap">
<<<<<<< HEAD
                <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-2 db-bgc">
=======
                <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 db-bgc">
>>>>>>> 1232fd0ae7c2655e7076ccf2d568c09d8f8ab825
                    <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
                        <a href="/" className="d-flex align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none">
                            <span className="fs-5 fw-bolder d-none d-sm-inline tc text-font">Manager Dashboard</span>
                        </a>
                        <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                            <li>
<<<<<<< HEAD
                                <Link to="/" className={location.pathname === '/' ? 'nav-link text-white px-2 align-middle active' : 'nav-link text-white px-0 align-middle'}>
=======
                                <Link to="/" className={location.pathname === '/' ? 'nav-link text-white px-0 align-middle active' : 'nav-link text-white px-0 align-middle'}>
>>>>>>> 1232fd0ae7c2655e7076ccf2d568c09d8f8ab825
                                    <i className="fs-4 bi-house tc"></i> <span className="tc ms-1 d-none d-sm-inline">Home</span>
                                </Link>
                            </li>
                            <li>
<<<<<<< HEAD
                                <Link to="/employee" className={location.pathname === '/employee' ? 'nav-link px-2 align-middle text-white active' : 'nav-link px-0 align-middle text-white'}>
=======
                                <Link to="/employee" className={location.pathname === '/employee' ? 'nav-link px-0 align-middle text-white active' : 'nav-link px-0 align-middle text-white'}>
>>>>>>> 1232fd0ae7c2655e7076ccf2d568c09d8f8ab825
                                    <i className="fs-4 bi-people tc"></i> <span className="tc ms-1 d-none d-sm-inline">Manage Employees</span>
                                </Link>
                            </li>
                            <li>
<<<<<<< HEAD
                                <Link to="/schedule" className={location.pathname === '/schedule' ? 'nav-link px-2 align-middle text-white active' : 'nav-link px-0 align-middle text-white'}>
=======
                                <Link to="/schedule" className={location.pathname === '/schedule' ? 'nav-link px-0 align-middle text-white active' : 'nav-link px-0 align-middle text-white'}>
>>>>>>> 1232fd0ae7c2655e7076ccf2d568c09d8f8ab825
                                    <i className="fs-4 bi-table tc"></i> <span className="tc ms-1 d-none d-sm-inline">Schedule</span>
                                </Link>
                            </li>
                            <li>
<<<<<<< HEAD
                                <Link to="/profile" className={location.pathname === '/profile' ? 'nav-link px-2 align-middle text-white active' : 'nav-link px-0 align-middle text-white'}>
=======
                                <Link to="/profile" className={location.pathname === '/profile' ? 'nav-link px-0 align-middle text-white active' : 'nav-link px-0 align-middle text-white'}>
>>>>>>> 1232fd0ae7c2655e7076ccf2d568c09d8f8ab825
                                    <i className="fs-4 bi-person tc"></i> <span className="tc ms-1 d-none d-sm-inline">Profile</span>
                                </Link>
                            </li>
                            <li onClick={handleLogout}>
<<<<<<< HEAD
                                <a href="#" className="nav-link px-2 align-middle text-white">
=======
                                <a href="#" className="nav-link px-0 align-middle text-white">
>>>>>>> 1232fd0ae7c2655e7076ccf2d568c09d8f8ab825
                                    <i className="fs-4 bi-power tc"></i> <span className="tc ms-1 d-none d-sm-inline">Logout</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="col p-0 m-0">
                    <div className='p-2 d-flex justify-content-center shadow' style={{minHeight:'45px'}}>
                        <h4 className="text-font d-flex center-horizintally"><b>Employee Management System</b></h4>
                        <div className='ms-auto'></div>
                    </div>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

<<<<<<< HEAD
export default Dashboard;
=======
export default Dashboard;
>>>>>>> 1232fd0ae7c2655e7076ccf2d568c09d8f8ab825
