import React, { useEffect, useState } from 'react'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import "./CssFiles/Theme.css"

function Dashboard() {
    const [startDate, setStartDate] = useState(new Date()); // State for date picker
   // Hooks
   const navigate = useNavigate(); // Navigate function from react-router-dom
   const location = useLocation(); // Location object from react-router-dom

    axios.defaults.withCredentials = true;

    // Check if the user is a manager, otherwise redirect to login
    useEffect(() => {
        axios.get('http://localhost:5000/verifyManager')
            .then(res => {
                if (res.data.Status !== "Success" || res.data.role!=="Manager") {
                        navigate('/login');
                } 

            })
    }, [])
  // Handle logout
    const handleLogout = () => {
        axios.get('http://localhost:5000/logout')
            .then(res => {
                navigate('/login')
            }).catch(err => console.log(err));
    }
    // Custom input component for date picker
    const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
        <i
          ref={ref}
          className="fs-4 bi-calendar3"
          style={{ cursor: 'pointer' }}
          onClick={onClick}
        ></i>
      ));
    
    return (
        <div className="container-fluid text-font">
            <div className="row flex-nowrap">
                <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-2 db-bgc">
                    <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
                        <a href="/" className="d-flex align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none">
                            <span className="fs-5 fw-bolder d-none d-sm-inline tc text-font">Manager Dashboard</span>
                        </a>
                        <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                            <li>
                                <Link to="/" className={location.pathname === '/' ? 'nav-link text-white px-2 align-middle active' : 'nav-link text-white px-0 align-middle'}>
                                    <i className="fs-4 bi-house tc"></i> <span className="tc ms-1 d-none d-sm-inline">Home</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/employee" className={location.pathname === '/employee' ? 'nav-link px-2 align-middle text-white active' : 'nav-link px-0 align-middle text-white'}>
                                    <i className="fs-4 bi-people tc"></i> <span className="tc ms-1 d-none d-sm-inline">Manage Employees</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/schedule" className={location.pathname === '/schedule' ? 'nav-link px-2 align-middle text-white active' : 'nav-link px-0 align-middle text-white'}>
                                    <i className="fs-4 bi-table tc"></i> <span className="tc ms-1 d-none d-sm-inline">Schedule</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/profile" className={location.pathname === '/profile' ? 'nav-link px-2 align-middle text-white active' : 'nav-link px-0 align-middle text-white'}>
                                    <i className="fs-4 bi-person tc"></i> <span className="tc ms-1 d-none d-sm-inline">Profile</span>
                                </Link>
                            </li>
                            <li onClick={handleLogout}>
                                <a href="#" className="nav-link px-2 align-middle text-white">
                                    <i className="fs-4 bi-power tc"></i> <span className="tc ms-1 d-none d-sm-inline">Logout</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="col p-0 m-0">
                    <div className='p-2 d-flex justify-content-center shadow top-con-title' style={{minHeight:'45px'}}>
                    <h4 id="ems-title" className="text-font d-flex center-horizintally"><b>Employee Management System</b></h4>
                        <div className='ms-auto'></div>
                        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} customInput={<CustomInput />} />
                    </div>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Dashboard;
