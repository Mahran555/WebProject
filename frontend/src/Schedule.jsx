import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Select from 'react-select';
import { Link } from 'react-router-dom';
import { Form, Container, Table, Button } from 'react-bootstrap';
import "../src/Theme.css"


const Schedule = () => {
  const [month, setMonth] = useState(new Date().getMonth());
  const [week, setWeek] = useState(0);
  const [schedule, setSchedule] = useState({});
  const [data, setData] = useState({
    EmployeeID: [],
    day: '',
    month: '',
    shift: ''

},[])
  useEffect(() => {
    axios.get('http://localhost:5000/getEmployee')
      .then((res) => {
        if (res.data.Status === "Success") {
          setData(res.data.Result);
        }
      })
      .catch(err => console.log("faild"));
  }, [])

  const daysInMonth = new Date(new Date().getFullYear(), month + 1, 0).getDate();

  const handleWorkerChange = (day, shift, selectedOptions) => {
    const selectedValues = selectedOptions.map(option => option.value);
  
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        [shift]: selectedValues
      }
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedData = Object.entries(schedule).reduce((acc, [day, shifts]) => {
      Object.entries(shifts).forEach(([shift, employeeIDs]) => {
        acc.push({
          day: Number(day) + 1, // Add 1 to the day to make it 1-indexed
          month: month + 1, // Add 1 to the month to make it 1-indexed
          shift: shift,
          EmployeeID: employeeIDs,
        });
      });
      return acc;
    }, []);
    
    axios.post('http://localhost:5000/saveSchedule', { scheduleData: formattedData, month })
    .then(res => {
      if (res.data.Status === 'Success') {
        alert("Schedule saved successfully");
        // Clear the schedule after successful save
        setSchedule({});
      } else {
        console.log("Response status not Success: ", res.data);
        alert("Failed to save schedule due to server response");
      }
    })
    .catch(err => {
      console.log(err);
      alert("Failed to save schedule due to error: " + err.message);
      });
  };

  const handleWeekChange = (direction) => {
    setWeek(week + direction);
  };


  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Month: </Form.Label>
          <Form.Control type="number" min="1" max="12" value={month + 1} onChange={(e) => setMonth(Number(e.target.value) - 1)} />
        </Form.Group>

        <button className="btn-bgc btn-disabled-bgc btn-border-bgc text-white btn-design"  onClick={() => handleWeekChange(-1)} disabled={week <= 0}>Previous Week</button>
        <button className="btn-bgc btn-border-bgc text-white btn-design" onClick={() => handleWeekChange(1)} disabled={(week + 1) * 7 >= daysInMonth}>Next Week</button>

        {data.length > 0 ? (
          <>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Shift 1</th>
                  <th>Shift 2</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(7)].map((_, day) => {
                  const currentDay = week * 7 + day;
                  if (currentDay >= daysInMonth) {
                    return null; // Don't render rows for days outside the current month
                  }
                  return (
                    <tr key={currentDay}>
                      <td>{currentDay + 1}</td>
                      <td>
                        <Select
                          isMulti
                          options={data.map(employee => ({ label: employee.fname, value: employee.id }))}
                          value={(schedule[currentDay]?.shift1 || []).map(id => ({ label: data.find(employee => employee.id === id).fname, value: id }))}
                          onChange={(selectedOptions) => handleWorkerChange(currentDay, 'shift1', selectedOptions)}
                        />
                      </td>
                      <td>
                        <Select
                          isMulti
                          options={data.map(employee => ({ label: employee.fname, value: employee.id }))}
                          value={(schedule[currentDay]?.shift2 || []).map(id => ({ label: data.find(employee => employee.id === id).fname, value: id }))}


                          onChange={(selectedOptions) => handleWorkerChange(currentDay, 'shift2', selectedOptions)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>

            <button className="btn-bgc btn-border-bgc text-white btn-design" type="submit">Save Schedule</button>
          </>
        ) : (
          <p>No workers avaiable</p>
        )}
      </Form>
    </Container>
  );
}

export default Schedule;
//
