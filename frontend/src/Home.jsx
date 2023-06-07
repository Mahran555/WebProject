import axios from 'axios';
import Chart from "react-apexcharts";
import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faDollarSign, faMoneyBillAlt,faClock  } from '@fortawesome/free-solid-svg-icons';
import { ThreeDots } from "react-loader-spinner";
import './CssFiles/home.css'
function Home() {
  const [expandedRequestId, setExpandedRequestId] = useState(null);
  const [employeeCount, setEmployeeCount] = useState();
  const [salary, setSalary] = useState();
  const [averageSalary, setAverageSalary] = useState(0);
  const [managerName, setManager] = useState(null);
  const [vacationRequests, setVacationRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true); // Initial loading state
    // State for the salary chart

  const [state, setState] = useState({
    series: [{
      name: 'Income ($)',
      type: 'column',
      data: []
    }, {
      name: 'Average Salary ($)',
      type: 'line',
      data: []
    }],
    options: {
     // Chart configuration options

      chart: {
        height: 350,
        type: 'line',
        stacked: false
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: [1, 20, 4],
        curve:'straight'
      },
      title: {
        text: 'Salary Chart - Last Month',
        align: 'left',
        offsetX: 110
      },
      xaxis: {
        categories: ['Naomi', 'Steve'],
      },
      yaxis: [
        {
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#008FFB'
          },
          labels: {
            formatter: function (val) {
              return val.toFixed(0);
            },
            style: {
              colors: '#008FFB',
            }
          },
          title: {
            text: "Income ($)",
            align: 'left',
            style: {
              color: '#008FFB',
            }
          },
          tooltip: {
            enabled: true
          }
        },
        {
          seriesName: 'Income',
          opposite: true,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#00E396'
          },
          labels: {
            formatter: function (val) {
              return val.toFixed(0);
            },
            style: {
              colors: '#00E396',
            }
          },
        },
        
      ],
      tooltip: {
        fixed: {
          enabled: true,
          position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
          offsetY: 30,
          offsetX: 60
        },
      },
      legend: {
        horizontalAlign: 'left',
        offsetX: 40
      }
    }
  });
    // State for the shifts chart

  const [chart2Data, setChart2Data] = useState({
    series: [{
      name: 'Workers in Morning Shift',
      type: 'line',
      data: []
    },{
      name: 'Workers in Evening Shift',
      type: 'line',
      data: []
    }

    ],
    options: {
    // Chart configuration options
      chart: {
        height: 350,
        type: 'line',
        stacked: false
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: [10, 10, 15],
        curve:'straight'
      },
      title: {
        text: 'Number of Shifts in Months',
        align: 'left',
        fontSize: 25,
        offsetX: 110,
        margin: 35 // Add margin to the left of the title
      },
      xaxis: {
        categories: ['January',  'February',  'March',  'April',  'May',  'June',  'July',  'August',  'September',  'October',  'November',  'December']
      },
      yaxis: [
        {
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#008FFB'
          },
          labels: {
            formatter: function (val) {
              return val.toFixed(0);
            },
            style: {
              colors: '#008FFB',
            }
          },
          title: {
            text: "Shifts (#)",
            align: 'left',
            style: {
              color: '#008FFB',
            }
          },
          tooltip: {
            enabled: true
          }
        },
        {
          seriesName: 'Income',
          opposite: true,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#00E396'
          },
          labels: {
            formatter: function (val) {
              return val.toFixed(0);
            },
            style: {
              colors: '#00E396',
            }
          },
        },
        
      ],
      tooltip: {
        fixed: {
          enabled: true,
          position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
          offsetY: 30,
          offsetX: 60
        },
      },
      legend: {
        horizontalAlign: 'left',
        offsetX: 40
      }
    }
  });

  
  
  // Fetch initial data from the server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeeCountPromise = axios.get('http://localhost:5000/employeeCount');
        const managerPromise = axios.get('http://localhost:5000/getManager');
        const salariesPromise = axios.get('http://localhost:5000/salaries');
        const vacationRequestsPromise = axios.get('http://localhost:5000/vacationRequests');
        const ShiftsCountPromise=axios.get('http://localhost:5000/shiftsCount');

        const [employeeCountRes, managerRes, salariesRes, vacationRequestsRes,ShiftsCountRes] = await Promise.all([
          employeeCountPromise,
          managerPromise,
          salariesPromise,
          vacationRequestsPromise,
          ShiftsCountPromise,
        ]);

        // Set employee count
        setEmployeeCount(employeeCountRes.data.count);

        // Set manager name
        if (managerRes.data.Status === 'Success') {
          setManager(managerRes.data.Result.lname);
        }

        // Set total salary and average salary

        let sum = salariesRes.data.Salaries.reduce((a, b) => a + b, 0);
        setSalary(sum);
        // Set average salary
        setAverageSalary(sum / salariesRes.data.Salaries.length);
        // Update state for salary chart
        setState(prevState => ({
          ...prevState,
          options: {
            ...prevState.options,
            xaxis: {
              ...prevState.options.xaxis,
              categories: salariesRes.data.Names // Updated categories here
            }
          },
          series: [
            {
              ...prevState.series[0],
              data: salariesRes.data.Salaries
            },
            {
              ...prevState.series[1],
              data: Array(salariesRes.data.Salaries.length).fill(sum / salariesRes.data.Salaries.length)
            }
          ]
        }));
        //put shifts data into graph
        setChart2Data(prevState => ({
          ...prevState,
          series: [
            {
              ...prevState.series[0],
              data: ShiftsCountRes.data.MorningShifts
            },
            {
              ...prevState.series[1],
              data: ShiftsCountRes.data.EveningShifts
            }
          ]
        }));
        // Set vacation requests
        setVacationRequests(vacationRequestsRes.data.Result);

        setLoading(false); // Set loading to false when data has been fully loaded
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);
  // Update vacation requests when the vacationRequests state changes

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
  // Render loading spinner if data is still loading
  if (loading) {
    return (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
      <ThreeDots color="#0b0436" height={50} width={50} />
    </div>
    );
  }
