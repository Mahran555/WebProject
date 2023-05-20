import React, { useEffect } from 'react'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import "../src/Theme.css"


function EmployeePage() {
	const {id} = useParams();
	const handleLogout = () => {
		axios.get('http://localhost:5000/logout')
		.then(res => {
			navigate('/login')
		}).catch(err => console.log(err));
	}
	return (
		<div className="container-fluid">
			<div className="row flex-nowrap">
				<div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 db-bgc text-font">
					<div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
						<a href="/" className="d-flex align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none">
							<span className="fs-5 fw-bolder d-none d-sm-inline tc">Employee Page</span>
						</a>
						<ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
							<li>
								<Link to={'/employeePage/'+id} data-bs-toggle="collapse" className="nav-link text-white px-0 align-middle">
									<i className="tc fs-4 bi-house"></i> <span className="tc ms-1 d-none d-sm-inline">Home</span> </Link>
							</li>
							<li>
								<Link to={'/employeePage/'+id+'/employeeSchedule/'+id} className="nav-link px-0 align-middle text-white">
									<i className="tc fs-4 bi-table"></i> <span className="tc ms-1 d-none d-sm-inline">Schedule</span></Link>
							</li>
							<li>
								<Link to={'/employeePage/'+id+'/employeeProfile/'+id} className="nav-link px-0 align-middle text-white">
									<i className="tc fs-4 bi-person"></i> <span className="tc ms-1 d-none d-sm-inline">Profile</span></Link>
							</li>
							<li onClick={handleLogout}>
								<a href="#" className="nav-link px-0 align-middle text-white">
									<i className="tc fs-4 bi-power"></i> <span className="tc ms-1 d-none d-sm-inline">Logout</span></a>
							</li>
						</ul>
					</div>
				</div>
				<div class="col p-0 m-0">
					<div className='p-2 d-flex justify-content-center shadow'>
						<h4 className="text-font"><b>Employee Management System</b></h4>						
					</div>
					<Outlet />
				</div>
			</div>
		</div>
	)
}



export default EmployeePage