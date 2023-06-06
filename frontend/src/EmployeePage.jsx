import React, { useEffect,useState } from 'react'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import "./CssFiles/Theme.css"
import ChatComponent from './Chat'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
function EmployeePage() {
	const [activeLink, setActiveLink] = useState('home');
	const [startDate, setStartDate] = useState(new Date()); 

	const CustomInput = ({ value, onClick }) => (
        <i className="fs-4 bi-calendar3" style={{ cursor: 'pointer' }} onClick={onClick}></i>
    ); 

    const {id} = useParams();
	const navigate = useNavigate()
	axios.defaults.withCredentials = true;
	useEffect(() => {
		axios.get('http://localhost:5000/verifyEmployee')
			.then(res => {
				if (res.data.Status !== "Success" || res.data.id != id) {
					navigate('/login')
				}
			})
	}, [])
	const handleLogout = () => {
		axios.get('http://localhost:5000/logout')
		.then(res => {
			navigate('/login')
		}).catch(err => console.log(err));
	}
	return (
		<div className="container-fluid font-family">
			<div className="row flex-nowrap">
				<div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 db-bgc text-font">
					<div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
						<a href={'/employeePage/'+id} className="d-flex align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none">
							<span className="fs-5 fw-bolder d-none d-sm-inline tc">Employee Page</span>
						</a>
						<ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
    <li>
      <Link to={'/employeePage/'+id} data-bs-toggle="collapse" className={"nav-link text-white px-0 align-middle " + (activeLink === 'home' ? 'active' : '')} onClick={() => setActiveLink('home')}>
        <i className="tc fs-4 bi-house"></i> <span className="tc ms-1 d-none d-sm-inline">Home</span>
      </Link>
    </li>
    <li>
      <Link to={'/employeePage/'+id+'/employeeSchedule/'+id} className={"nav-link px-0 align-middle text-white " + (activeLink === 'schedule' ? 'active' : '')} onClick={() => setActiveLink('schedule')}>
        <i className="tc fs-4 bi-table"></i> <span className="tc ms-1 d-none d-sm-inline">Schedule</span>
      </Link>
    </li>
    <li>
      <Link to={'/employeePage/'+id+'/employeeProfile/'+id} className={"nav-link px-0 align-middle text-white " + (activeLink === 'profile' ? 'active' : '')} onClick={() => setActiveLink('profile')}>
        <i className="tc fs-4 bi-person"></i> <span className="tc ms-1 d-none d-sm-inline">Profile</span>
      </Link>
    </li>
    <li>
      <Link to={'/employeePage/'+id+'/Messenger/'+id} className={"nav-link px-0 align-middle text-white " + (activeLink === 'chat' ? 'active' : '')} onClick={() => setActiveLink('chat')}>
        <i className="tc fs-4 bi-chat-dots"></i> <span className="tc ms-1 d-none d-sm-inline">Chat</span>
      </Link>
    </li>
    <li onClick={handleLogout}>
      <a href="#" className="nav-link px-0 align-middle text-white">
        <i className="tc fs-4 bi-power"></i> <span className="tc ms-1 d-none d-sm-inline">Logout</span>
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

						<div className='ms-auto d-flex'>
							<ChatComponent className='ms-auto' />
						</div>


				</div>
					<Outlet />
				</div>
			</div>
		</div>
	)
}



export default EmployeePage