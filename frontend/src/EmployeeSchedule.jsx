import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Table, Button } from 'react-bootstrap';
import { ThreeDots } from "react-loader-spinner";

function EmployeeSchedule () {
  const {id} = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth());
  const [week, setWeek] = useState(0);
  

  useEffect(() => {
    axios.get('http://localhost:5000/employeeSchedule/'+id)
      .then((res) => {
        if (res.data.Status === "Success") {
          setData(res.data.Result);
        }
        setLoading(false);
      })   
      .catch(err => {
        console.log("faild");
        setLoading(false);
      });
  }, [id, week])

  const daysInMonth = new Date(new Date().getFullYear(), month + 1, 0).getDate();

  const handleWeekChange = (direction) => {
    setWeek(week + direction);
  };

  const shiftsInWeek = data.filter(shift => Math.floor(shift.day / 7) === week);

  if (loading) {
    return (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
      <ThreeDots color="#0b0436" height={50} width={50} />
    </div>
    
    );
  }
  return (
    <Container>
      <h3>Month: {month + 1}</h3>
      <Button onClick={() => handleWeekChange(-1)} disabled={week <= 0}>Previous Week</Button>
      <Button onClick={() => handleWeekChange(1)} disabled={(week + 1) * 7 >= daysInMonth}>Next Week</Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Shift</th>
            {[...Array(7)].map((_, day) => {
              const currentDay = week * 7 + day;
              if (currentDay >= daysInMonth) {
                return null;
              }
              return <th key={currentDay}>{currentDay + 1}</th>;
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
                  const shifts = shiftsInWeek.filter(shift => shift.day === currentDay + 1);
                  return (
                    <td key={currentDay} style={{textAlign: "center", verticalAlign: "middle"}}>
                      {shifts.find(shift => shift.shift === shiftType) ? 'V' : ''}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  )
}

export default EmployeeSchedule;
