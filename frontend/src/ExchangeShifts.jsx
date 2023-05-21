import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "../src/Theme.css"


// Define the CustomInput component
const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <button className="custom-input" style={{ border: 'none', backgroundColor: 'white' }} onClick={onClick} ref={ref}>
        {value}
        <i className="bi bi-calendar" style={{ backgroundColor: 'white' }}></i>
    </button>
));


function ExchangeShifts() {
    const [MyShiftSelectedDate, setMyShiftSelectedDate] = useState(null);
    const [OtherShiftSelectedDate, setOtherShiftSelectedDate] = useState(null);

    return (
        <>
            <h1 className="text-center">Exchange shifts</h1>
            <h3 className="text-center mt-5">Enter the Worker and shift details here</h3>
            <div className="container" style={{ display: 'grid', justifyItems: 'center', gridTemplateRows: '1fr 1fr' }}>
                <div className="form-group row w-50">
                    <div className="col-12">
                        <input type="email" className="form-control text-center" id="Workerid" aria-describedby="emailHelp" placeholder="Other worker id" />
                    </div>
                </div>

                <div className="row form-group mt-4" style={{ alignSelf: 'start', width: '100%', paddingLeft: '15px' }}>
                    <div className="col-3">
                        <div className="form-group text-center">
                            <label>Pick your shift date:</label>
                            <DatePicker
                                selected={MyShiftSelectedDate}
                                onChange={date => setMyShiftSelectedDat(date)}
                                dateFormat='yyyy/MM/dd'
                                isClearable
                                showYearDropdown
                                scrollableMonthYearDropdown
                                customInput={<CustomInput />}
                            />
                        </div>
                    </div>

                    <div className="col-3 ms-auto">
                        <div className="form-group text-center">
                            <label>Pick other worker shift date:</label>
                            <DatePicker
                                selected={OtherShiftSelectedDate}
                                onChange={date => setOtherShiftSelectedDate(date)}
                                dateFormat='yyyy/MM/dd'
                                isClearable
                                showYearDropdown
                                scrollableMonthYearDropdown
                                customInput={<CustomInput />}
                            />
                        </div>
                    </div>
                </div>

                <div className="row form-group mt-4" style={{ alignSelf: 'start', width: '100%', paddingLeft: '15px' }}>
                    <div className="col-3">
                        <div className="form-group text-center">
                            <label>Pick your shift type:</label>
                            <select class="form-select text-center" aria-label="Default select example">
                                <option selected>Shift type</option>
                                <option value="Morning">Morning</option>
                                <option value="Night">Night</option>
                            </select>
                        </div>
                    </div>

                    <div className="col-3 ms-auto">
                        <div className="form-group text-center">
                            <label>Pick other worker shift Type:</label>
                            <select class="form-select text-center" aria-label="Default select example">
                                <option selected>Shift type</option>
                                <option value="Morning">Morning</option>
                                <option value="Night">Night</option>
                            </select>

                        </div>
                    </div>
                </div>

                <div className="form-group row w-50">
                    <div className="col-12 text-center mt-5">
                        <button className="btn btn-primary">Submit</button>
                    </div>
                </div>



            </div>



        </>
    )


}

export default ExchangeShifts;