// Handle accepting a vacation request
const handleAccept = async (id) => {
  try {
    await axios.put(`http://localhost:5000/vacationRequests/${id}`, { status: 'accepted' });
    console.log('Accepted vacation request with ID:', id);

      // Update the state with the declined request
      setVacationRequests(prevRequests => prevRequests.map(request => {
      if (request._id === id) {
        return {...request, status: 'accepted'};
      }
      return request;
    }));

  } catch (error) {
    console.error('Error accepting vacation request:', error);
  }
};
// Handle declining a vacation request
const handleDecline = async (id) => {
  try {
    await axios.put(`http://localhost:5000/vacationRequests/${id}`, { status: 'declined' });
    console.log('Declined vacation request with ID:', id);

    // Update the state with the declined request
    setVacationRequests(prevRequests => prevRequests.map(request => {
      if (request._id === id) {
        return {...request, status: 'declined'};
      }
      return request;
    }));

  } catch (error) {
    console.error('Error declining vacation request:', error);
  }
};
// Filter vacation requests based on status
  const filterVacationRequests = (status) => {
    setActiveTab(status);
  };
  // Toggle expanding/collapsing the reason for a vacation request

  const handleToggleReason = (id) => {
    setExpandedRequestId((prevId) => (prevId === id ? null : id));
  };
  // Filter vacation requests based on activeTab

  const filteredRequests = vacationRequests.filter((request) => request.status === activeTab);

  return (
    <div>
      <div className='p-3 text-center'>
        <h1 id='homeTitle' style={{ fontSize: '2.5rem' }}>Welcome Back Mr.{managerName}</h1>
        <hr style={{ margin: '20px auto', width: '50%' }} />
      </div>

      <div className='fcContainer'>
        <div id='cardsContainer'>
          <div id='firstCard' className='cardDiv first blue'>
            <div className='cardDetails'>
              <span className='cardTitle'>Employees </span>
              <span className='cardStat'>{employeeCount.toFixed(0)}</span>
            </div>
            <div className='cardIcon'>
              <h1><FontAwesomeIcon icon={faUser}/></h1>
            </div>
          </div>
          <div className='cardDiv orange'>
            <div className='cardDetails'>
              <span className='cardTitle'>Average Salary</span>
              <span className='cardStat'>{averageSalary.toFixed(2)}$</span>
            </div>
            <div className='cardIcon'>
              <h1><FontAwesomeIcon icon={faMoneyBillAlt}/></h1>
            </div>
          </div>
          <div className='cardDiv red'>
            <div className='cardDetails'>
              <span className='cardTitle'>Total Salaries</span>
              <span className='cardStat'>{salary.toFixed(0)}$</span>
            </div>
            <div className='cardIcon'>
              <h1><FontAwesomeIcon icon={faDollarSign}/></h1>
            </div>
          </div>
          <div className='cardDiv purple'>
            <div className='cardDetails'>
              <span className='cardTitle'>Pending Requests</span>
              <span className='cardStat'>{vacationRequests.filter((request) => request.status === 'pending').length.toFixed(0)}</span>
            </div>
            <div className='cardIcon'>
              <h1><FontAwesomeIcon icon={faClock}/></h1>
            </div>
          </div>
        </div>
        <div id='chartsContainer'>
          <div id='leftChart'>
            <Chart
              options={state.options}
              series={state.series}
              type="bar"
            />
          </div>
          <div id='rightChart'>
            <Chart
              options={chart2Data.options}
              series={chart2Data.series}
              type="area"
            />
          </div>
        </div>
        <div id='vacationsContainer'>
          <h2>Vacation Requests</h2>
          <div id='filterDiv'>
            <span id='labelfilter' className='filterSpan'>Filter: </span>
            <div id='selectFilter'>
            <Form.Select className='filterSelect' id='status' onChange={(e) => filterVacationRequests(e.target.value)}>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="declined">Declined</option>
            </Form.Select>
            </div>
            
          </div>
          <table id='vacationsTable'>
          <tbody>
            <tr>
              <th>Name</th>
              <th>From</th>
              <th>To</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
            {filteredRequests.length > 0 ? (
              <tr>
                {filteredRequests.map((request) => (
                  <React.Fragment key={request.id}>
                    <td>{request.fname} {request.lname}</td>
                    <td>{request.dayFrom}/{request.monthFrom}</td>
                    <td>{request.dayTo}/{request.monthTo}</td>
                    <td>
                      <div onClick={() => handleToggleReason(request._id)}>
                      {expandedRequestId === request._id
                        ? request.reason
                        : `${request.reason.substring(0, 3)}...`}
                      </div>
                    </td>
                    {request.status === 'pending' && (
                    <>
                      <td className='pending'>
                      <button className='button-5 green' onClick={() => handleAccept(request._id)}>
                        Accept
                      </button>
                      <button className='button-5 red' onClick={() => handleDecline(request._id)}>
                        Decline
                      </button>
                      </td>
                    </>
                  )}
                  {request.status === 'accepted' && (
                    <>
                      <td className='accepted'>Accepted</td>
                    </>
                  )}
                  {request.status === 'declined' && (
                    <>
                      <td className='declined'>Declined</td>
                    </>
                  )}
                  </React.Fragment>
                ))}
              </tr>
            ) : (
              <p>No vacations requested </p>
            )}
              </tbody>
          </table>
        </div>
        <div style={{margin: ' 0 100px'}}>
        </div>
      </div>
    </div>
  );
}

export default Home;