import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { Container, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import './schedule.css';

const Schedule = () => {
  const [month, setMonth] = useState(new Date().getMonth());
  const [week, setWeek] = useState(0);
  const [schedule, setSchedule] = useState({});
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:5000/getEmployee')
      .then((res) => {
        if (res.data.Status === 'Success') {
          setData(res.data.Result);
        }
      })
      .catch(err => console.log('failed'));
  }, []);

  const currentMonth = new Date().getMonth() + 1;
  const year = new Date().getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handleWorkerChange = (day, shift, selectedOptions) => {
    const selectedValues = selectedOptions.map(option => option.value);
    if (day >= daysInMonth) {
      return;
    }
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        [shift]: selectedValues
      }
    });
  };

  const handleWeekChange = direction => {
    const newWeek = week + direction;
    const newWeekDays = (newWeek + 1) * 7;
    if (newWeek >= 0 && newWeekDays <= daysInMonth + 7) {
      setWeek(newWeek);
    }
  };

  return (
    <>
      <Container className='container'>
        <h1 className='title'>Work Schedule</h1>
        <hr className='divider-title' />

        <div className='infoCard'>
          <h2 className='cardTitle'>Month</h2>
          <div className='monthList'>
            {[...Array(12)].map((_, index) => (
              <div
                key={index}
                className={`monthItem ${index === currentMonth - 1 ? 'currentMonth' : ''}`}
                onClick={() => setMonth(index)}
              >
                <FontAwesomeIcon icon={faCalendarAlt} />
                <span className='monthNumber'>{index + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <br />
        <br />

        <div id='schdlTable'>
        <div className='button-container'>
          <FontAwesomeIcon
            icon={faChevronLeft}
            size="lg"
            className={`button-icon ${week <= 0 ? 'disabled' : ''}`}
            onClick={() => handleWeekChange(-1)}
          />
          <FontAwesomeIcon
            icon={faChevronRight}
            size="lg"
            className={`button-icon ${((week + 1) * 7) >= daysInMonth ? 'disabled' : ''}`}
            onClick={() => handleWeekChange(1)}
          />
          </div>

          {data.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr className='theading'>
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
                {[...Array(2)].map((_, shiftIndex) => (
                  <tr className='spaceout' key={shiftIndex}>
                    {[...Array(7)].map((_, dayIndex) => {
                      const currentDay = week * 7 + dayIndex;
                      if (currentDay >= daysInMonth) {
                        return null;
                      }
                      return (
                        <td key={dayIndex} className="white-bg">
                          <label>Shift {shiftIndex + 1}: </label>
                          <Select
                            isMulti
                            options={data.map(employee => ({
                              label: employee.fname,
                              value: employee.fname
                            }))}
                            value={
                              (schedule[currentDay]?.[`shift${shiftIndex + 1}`] || []).map(
                                value => ({ label: value, value })
                              )
                            }
                            onChange={selectedOptions =>
                              handleWorkerChange(
                                currentDay,
                                `shift${shiftIndex + 1}`,
                                selectedOptions
                              )
                            }
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No workers available</p>
          )}
        </div>
      </Container>

      <div className='submitContainer'>
        <button className='button-5' id='submitSch' type='submit'>
          Save Schedule
        </button>
      </div>
    </>
  );
};

export default Schedule;
