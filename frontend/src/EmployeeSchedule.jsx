import axios from 'axios';
import React, { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams } from 'react-router-dom';
import { Container, Table, Button } from 'react-bootstrap';
import { ThreeDots } from 'react-loader-spinner';
import DatePicker from 'react-datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faCalendarDay, faCalendarWeek, faUser } from '@fortawesome/free-solid-svg-icons';
import './EmployeeSchedule.css';

const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
  <button className="custom-input" style={{ border: 'none', backgroundColor: 'white' }} onClick={onClick} ref={ref}>
    {value}
    <i className="bi bi-calendar" style={{ backgroundColor: 'white' }}></i>
  </button>
));

function EmployeeSchedule() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth());
  const [week, setWeek] = useState(Math.floor(new Date().getDate() / 7)); // Set initial week based on current date
  const [selectedDateTo, setSelectedDateTo] = useState(null);
  const [selectedDateFrom, setSelectedDateFrom] = useState(null);
  const [description, setDescription] = useState('');
  const ToDay = new Date().getDate();
  const [fname, setfname] = useState('');
  const [lname, setlname] = useState('');

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const currentMonth = months[new Date().getMonth()];
  const year = new Date().getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handleChange = (event) => {
    setDescription(event.target.value);
  };

  const getWeekDates = () => {
    const startDay = week * 7 + 1;
    const endDay = Math.min(startDay + 6, daysInMonth);
    const startDate = new Date(year, month, startDay);
    const endDate = new Date(year, month, endDay);
    return `${startDate.getDate()} ${currentMonth} - ${endDate.getDate()} ${currentMonth}`;
  };

  useEffect(() => {

    axios
      .get('http://localhost:5000/employeeSchedule/'+id)
      .then((res) => {
        if (res.data.Status === 'Success') {
          setData(res.data.Result);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log('failed');
        setLoading(false);
      });

    axios
      .get('http://localhost:5000/getInfo/'+id)
      .then((res) => {
        if (res.data.Status === 'Success') {
          setfname(res.data.Result.fname);
          setlname(res.data.Result.lname)
        }
      })
      .catch((err) => {
        console.log('failed to fetch employee details');
      });
  }, [id, week]);

  const handleWeekChange = (direction) => {
    const newWeek = week + direction;
    if (newWeek >= 0 && newWeek <= Math.floor((daysInMonth - 1) / 7)) {
      setWeek(newWeek);
    }
  };

  const submitVacationRequest = () => {
    if (!selectedDateFrom || !selectedDateTo) {
      console.log('Please select both From and To dates');
      return;
    }
  
    const request = {
      dayFrom: selectedDateFrom.getDate(),
      monthFrom: selectedDateFrom.getMonth()+1,
      dayTo: selectedDateTo.getDate(),
      monthTo: selectedDateTo.getMonth()+1,
      fname: fname,
      lname: lname,
      reason: description,
    };
  
    axios
      .post('http://localhost:5000/submitVacationRequest/'+id, request)
      .then((res) => {
        // Handle successful response
        console.log('Vacation request submitted successfully');
        // Reset form fields
        setSelectedDateFrom(null);
        setSelectedDateTo(null);
        setDescription('');
      })
      .catch((err) => {
        // Handle error
        console.log('Failed to submit vacation request');
      });
  };
  const shiftsInWeek = data.filter((shift) => Math.floor(shift.day / 7) === week);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <ThreeDots color="#0b0436" height={50} width={50} />
      </div>
    );
  }

  return (
    <>
      <div id="cardsContainer-sch-empl">
        <div className="cardDiv first blue">
          <div className="cardDetails-sch-empl">
            <span className="cardTitle-sch-empl">Today</span>
            <span className="cardStat">{ToDay} of {currentMonth}</span>
          </div>
          <div className="cardIcon-sch-empl">
            <h1><FontAwesomeIcon icon={faCalendarDay} /></h1>
          </div>
        </div>
        <div className="cardDiv orange">
          <div className="cardDetails-sch-empl">
            <span className="cardTitle-sch-empl">Week</span>
            <span className="cardStat">{getWeekDates()}</span>
          </div>
          <div className="cardIcon">
            <h1><FontAwesomeIcon icon={faCalendarWeek} /></h1>
          </div>
        </div>
      </div>
      <h1 className="title-employee-sch">Schedule</h1>
      <hr className="divider-title-employee-sch" />
      <Container className="container-for-sch-empl">
        <div className="schedule-container-empl">
          <div className="schedule-header-empl">
            <div className="schedule-header-iconleft-empl" onClick={() => handleWeekChange(-1)}>
              <FontAwesomeIcon
                icon={faChevronLeft}
                size="lg"
                className={`button-icon ${week <= 0 ? 'disabled' : ''}`}
              />
            </div>
            <div className="schedule-header-month-empl">
              <h2 className="current-mon">{currentMonth}</h2>
              <br></br>
              <hr className="calendar-div-empl"></hr>

            </div>
            <div className="schedule-header-iconright-empl" onClick={() => handleWeekChange(1)}>
              <FontAwesomeIcon
                icon={faChevronRight}
                size="lg"
                className={`button-icon ${((week + 1) * 7) >= daysInMonth ? 'disabled' : ''}`}
              />
            </div>
          </div>
          <Table striped bordered hover>
            <thead>
              <tr className="theading">
                <th></th> {/* Empty cell for spacing */}
                {[...Array(7)].map((_, day) => {
                  const currentDay = week * 7 + day;
                  if (currentDay >= daysInMonth) {
                    return null;
                  }
                  return <th key={day}>Day {currentDay + 1}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {['morning', 'evening'].map((shiftType) => {
                return (
                  <tr key={shiftType}>
                    <td>{shiftType.charAt(0).toUpperCase() + shiftType.slice(1)} Shift</td>
                    {[...Array(7)].map((_, day) => {
                      const currentDay = week * 7 + day;
                      if (currentDay >= daysInMonth) {
                        return null;
                      }
                      const shifts = shiftsInWeek.filter((shift) => shift.day === currentDay + 1);
                      return (
                        <td key={currentDay} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                          {shifts.find((shift) => shift.shift === shiftType) ? 'V' : ''}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>

        <div className="vacation-request-container">
          <h2 className="text-center">Vacation Request</h2>

          <div className="container text-center mt-5">
            <div className="row justify-content-center">
              <div className="col-auto">
                <p className="mb-0">From:</p>
              </div>
              <div className="col-auto">
                <DatePicker
                  selected={selectedDateFrom}
                  onChange={(date) => setSelectedDateFrom(date)}
                  dateFormat="yyyy/MM/dd"
                  isClearable
                  showYearDropdown
                  scrollableMonthYearDropdown
                  customInput={<CustomInput />}
                />
              </div>
              <div className="col-auto ms-5">
                <p className="mb-0">To:</p>
              </div>
              <div className="col-auto">
                <DatePicker
                  selected={selectedDateTo}
                  onChange={(date) => setSelectedDateTo(date)}
                  dateFormat="yyyy/MM/dd"
                  isClearable
                  showYearDropdown
                  scrollableMonthYearDropdown
                  customInput={<CustomInput />}
                />
              </div>
            </div>
          </div>

          <div id="Reason" className="text-center mt-4">
            <p className="mb-1">Reason:</p>
            <textarea
              value={description}
              onChange={handleChange}
              rows="8"
              cols="80"
              placeholder="Enter reason here..."
            />
          </div>

          <div id="MakeRequest" className="text-center mt-3">
            <button className="button-sch-empl" onClick={submitVacationRequest}>
              Submit Request
            </button>
          </div>
        </div>
      </Container>
    </>
  );
}

export default EmployeeSchedule;
