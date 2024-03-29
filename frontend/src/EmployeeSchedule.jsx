import axios from 'axios';
import React, { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams } from 'react-router-dom';
import { Container, Table, Button, Alert } from 'react-bootstrap';
import { ThreeDots } from 'react-loader-spinner';
import DatePicker from 'react-datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faCalendarDay,
  faCalendarWeek,
  faUser,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import './CssFiles/EmployeeSchedule.css';

// Custom input component for DatePicker
const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
  <button className="custom-input" style={{ background: 'transparent' }} onClick={onClick} ref={ref}>
    <FontAwesomeIcon icon={faCalendarDay} style={{ color: 'black' }} />
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
  const [showVacationRequest, setShowVacationRequest] = useState(false); // State for showing/hiding vacation request container
  const ToDay = new Date().getDate();
  const [fname, setfname] = useState('');
  const [lname, setlname] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('');

  // Array of month names
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

  // Handle change in description input field
  const handleChange = (event) => {
    setDescription(event.target.value);
  };

  // Get the dates of the current week
  const getWeekDates = () => {
    const startDay = week * 7 + 1;
    const endDay = Math.min(startDay + 6, daysInMonth);
    const startDate = new Date(year, month, startDay);
    const endDate = new Date(year, month, endDay);
    return `${startDate.getDate()} ${currentMonth} - ${endDate.getDate()} ${currentMonth}`;
  };

  // Fetch employee schedule and details from the server
  useEffect(() => {
    axios
      .get('http://localhost:5000/employeeSchedule/' + id)
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
      .get('http://localhost:5000/getInfo/' + id)
      .then((res) => {
        if (res.data.Status === 'Success') {
          setfname(res.data.Result.fname);
          setlname(res.data.Result.lname);
        }
      })
      .catch((err) => {
        console.log('failed to fetch employee details');
      });
  }, [id, week]);

  // Handle week change (previous or next week)
  const handleWeekChange = (direction) => {
    const newWeek = week + direction;
    if (newWeek >= 0 && newWeek <= Math.floor((daysInMonth - 1) / 7)) {
      setWeek(newWeek);
    }
  };

  // Submit vacation request
  const submitVacationRequest = () => {
    if (!selectedDateFrom || !selectedDateTo || !description) {
      showAlert('Please fill in all the required fields', 'danger');
      return;
    }

    const currentDate = new Date();
    const selectedFromDate = new Date(selectedDateFrom);
    const selectedToDate = new Date(selectedDateTo);

    if (selectedFromDate < currentDate) {
      showAlert('Please choose a valid "From" date', 'danger');
      return;
    }

    if (selectedToDate < selectedFromDate) {
      showAlert('The "To" date should be after the "From" date', 'danger');
      return;
    }

    const request = {
      dayFrom: selectedDateFrom.getDate(),
      monthFrom: selectedDateFrom.getMonth() + 1,
      dayTo: selectedDateTo.getDate(),
      monthTo: selectedDateTo.getMonth() + 1,
      fname: fname,
      lname: lname,
      reason: description,
    };

    axios
      .post('http://localhost:5000/submitVacationRequest/' + id, request)
      .then((res) => {
        // Handle successful response
        console.log('Vacation request submitted successfully');
        showAlert('Your request has been submitted', 'success');
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

  // Show alert message
  const showAlert = (message, variant) => {
    setAlertMessage(message);
    setAlertVariant(variant);
    setTimeout(() => {
      setAlertMessage('');
      setAlertVariant('');
    }, 3000);
  };

  // Render loading spinner if data is still loading
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <ThreeDots color="#0b0436" height={50} width={50} />
      </div>
    );
  }

  // Toggle showing/hiding vacation request container
  const toggleVacationRequest = () => {
    setShowVacationRequest(!showVacationRequest);
  };

  // Generate the shifts for each day in the week
  const shiftsInWeek = [...Array(7)].map((_, day) => {
    const currentDay = week * 7 + day + 1;
    const morningShift = data.find((shift) => shift.day === currentDay && shift.shift === 'morning');
    const eveningShift = data.find((shift) => shift.day === currentDay && shift.shift === 'evening');

    return { day: currentDay, morningShift, eveningShift };
  });

  return (
    <>
      {alertMessage && <Alert variant={alertVariant}>{alertMessage}</Alert>}

      <h1 id="eSchT" className="title-employee-sch">
        Schedule
      </h1>
      <hr className="divider-title-employee-sch" />

      <div className="vacation-request-container">
        <div className="dropdown">
          <button className="dropdown-toggle" type="button" onClick={toggleVacationRequest}>
            Vacation Request
          </button>
          {showVacationRequest && (
            <div className="dropdown-menu show">
              <h2 className="text-center">Vacation Request</h2>

              <div id="datesContainer">
                <div id="dateSelectRow">
                  <div className="dateTitle">
                    <span>From: </span>
                    <DatePicker
                      selected={selectedDateFrom}
                      onChange={(date) => setSelectedDateFrom(date)}
                      dateFormat="yyyy/MM/dd"
                      isClearable
                      showYearDropdown
                      scrollableMonthYearDropdown
                      customInput={<CustomInput />}
                    />
                    {selectedDateFrom && (
                      <span className="selected-date">{selectedDateFrom.toLocaleDateString()}</span>
                    )}
                  </div>
                  <div></div>
                  <div className="dateTitle">
                    <span>To: </span>
                    <DatePicker
                      selected={selectedDateTo}
                      onChange={(date) => setSelectedDateTo(date)}
                      dateFormat="yyyy/MM/dd"
                      isClearable
                      showYearDropdown
                      scrollableMonthYearDropdown
                      customInput={<CustomInput />}
                    />
                    {selectedDateTo && <span className="selected-date">{selectedDateTo.toLocaleDateString()}</span>}
                  </div>
                  <div></div>
                </div>
              </div>

              <div id="Reason" className="textw">
                <p className="reason">Reason:</p>
                <textarea
                  className="has-fixed-size"
                  value={description}
                  onChange={handleChange}
                  rows="8"
                  cols="80"
                  placeholder="Enter reason here..."
                />
              </div>

              <div id="MakeRequest">
                <button id="button-20" onClick={submitVacationRequest}>
                  Submit Request
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="cardsContainer-sch-empl">
        <div className="cardDiv first blue">
          <div className="cardDetails-sch-empl">
            <span className="cardTitle-sch-empl">Week</span>
            <span className="cardStat">{getWeekDates()}</span>
          </div>
          <div className="cardIcon">
            <h1>
              <FontAwesomeIcon icon={faCalendarWeek} />
            </h1>
          </div>
        </div>
        <div className="cardDiv orange">
          <div className="cardDetails-sch-empl">
            <span className="cardTitle-sch-empl">Today</span>
            <span className="cardStat">
              {ToDay} of {currentMonth}
            </span>
          </div>
          <div className="cardIcon-sch-empl">
            <h1>
              <FontAwesomeIcon icon={faCalendarDay} />
            </h1>
          </div>
        </div>
      </div>

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
              <br />
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
                  const currentDay = week * 7 + day + 1;
                  if (currentDay > daysInMonth) {
                    return null;
                  }
                  return <th key={day}>Day {currentDay}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="morning-shift-empl">Morning Shift</td>
                {shiftsInWeek.map((shift) => (
                  <td key={`morning-${shift.day}`} className="shift-cell">
                    {shift.morningShift && <FontAwesomeIcon icon={faCheck} />}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="evening-shift-empl">Evening Shift</td>
                {shiftsInWeek.map((shift) => (
                  <td key={`evening-${shift.day}`} className="shift-cell">
                    {shift.eveningShift && <FontAwesomeIcon icon={faCheck} />}
                  </td>
                ))}
              </tr>
            </tbody>
          </Table>
        </div>
      </Container>
    </>
  );
}

export default EmployeeSchedule;
