import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Select from 'react-select';
import { Link } from 'react-router-dom'
import { Form, Container, Table, Button } from 'react-bootstrap';
import './schedule.css';


const Schedule = () => {
  const [month, setMonth] = useState(new Date().getMonth());
  const [week, setWeek] = useState(0);
  const [schedule, setSchedule] = useState({});

  const [data, setData] = useState([])

  useEffect(()=> {
    axios.get('http://localhost:5000/getEmployee')
    .then((res) => {
      if(res.data.Status === "Success") {
        setData(res.data.Result);
      }
    })
    .catch(err => console.log("faild"));
  }, [])



  const daysInMonth = new Date(new Date().getFullYear(), month + 1, 0).getDate();

  const handleWorkerChange = (day, shift, selectedOptions) => {
    const selectedValues = selectedOptions.map(option => option.value); // map to array of values
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

// ... rest of your code

//form for select _ TEST



return (
  <Container class='container'>
  <h1>Work Schedule Selection</h1>
    <Form.Group className="mb-3" id='monthSelectDiv'>
      <Form.Label id='monthLabel'>Month: </Form.Label>
      <Form.Select id='monthSelection' value={month+1} onChange={(e) => setMonth(Number(e.target.value) - 1)}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
      </Form.Select>
    </Form.Group>

    <br/>
    <br/>

    <div id='schdlTable'>
    <button class='button-5' onClick={() => handleWeekChange(-1)} disabled={week <= 0}>Previous Week</button>
    <button class='button-5' id='nextWeek' onClick={() => handleWeekChange(1)} disabled={(week + 1) * 7 >= daysInMonth}>Next Week</button>

    {data.length > 0 ? (
      <>
        <Table striped bordered hover>
          <thead>
            <tr class='theading'>
              
              {[...Array(7)].map((_, day) => {
              const currentDay = week * 7 + day;
              if (currentDay >= daysInMonth) {
                return null; // Don't render rows for days outside the current month
              }
              return (
                  <th>Day {currentDay + 1}</th>
                );
            })}
            </tr>
          </thead>
          <tbody>
            {[...Array(1)].map((_, day) => {
              const currentDay = week * 7 + day;
              if (currentDay >= daysInMonth) {
                return null; // Don't render rows for days outside the current month
              }
              return (
                <tr class='spaceout' key={week+1}>
<td>
  <label>Shift 1: </label>
  <Select
    isMulti
    options={data.map(employee => ({ label: employee.fname, value: employee.fname }))}
    value={(schedule[(week*7)]?.shift1 || []).map(value => ({ label: value, value }))}
    onChange={(selectedOptions) => handleWorkerChange((week*7), 'shift1', selectedOptions)}
  />
</td>
<td>
  
<label>Shift 1: </label>
<Select
    isMulti
    options={data.map(employee => ({ label: employee.fname, value: employee.fname }))}
    value={(schedule[(week*7)+1]?.shift1 || []).map(value => ({ label: value, value }))}
    onChange={(selectedOptions) => handleWorkerChange((week*7)+1, 'shift1', selectedOptions)}
  />
</td>
<td>
  <label>Shift 1: </label>
  <Select
    isMulti
    options={data.map(employee => ({ label: employee.fname, value: employee.fname }))}
    value={(schedule[(week*7)+2]?.shift1 || []).map(value => ({ label: value, value }))}
    onChange={(selectedOptions) => handleWorkerChange((week*7)+2, 'shift1', selectedOptions)}
  />
</td>
<td>
  <label>Shift 1: </label>
<Select
    isMulti
    options={data.map(employee => ({ label: employee.fname, value: employee.fname }))}
    value={(schedule[(week*7)+3]?.shift1 || []).map(value => ({ label: value, value }))}
    onChange={(selectedOptions) => handleWorkerChange((week*7)+3, 'shift1', selectedOptions)}
  />
</td>
<td>
  <label>Shift 1: </label>
  <Select
    isMulti
    options={data.map(employee => ({ label: employee.fname, value: employee.fname }))}
    value={(schedule[(week*7)+4]?.shift1 || []).map(value => ({ label: value, value }))}
    onChange={(selectedOptions) => handleWorkerChange((week*7)+4, 'shift1', selectedOptions)}
  />
</td>
<td>
  <label>Shift 1: </label>
<Select
    isMulti
    options={data.map(employee => ({ label: employee.fname, value: employee.fname }))}
    value={(schedule[(week*7)+5]?.shift1 || []).map(value => ({ label: value, value }))}
    onChange={(selectedOptions) => handleWorkerChange((week*7)+5, 'shift1', selectedOptions)}
  />
</td>
<td>
  <label>Shift 1: </label>
<Select
    isMulti
    options={data.map(employee => ({ label: employee.fname, value: employee.fname }))}
    value={(schedule[(week*7)+6]?.shift1 || []).map(value => ({ label: value, value }))}
    onChange={(selectedOptions) => handleWorkerChange((week*7)+6, 'shift1', selectedOptions)}
  />
</td>
                </tr>
              );
            })}{[...Array(1)].map((_, day) => {
              const currentDay = week * 7 + day;
              if (currentDay >= daysInMonth) {
                return null; // Don't render rows for days outside the current month
              }
              return (
                <tr class='spaceout' key={week+1}>
<td>
  <label>Shift 2: </label>
  <Select
    isMulti
    options={data.map(employee => ({ label: employee.fname, value: employee.fname }))}
    value={(schedule[(week*7)]?.shift2 || []).map(value => ({ label: value, value }))}
    onChange={(selectedOptions) => handleWorkerChange((week*7), 'shift2', selectedOptions)}
  />
</td>
<td>
  <label>Shift 2: </label>
  <Select
    isMulti
    options={data.map(employee => ({ label: employee.fname, value: employee.fname }))}
    value={(schedule[(week*7)+1]?.shift2 || []).map(value => ({ label: value, value }))}
    onChange={(selectedOptions) => handleWorkerChange((week*7)+1, 'shift2', selectedOptions)}
  />
</td>
<td>
  <label>Shift 2: </label>
  <Select
    isMulti
    options={data.map(employee => ({ label: employee.fname, value: employee.fname }))}
    value={(schedule[(week*7)+2]?.shift2 || []).map(value => ({ label: value, value }))}
    onChange={(selectedOptions) => handleWorkerChange((week*7)+2, 'shift2', selectedOptions)}
  />
</td>
<td>
  <label>Shift 2: </label>
  <Select
    isMulti
    options={data.map(employee => ({ label: employee.fname, value: employee.fname }))}
    value={(schedule[(week*7)+3]?.shift2 || []).map(value => ({ label: value, value }))}
    onChange={(selectedOptions) => handleWorkerChange((week*7)+3, 'shift2', selectedOptions)}
  />
</td>
<td>
  <label>Shift 2: </label>
  <Select
    isMulti
    options={data.map(employee => ({ label: employee.fname, value: employee.fname }))}
    value={(schedule[(week*7)+4]?.shift2 || []).map(value => ({ label: value, value }))}
    onChange={(selectedOptions) => handleWorkerChange((week*7)+4, 'shift2', selectedOptions)}
  />
</td>
<td>
  <label>Shift 2: </label>
  <Select
    isMulti
    options={data.map(employee => ({ label: employee.fname, value: employee.fname }))}
    value={(schedule[(week*7)+5]?.shift2 || []).map(value => ({ label: value, value }))}
    onChange={(selectedOptions) => handleWorkerChange((week*7)+5, 'shift2', selectedOptions)}
  />
</td>
<td>
  <label>Shift 2: </label>
  <Select
    isMulti
    options={data.map(employee => ({ label: employee.fname, value: employee.fname }))}
    value={(schedule[(week*7)+6]?.shift2 || []).map(value => ({ label: value, value }))}
    onChange={(selectedOptions) => handleWorkerChange((week*7)+6, 'shift2', selectedOptions)}
  />
</td>
                </tr>
              );
            })}
          </tbody>
        </Table>

        <button class='button-5' id='submitSch' variant="primary" type="submit">Save Schedule</button>
      </>
    ) : (
      <p>No workers avaiable</p>
    )}
    </div>
  </Container>
);


          }


export default Schedule;
