
import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "./CssFiles/Theme.css"

// Define the CustomInput component
const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <button className="custom-input" style={{ border: 'none', backgroundColor: 'white' }} onClick={onClick} ref={ref}>
        {value}
        <i className="bi bi-calendar" style={{ backgroundColor: 'white' }}></i>
    </button>
));

function VacationRequest() {
    const [selectedDateTo, setSelectedDateTo] = useState(null);
    const [selectedDateFrom, setSelectedDateFrom] = useState(null);
    const [description, setDescription] = useState('');

    const handleChange = (event) => {
        setDescription(event.target.value);
    };


    return (
        <>
            <h2 className="text-center">vacation Request</h2>

            <div className="container text-center mt-5">
                <div className="row justify-content-center">

                    <div className="col-auto">

                        <p className="mb-0">From:</p>

                    </div>

                    <div className="col-auto">

                        <DatePicker
                            selected={selectedDateFrom}
                            onChange={date => setSelectedDateFrom(date)}
                            dateFormat='yyyy/MM/dd'
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
                            onChange={date => setSelectedDateTo(date)}
                            dateFormat='yyyy/MM/dd'
                            isClearable
                            showYearDropdown
                            scrollableMonthYearDropdown
                            customInput={<CustomInput />}
                        />
                    </div>
                </div>
            </div>
            {/*  */}

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
                <button className="btn-design btn-bgc text-white" >
                    Submit Request
                </button>
            </div>


        </>
    )
}

export default VacationRequest;
