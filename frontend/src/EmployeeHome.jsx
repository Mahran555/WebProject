import axios from 'axios';
import Chart from "react-apexcharts";
import ReactApexChart from 'react-apexcharts';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  useParams } from 'react-router-dom'
import {  faDollarSign, faMoneyBillAlt, faBriefcaseClock, faCalendarDay, faCalendarDays, faMoneyCheckDollar } from '@fortawesome/free-solid-svg-icons';
import { ThreeDots } from "react-loader-spinner";

import './CssFiles/home.css'

function EmployeeHome() {
  const {id} = useParams();// Get the 'id' parameter from the URL
  const [daysCount, setDaysCount] = useState(); // State for storing the count of work days this month
  const [employeeData, setEmployeesetData] = useState({// State for storing employee data
    id:'',
    fname: '',
    lname: '',
    email: '',
    password: '',
    address: '',
    salary: '',
    phone:'',
    image: ''
     })
  const [loading, setLoading] = useState(true); // Initial loading state       
  const [state, setState] = useState({
          series: [{
            name: 'Work hours',
            type: 'column',
            data: []
          }],
          options: {
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
              text: 'Work Hours Last Months',
              align: 'left',
              offsetX: 110
            },
            xaxis: {
               categories: [  'January',  'February',  'March',  'April',  'May',  'June',  'July',  'August',  'September',  'October',  'November',  'December'],
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
                  text: "Work Hours",
                  style: {
                    color: '#008FFB',
                  }
                },
                tooltip: {
                  enabled: true
                }
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
        const [seriesData, setSeriesData] = useState([]);
        const chartOptions = {
          title: {
            text: 'Working Days per Months',
            align: 'center',
            offsetX: 110
          },
          chart: {
            type: 'donut',
          },
          labels: ['Work Day', 'Day off'],
          series: seriesData,
          colors: [ '#00E396',  '#FF4560'],
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 200,
                },
                legend: {
                  position: 'bottom',
                },
              },
            },
          ],
        };
       
        


useEffect(() => {
 
  const fetchData = async () => {
    try {
      const daysCountPromise = axios.get('http://localhost:5000/daysCount/'+id)//work hours this month
      const employeePromise = axios.get('http://localhost:5000/getInfo/' + id)
      
      const [daysCountRes, employeeRes] = await Promise.all([
        daysCountPromise,
        employeePromise,
        
      ]);

      // Count work days this month
      setDaysCount(daysCountRes.data.ThisMonth);
      // employee info 
      if (employeeRes.data.Status === 'Success') {
        setEmployeesetData({...employeeData, id: employeeRes.data.Result.id,
                           fname: employeeRes.data.Result.fname,
                           lname:employeeRes.data.Result.lname,
                           email: employeeRes.data.Result.email,
                           password: employeeRes.data.Result.password,
                           address:employeeRes.data.Result.address,
                           salary: employeeRes.data.Result.salary,
                           phone: employeeRes.data.Result.phone,
                           image: employeeRes.data.Result.image
          
         });
      }
      setState(prevState => ({
        ...prevState,
        series: [
          {
            ...prevState.series[0],
            data: daysCountRes.data.AllMonths 
          }
        ]
      }));//put it into graph
      //get the current month's length
      const date = new Date();
      const month = date.getMonth();
      const year = date.getUTCFullYear();
       const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
      const newData = [daysCountRes.data.ThisMonth, (lastDayOfMonth-daysCountRes.data.ThisMonth)];
    setSeriesData(newData);
      setLoading(false); // Set loading to false when data has been fully loaded
    } catch (err) {
      console.log(err);
    }
  };

  fetchData();
}, []);

if (loading) {
  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
    <ThreeDots color="#0b0436" height={50} width={50} />
  </div>
    );
  }
 
  return (
    <div>
      <div className='p-3 text-center'>
        <h1 id='homeTitle' style={{ fontSize: '2.5rem' }}>Welcome Back {employeeData.fname} </h1>
        <hr style={{ margin: '20px auto', width: '50%' }} />
      </div>

       <div className='container mt-5'>
        <div id='cardsContainerEmp'>
          <div id ='firstCardEmp' className='first blue widecard cardDiv '>
            <div className='cardDetails'>
              <span className='cardTitle'>Work Days This Month </span>
              <span className='cardStat'>{daysCount.toFixed(0)}</span>
            </div>
            <div className='cardIcon'>
              <h1><FontAwesomeIcon icon={faCalendarDays}/></h1>
            </div>
          </div>
          <div className='cardDiv orange'>
            <div className='cardDetails'>
              <span className='cardTitle'>Salary</span>
              <span className='cardStat'>{employeeData.salary.toFixed(0)}$</span>
            </div>
            <div className='cardIcon'>
              <h1><FontAwesomeIcon icon={faDollarSign}/></h1>
            </div>
          </div>
          <div className='cardDiv purple widecard'>
            <div className='cardDetails'>
              <span className='cardTitle'>Work Hours This Month</span>
              <span className='cardStat'>{daysCount*8..toFixed(0)}h</span>
            </div>
            <div className='cardIcon'>
              <h1><FontAwesomeIcon icon={faBriefcaseClock}/></h1>
            </div>
          </div>
        </div>
        
      </div>
        <div id='chartsContainerEmp'>
          <div id='leftChart'>
            <Chart
              options={state.options}
              series={state.series}
              type="bar"height={560}
            />
          </div>
          <div id="rightChart">
            <ReactApexChart options={chartOptions} series={chartOptions.series} type="donut" height={500} />
          </div>
        </div>
      
    </div>
  );
}

export default EmployeeHome
