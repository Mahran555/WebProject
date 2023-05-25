import React, { useEffect, useState } from 'react'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import axios from 'axios'
import "../src/Theme.css"
import NotificationIcon from './NotificationIcon';

function Dashboard() {
	const [showNotifications, setShowNotifications] = useState(false);
	const navigate = useNavigate()
	axios.defaults.withCredentials = true;
	// For example, suppose we have these notifications
	const notifications = [
		'Notification 1',
		'Notification 2',
		'Notification 3',
	];


	const handleIconClick = () => {
		// Toggle the showNotifications state
		setShowNotifications(!showNotifications);
	};

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
				<div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 db-bgc">
					<div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
						<a href="/" className="d-flex align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none">
							<span className="fs-5 fw-bolder d-none d-sm-inline tc text-font">Manager Dashboard</span>
						</a>
						<ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
							<li>
								<Link to="/" data-bs-toggle="collapse" className="nav-link text-white px-0 align-middle">
									<i className="fs-4 bi-house tc"></i> <span className="tc ms-1 d-none d-sm-inline">Home</span> </Link>
							</li>
							<li>
								<Link to="/employee" className="nav-link px-0 align-middle text-white">
									<i className="fs-4 bi-people tc"></i> <span className="tc ms-1 d-none d-sm-inline">Manage Employees</span> </Link>
							</li>
							<li>
								<Link to="schedule" className="nav-link px-0 align-middle text-white">
									<i className="fs-4 bi-table tc"></i> <span className="tc ms-1 d-none d-sm-inline">Schedule</span></Link>
							</li>
							<li>
								<Link to="profile" className="nav-link px-0 align-middle text-white">
									<i className="fs-4 bi-person tc"></i> <span className="tc ms-1 d-none d-sm-inline">Profile</span></Link>
							</li>
							<li onClick={handleLogout}>
								<a href="#" className="nav-link px-0 align-middle text-white">
									<i className="fs-4 bi-power tc"></i> <span className="tc ms-1 d-none d-sm-inline">Logout</span></a>
							</li>
						</ul>
					</div>
				</div>
				<div className="col p-0 m-0">
					<div className='p-2 d-flex justify-content-center shadow'>
						<h4 className="text-font d-flex center-horizintally"><b>Employee Management System</b></h4>

						<div className='ms-auto'>
							<NotificationIcon notifications={notifications.length} onClick={handleIconClick} />

							{showNotifications && (
								<div style={{ position: 'absolute', top: '50px', right: '20px', background: 'white', padding: '10px', boxShadow: '0px 0px 10px rgba(0,0,0,0.1)' }}>
									{notifications.map((notification, index) => (
										<p key={index} style={{ margin: '10px 0', backgroundColor: '#f5f5f5', borderRadius: '4px', padding: '10px', cursor: 'pointer', transition: '.3s', '&:hover': { backgroundColor: '#ddd' } }}>{notification}</p>
									))}
								</div>
							)}
						</div>
					</div>

					<Outlet />
				</div>
			</div>
		</div>
	)
}

export default Dashboard