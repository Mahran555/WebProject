import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faDollarSign, faMoneyBillAlt } from '@fortawesome/free-solid-svg-icons';
import { ThreeDots } from "react-loader-spinner";
import "../src/Theme.css"



function Home() {
  const [expandedRequestId, setExpandedRequestId] = useState(null);
  const [employeeCount, setEmployeeCount] = useState();
  const [salary, setSalary] = useState();
  const [averageSalary, setAverageSalary] = useState(0);
  const [managerName, setManager] = useState(null);
  const [vacationRequests, setVacationRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true); // Initial loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeeCountPromise = axios.get('http://localhost:5000/employeeCount');
        const managerPromise = axios.get('http://localhost:5000/getManager');
        const salariesPromise = axios.get('http://localhost:5000/salaries');
        const vacationRequestsPromise = axios.get('http://localhost:5000/vacationRequests');

        const [employeeCountRes, managerRes, salariesRes, vacationRequestsRes] = await Promise.all([
          employeeCountPromise,
          managerPromise,
          salariesPromise,
          vacationRequestsPromise,
        ]);

        // Count employee
        setEmployeeCount(employeeCountRes.data.count);

        // Manager info (name)
        if (managerRes.data.Status === 'Success') {
          setManager(managerRes.data.Result.lname);
        }

        // Salaries
        let sum = salariesRes.data.reduce((a, b) => a + b, 0);
        setSalary(sum);
        // Set average salary
        setAverageSalary(sum / salariesRes.data.length);

        // Vacation requests
        setVacationRequests(vacationRequestsRes.data.Result);

        setLoading(false); // Set loading to false when data has been fully loaded
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const updateVacationRequests = async () => {
      try {
        const vacationRequestsRes = await axios.get('http://localhost:5000/vacationRequests');
        setVacationRequests(vacationRequestsRes.data.Result);
      } catch (error) {
        console.error('Error updating vacation requests:', error);
      }
    };

    updateVacationRequests();
  }, [vacationRequests]); // Fetch updated vacation requests when the vacationRequests state changes

  if (loading) {
    return (
      <div className="text-center">
        <ThreeDots color="#0b0436" height={50} width={50} />
      </div>
    );
  }

  const handleAccept = async (id) => {
    try {
      await axios.put(`http://localhost:5000/vacationRequests/${id}`, { status: 'accepted' });
      console.log('Accepted vacation request with ID:', id);
    } catch (error) {
      console.error('Error accepting vacation request:', error);
    }
  };

  const handleDecline = async (id) => {
    try {
      await axios.put(`http://localhost:5000/vacationRequests/${id}`, { status: 'declined' });
      console.log('Declined vacation request with ID:', id);
    } catch (error) {
      console.error('Error declining vacation request:', error);
    }
  };

  const filterVacationRequests = (status) => {
    setActiveTab(status);
  };

  const handleToggleReason = (id) => {
    setExpandedRequestId((prevId) => (prevId === id ? null : id));
  };

  const filteredRequests = vacationRequests.filter((request) => request.status === activeTab);

  return (
    <div>
      <div className='p-3 text-center'>
        <h1 style={{ fontSize: '2.5rem', color: '#0b0436' }}>Welcome Back Mr.{managerName}</h1>
        <hr style={{ margin: '20px auto', width: '50%' }} />
      </div>

      <div className='d-flex justify-content-around mt-3'>
        <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
          <div className='text-center pb-1'>
            <h4>Employee</h4>
          </div>
          <hr />
          <div className=''>
            <h5>
              <FontAwesomeIcon icon={faUser} /> Total: {employeeCount}
            </h5>
          </div>
        </div>
        <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
          <div className='text-center pb-1'>
            <h4>Salary</h4>
          </div>
          <hr />
          <div className=''>
            <h5>
              <FontAwesomeIcon icon={faDollarSign} /> Total: {salary}$
            </h5>
          </div>
        </div>
        <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
          <div className='text-center pb-1'>
            <h4>Average Salary</h4>
          </div>
          <hr />
          <div className='' style={{ textAlign: 'center' }}>
            <h5>
              <FontAwesomeIcon icon={faMoneyBillAlt} /> : {averageSalary}$
            </h5>
          </div>
        </div>
      </div>

      <div className='container mt-5'>
        <h3>Vacation Requests</h3>
        <ul className='nav nav-tabs'>
          <li className='nav-item '>
            <button
              className={`nav-link ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => filterVacationRequests('pending')}
              style={{ color: '#93C0A4' }}
            >
              Pending
            </button>
          </li>
          <li className='nav-item btn-bgc'>
            <button
              className={`nav-link ${activeTab === 'accepted' ? 'active' : ''}`}
              onClick={() => filterVacationRequests('accepted')}
              style={{ color: '#93C0A4' }}
            >
              Accepted
            </button>
          </li>
          <li className='nav-item btn-bgc'>
            <button
              className={`nav-link ${activeTab === 'declined' ? 'active' : ''}`}
              onClick={() => filterVacationRequests('declined')}
              style={{ color: '#93C0A4' }}
            >
              Declined
            </button>
          </li>
        </ul>
        {filteredRequests.length > 0 ? (
          <ul className='list-unstyled'>
            {filteredRequests.map((request) => (
              <li key={request._id} className='border p-3 mb-3'>
                <div>
                  <strong>Employee:</strong> {request.fname} {request.lname}
                </div>
                <div>
                  <strong>From:</strong> {request.dayFrom}/{request.monthFrom}
                </div>
                <div>
                  <strong>To:</strong> {request.dayTo}/{request.monthTo}
                </div>
                <div onClick={() => handleToggleReason(request._id)}>
                  <strong>Reason: </strong>
                  {expandedRequestId === request._id
                    ? request.reason
                    : `${request.reason.substring(0, 3)}...`}
                </div>
                <div className='mt-3'>
                  {request.status === 'pending' && (
                    <>
                      <button className='btn btn-success me-2' onClick={() => handleAccept(request._id)}>
                        Accept
                      </button>
                      <button className='btn btn-danger' onClick={() => handleDecline(request._id)}>
                        Decline
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No vacation requests</p>
        )}
      </div>
    </div>
  );
}

export default Home;
