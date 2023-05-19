import React, { useEffect } from 'react'
import 'bootstrap-icons/font/bootstrap-icons.css'
import '../src/Theme.css'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Dashboard() {
	const navigate = useNavigate()
	axios.defaults.withCredentials = true;
	useEffect(()=>{
		axios.get('http://localhost:5000/dashboard')
		.then(res => {
			if(res.data.Status === "Success") {
				if(res.data.role === "manager") {
					navigate('/');
				} else {
					const id = res.data.id;
					navigate('/employeedetail/'+id)
				}
			} else {
				navigate('/start')
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
		<div className="container-fluid">
			<div className="row flex-nowrap">
				<div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 db-bgc">
					<div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 min-vh-100">
						<a href="/" className="d-flex align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-decoration-none">
							<span className="fs-5 fw-bolder d-none d-sm-inline tc">Manager Dashboard</span>
						</a>
						<ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
							<li>
								<Link to="/" data-bs-toggle="collapse" className="nav-link px-0 align-middle">
									<i className="fs-4 bi-house tc"></i> <span className="tc ms-1 d-none d-sm-inline">Home</span> </Link>
							</li>
							<li>
								<Link to="/employee" className="nav-link px-0 align-middle">
									<i className="fs-4 bi-people tc"></i> <span className="tc ms-1 d-none d-sm-inline">Manage Employees</span> </Link>
							</li>
							<li>
								<Link to="schedule" className="nav-link px-0 align-middle">
									<i className="fs-4 bi-table tc"></i> <span className="tc ms-1 d-none d-sm-inline">Schedule</span></Link>
							</li>
							<li>
								<Link to="profile" className="nav-link px-0 align-middle">
									<i className="fs-4 bi-person tc"></i> <span className="tc ms-1 d-none d-sm-inline">Profile</span></Link>
							</li>
							<li onClick={handleLogout}>
								<a href="#" className="nav-link px-0 align-middle">
									<i className="fs-4 bi-power tc"></i> <span className="tc ms-1 d-none d-sm-inline">Logout</span></a>
							</li>
						</ul>
					</div>
				</div>
				<div class="col p-0 m-0">
					<div className='p-2 d-flex justify-content-center shadow'>
						<h4>Employee Management System</h4>						
					</div>
					<Outlet />
				</div>
			</div>
		</div>
	)
}

export default Dashboard