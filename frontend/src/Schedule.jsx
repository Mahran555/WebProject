import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { Container, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faCalendarAlt, faCalendarDay, faCalendarWeek, faUser } from '@fortawesome/free-solid-svg-icons';
import { ThreeDots } from "react-loader-spinner";


import './schedule.css';

const Schedule = () => {
  const [loading, setLoading] = useState(true); // Initial loading state
  const [month, setMonth] = useState(new Date().getMonth());
  const [week, setWeek] = useState(0);
  const [schedule, setSchedule] = useState({});
  const [data, setData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state variable
  const ToDay = new Date().getDate();

  useEffect(() => {
    axios
      .get('http://localhost:5000/getEmployee')
      .then((res) => {
        if (res.data.Status === 'Success') {
          setData(res.data.Result);
          setLoading(false); // Set loading to false when data has been fully loaded
          
        }
      })
      .catch(err => console.log('failed'));
      setLoading(false); // Set loading to false if there is an error
  }, []);
  const numEmployees = data.length;
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
    'December'
  ];

  const currentMonth = months[new Date().getMonth()];
  const year = new Date().getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const getWeekDates = () => {
    const startDay = week * 7 + 1;
    const endDay = Math.min(startDay + 6, daysInMonth);
    const startDate = new Date(year, month, startDay);
    const endDate = new Date(year, month, endDay);
    return `${startDate.getDate()} ${currentMonth} - ${endDate.getDate()} ${currentMonth}`;
  };

  const handleWorkerChange = (day, shift, selectedOptions) => {
    const selectedValues = selectedOptions.map(option => option.value);
    
    if (day >= ToDay) {
      setSchedule({
        ...schedule,
        [day]: {
          ...schedule[day],
          [shift]: selectedValues
        }
      });
    }
  };

  const handleWeekChange = direction => {
    const newWeek = week + direction;
    const newWeekDays = (newWeek + 1) * 7;
    if (newWeek >= 0 && newWeekDays <= daysInMonth + 7) {
      setWeek(newWeek);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    setIsSubmitting(true); // Set isSubmitting to true when submitting
    if (Object.keys(schedule).length === 0) {
      alert('Cannot save an empty schedule');
      setIsSubmitting(false);
      return;
    }
    const formattedData = Object.entries(schedule).reduce((acc, [day, shifts]) => {
      Object.entries(shifts).forEach(([shift, employeeIDs]) => {
        acc.push({
          day: Number(day) + 1, // Add 1 to the day to make it 1-indexed
          month: month + 1, // Add 1 to the month to make it 1-indexed
          shift: shift,
          EmployeeID: employeeIDs
        });
      });
      return acc;
    }, []);

    axios
      .post('http://localhost:5000/saveSchedule', { scheduleData: formattedData, month })
      .then(res => {
        if (res.data.Status === 'Success') {
          alert('Schedule saved successfully');
          // Clear the schedule after successful save
          setSchedule({});
        } else {
          console.log('Response status not Success: ', res.data);
          alert('Failed to save schedule due to server response');
        }
        setIsSubmitting(false); // Set isSubmitting to false after receiving the response
      })
      .catch(err => {
        console.log(err);
        alert('Failed to save schedule due to error: ' + err.message);
        setIsSubmitting(false); // Set isSubmitting to false if an error occurs
      });
  };

  const selectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: state.selectProps.menuIsOpen ? 'white' : state.isDisabled ? 'darkgrey' : 'white',
    }),
    // Add other custom styles as needed
  };
  if (loading) {
    return (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
      <ThreeDots color="#0b0436" height={50} width={50} />
    </div>
    );
  }


  return (
    <>
      <h1 className='title'>Work Schedule</h1>
      <hr className='divider-title' />
      <div id='cardsContainer'>
          <div className='cardDiv first blue'>
            <div className='cardDetails'>
              <span className='cardTitle'>Today</span>
              <span className='cardStat'>{ToDay} of {currentMonth}</span>
            </div>
            <div className='cardIcon'>
              <h1><FontAwesomeIcon icon={faCalendarDay} /></h1>
            </div>
          </div>
          <div className='cardDiv orange'>
            <div className='cardDetails'>
              <span className='cardTitle'>Week</span>
              <span className='cardStat'>{getWeekDates()}</span>
            </div>
            <div className='cardIcon'>
              <h1><FontAwesomeIcon icon={faCalendarWeek} /></h1>
            </div>
          </div>
          <div className='cardDiv purple'>
            <div className='cardDetails'>
              <span className='cardTitle'>Available employees</span>
              <span className='cardStat'>{numEmployees }</span>
            </div>
            <div className='cardIcon'>
              <h1><FontAwesomeIcon icon={faUser} /></h1>
            </div>
          </div>
        </div>
      <Container className='container-for-sch'>
        <div className='schedule-container'>
          <div className='schedule-header'>
            <div className='schedule-header-iconleft' onClick={() => handleWeekChange(-1)}>
              <FontAwesomeIcon
                icon={faChevronLeft}
                size='lg'
                className={`button-icon ${week <= 0 ? 'disabled' : ''}`}
              />
            </div>
            <div className='schedule-header-month'>
              <h2 className='current-mon'>{currentMonth}</h2>
              <br></br>
              <hr className='calendar-div'></hr> 

            </div>
            <div className='schedule-header-iconright' onClick={() => handleWeekChange(1)}>
              <FontAwesomeIcon
                icon={faChevronRight}
                size='lg'
                className={`button-icon ${((week + 1) * 7) >= daysInMonth ? 'disabled' : ''}`}
              />
            </div>
          </div>

          {data.length > 0 ? (
            <form className='form-con' onSubmit={handleSubmit}>
              <Table striped bordered hover>
                <thead>
                  <tr className='theading'>
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
                  {[...Array(2)].map((_, shiftIndex) => {
                    const shiftData = [];
                    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
                      const currentDay = week * 7 + dayIndex;
                      if (currentDay >= daysInMonth) {
                        break;
                      }
                      const isPastDay = currentDay < ToDay;
                      const selectElement = (
                        <Select
                          isMulti
                          options={data.map(employee => ({
                            label: employee.fname,
                            value: employee.id // Use the employee ID as the value
                          }))}
                          value={
                            (schedule[currentDay]?.[`shift${shiftIndex + 1}`] || []).map(value => ({
                              label: data.find(employee => employee.id === value)?.fname,
                              value
                            }))
                          }
                          onChange={selectedOptions =>
                            handleWorkerChange(currentDay, `shift${shiftIndex + 1}`, selectedOptions)
                          }
                          isDisabled={isPastDay} // Disable the dropdown for past days
                          styles={selectStyles} // Apply custom styles to the dropdown
                        />
                      );
                      shiftData.push(selectElement);
                    }
                    return (
                      <tr className='spaceout' key={shiftIndex}>
                        <td className={shiftIndex === 0 ? 'white-bg morning-shift-cell' : 'white-bg evening-shift-cell'}>
                          {shiftIndex === 0 ? <label className="morning-shift">Morning Shift</label> : <label className="evening-shift">Evening Shift</label>}
                        </td>
                        {shiftData.map((selectElement, dayIndex) => (
                          <td key={dayIndex} className='white-bg'>
                            {Array.isArray(selectElement) ? (
                              <div className='worker-container'>
                                {selectElement.map((worker, index) => (
                                  <div key={index}>{worker}</div>
                                ))}
                              </div>
                            ) : (
                              <div className='worker-container'>{selectElement}</div>
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </Table>

              <div className='submitContainer'>
                <button
                  type='submit'
                  className={`button-sch ${isSubmitting ? 'submitting' : ''}`} // Add 'submitting' class when isSubmitting is true
                  id='submitSch'
                  disabled={isSubmitting} // Disable the button when isSubmitting is true
                >
                  {isSubmitting ? 'Submitting...' : 'Save Schedule'}
                </button>
              </div>
            </form>
          ) : (
            <p>No workers available</p>
          )}
        </div>
      </Container>
    </>
  );
};

export default Schedule;
