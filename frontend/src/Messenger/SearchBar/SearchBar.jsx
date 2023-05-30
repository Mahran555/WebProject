import React from 'react';
import { Form, FormControl, Button } from 'react-bootstrap';
import './SearchBar.css'

function SearchBar({PlaceHolder , value, onChange}) {
    return (
        <Form className='form'>
            <FormControl 
                type="text" 
                placeholder={PlaceHolder} 
                className="mr-sm-2 FormControl" 
                value={value}
                onChange={onChange} 
            />
        </Form>
    )
}

export default SearchBar;
