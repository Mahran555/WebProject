import axios from 'axios';
import Chart from "react-apexcharts";
import ReactApexChart from 'react-apexcharts';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  useParams } from 'react-router-dom'
import {  faDollarSign, faMoneyBillAlt, faBriefcaseClock, faCalendarDay, faCalendarDays, faMoneyCheckDollar } from '@fortawesome/free-solid-svg-icons';
import { ThreeDots } from "react-loader-spinner";

import './home.css'

function EmployeeHome() {
  const {id} = useParams();
  const [daysCount, setDaysCount] = useState();
  const [employeeData, setEmployeesetData] = useState({
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
        <h1 style={{ fontSize: '2.5rem', color: '#0b0436' }}>Welcome Back {employeeData.fname} </h1>
        <hr style={{ margin: '20px auto', width: '50%' }} />
      </div>

       <div class='container mt-5'>
        <div id='cardsContainer'>
          <div class='cardDiv first blue'>
            <div class='cardDetails'>
              <span class='cardTitle'>Work Days This Month </span>
              <span class='cardStat'>Total: {daysCount}</span>
            </div>
            <div class='cardIcon'>
              <h1><FontAwesomeIcon icon={faCalendarDays}/></h1>
            </div>
          </div>
          <div class='cardDiv orange'>
            <div class='cardDetails'>
              <span class='cardTitle'>Salary</span>
              <span class='cardStat'>{employeeData.salary}$</span>
            </div>
            <div class='cardIcon'>
              <h1><FontAwesomeIcon icon={faDollarSign}/></h1>
            </div>
          </div>
          <div class='cardDiv purple'>
            <div class='cardDetails'>
              <span class='cardTitle'>Work Hours This Month</span>
              <span class='cardStat'>Total:{daysCount*8}h</span>
            </div>
            <div class='cardIcon'>
              <h1><FontAwesomeIcon icon={faBriefcaseClock}/></h1>
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
          <div id="rightChart">
            <ReactApexChart options={chartOptions} series={chartOptions.series} type="donut" height={300} />
          </div>
        </div>
        
      </div>
      
    </div>
  );
}

export default EmployeeHome
