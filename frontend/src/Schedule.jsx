import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Select from 'react-select';
import { Link } from 'react-router-dom';
import { Form, Container, Table, Button } from 'react-bootstrap';


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
    const selectedValues = selectedOptions.map(option => ({ id: option.value, day, month, shift }));
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        [shift]: selectedValues
      }
    });
  };

  const handleWeekChange = (direction) => {
    setWeek(week + direction);
  };

  const handleSubmit = (event) => {
    console.log(schedule);
    event.preventDefault();

    console.log('Sending the following schedule to the server:', schedule);
    axios.post('http://localhost:5000/saveSchedule', schedule)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => console.log(err));
  };
  

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Month: </Form.Label>
          <Form.Control type="number" min="1" max="12" value={month + 1} onChange={(e) => setMonth(Number(e.target.value) - 1)} />
        </Form.Group>

        <Button onClick={() => handleWeekChange(-1)} disabled={week <= 0}>Previous Week</Button>
        <Button onClick={() => handleWeekChange(1)} disabled={(week + 1) * 7 >= daysInMonth}>Next Week</Button>

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
                          options={data.map(employee => ({ label: employee.fname, value: employee.fname }))}
                          value={(schedule[currentDay]?.shift1 || []).map(value => ({ label: value.id, value: value.id }))}
                          onChange={(selectedOptions) => handleWorkerChange(currentDay, 'shift1', selectedOptions)}
                        />
                      </td>
                      <td>
                        <Select
                          isMulti
                          options={data.map(employee => ({ label: employee.fname, value: employee.fname }))}
                          value={(schedule[currentDay]?.shift2 || []).map(value => ({ label: value.id, value: value.id }))}
                          onChange={(selectedOptions) => handleWorkerChange(currentDay, 'shift2', selectedOptions)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>

            <Button variant="primary" type="submit">Save Schedule</Button>
          </>
        ) : (
          <p>No workers avaiable</p>
        )}
      </Form>
    </Container>
  );
}

export default Schedule;
