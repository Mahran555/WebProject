import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBTypography } from 'mdb-react-ui-kit';
import { FiEdit2 } from 'react-icons/fi'; // pencil icon
import { MdCameraAlt } from 'react-icons/md'; // camera icon
import './Profile.css';

function Profile() {
  const [imageKey, setImageKey] = useState(Date.now());
  const [data, setData] = useState({
    id: '',
    fname: '',
    lname: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    image: ''
  });

  const [editable, setEditable] = useState({
    email: false,
    phone: false,
    address: false
  });

  const fileInputRef = useRef();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };

  const handleEditClick = (field) => {
    setEditable({ ...editable, [field]: !editable[field] });
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
  
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('image', file);
  
    try {
      const response = await axios.post('http://localhost:5000/updateManagerImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      if (response.data.Status === 'Success') {
        console.log('Successfully updated profile picture');
  
        // Update the imageKey to trigger re-rendering of the image
        setImageKey(Date.now());
        
      }
    } catch (error) {
      console.log('Failed to update profile picture');
    }
  };
  
  
  
  
  
  

  const handleFormSubmit = async (event) => {
    event.preventDefault();
  
    const formData = new FormData();
    formData.append('_id', data._id);
    formData.append('fname', data.fname);
    formData.append('lname', data.lname);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('phone', data.phone);
    formData.append('address', data.address);
    formData.append('image', fileInputRef.current.files[0]);
  
    try {
      const response = await axios.post('http://localhost:5000/updateManager', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.data.Status === 'Success') {
        console.log('Successfully updated data');
        // Update the data state with the updated manager info
        setData(response.data.Result);
      }
    } catch (error) {
      console.log('Failed to update data:', error);
    }
  };
  

  const handleKeyDown = (event, field) => {
    if (event.key === 'Enter') {
      setEditable({ ...editable, [field]: false });

      // Find the input element by name
      const inputElement = event.target.form.elements[field];
      if (inputElement) {
        inputElement.blur();
      }
    }
  };

  useEffect(() => {
    axios
      .get('http://localhost:5000/getManager')
      .then((res) => {
        if (res.data.Status === 'Success') {
          setData(res.data.Result);
        }
      })
      .catch((err) => console.log('Failed to fetch data'));
  }, []);

  return (
    <div className="gradient-custom-2" style={{ backgroundColor: '#3333' }}>
      <MDBContainer className="py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol lg="10" xl="15">
            <MDBCard style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <div
                className="rounded-top text-white d-flex flex-row"
                style={{ backgroundColor: '#000', height: '200px' }}
              >
                <div className="ms-4 mt-5 position-relative" style={{ width: '150px' }}>
                <img
                  key={imageKey}
                  src={`http://localhost:5000/images/` + data.image}
                  alt="Generic placeholder image"
                  className="mt-2 mb-2 img-thumbnail"
                  fluid
                  style={{ width: '160px', zIndex: '1', height: '120px' }}
                  />
                  <MdCameraAlt className="camera-icon" onClick={handleImageClick} />
                  <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageChange} />

                </div>
                <div className="ms-3" style={{ marginTop: '100px' }}>
                  <MDBTypography tag="h3">{data.fname + ' ' + data.lname}</MDBTypography>
                </div>
              </div>
              <div className="p-4 text-black" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="d-flex justify-content-end text-center py-1"></div>
              </div>
              <MDBCardBody className="text-black p-4">
                <div className="mb-6">
                  <MDBCard className="mb-5">
                    <MDBCardBody>
                      <form onSubmit={handleFormSubmit}>
                        <MDBRow>
                          <MDBCol sm="3">
                            <MDBCardText>First Name</MDBCardText>
                          </MDBCol>
                          <MDBCol sm="9" className="d-flex align-items-center">
                            <div>{data.fname}</div>
                          </MDBCol>
                        </MDBRow>
                        <hr />
                        <MDBRow>
                          <MDBCol sm="3">
                            <MDBCardText>Last Name</MDBCardText>
                          </MDBCol>
                          <MDBCol sm="9" className="d-flex align-items-center">
                            <div>{data.lname}</div>
                          </MDBCol>
                        </MDBRow>
                        <hr />
                        <MDBRow>
                          <MDBCol sm="3">
                            <MDBCardText>Email</MDBCardText>
                          </MDBCol>
                          <MDBCol sm="9" className="d-flex align-items-center">
                            {editable.email ? (
                              <>
                                <input
                                  type="text"
                                  name="email"
                                  value={data.email}
                                  onChange={handleInputChange}
                                  onKeyDown={(event) => handleKeyDown(event, 'email')}
                                />
                                <FiEdit2 className="edit-icon" onClick={() => handleEditClick('email')} />
                              </>
                            ) : (
                              <>
                                <div>{data.email}</div>
                                <FiEdit2 className="edit-icon" onClick={() => handleEditClick('email')} />
                              </>
                            )}
                          </MDBCol>
                        </MDBRow>
                        <hr />
                        <MDBRow>
                          <MDBCol sm="3">
                            <MDBCardText>Phone</MDBCardText>
                          </MDBCol>
                          <MDBCol sm="9" className="d-flex align-items-center">
                            {editable.phone ? (
                              <>
                                <input
                                  type="text"
                                  name="phone"
                                  value={data.phone}
                                  onChange={handleInputChange}
                                  onKeyDown={(event) => handleKeyDown(event, 'phone')}
                                />
                                <FiEdit2 className="edit-icon" onClick={() => handleEditClick('phone')} />
                              </>
                            ) : (
                              <>
                                <div>{data.phone}</div>
                                <FiEdit2 className="edit-icon" onClick={() => handleEditClick('phone')} />
                              </>
                            )}
                          </MDBCol>
                        </MDBRow>
                        <hr />
                        <MDBRow>
                          <MDBCol sm="3">
                            <MDBCardText>Address</MDBCardText>
                          </MDBCol>
                          <MDBCol sm="9" className="d-flex align-items-center">
                            {editable.address ? (
                              <>
                                <input
                                  type="text"
                                  name="address"
                                  value={data.address}
                                  onChange={handleInputChange}
                                  onKeyDown={(event) => handleKeyDown(event, 'address')}
                                />
                                <FiEdit2 className="edit-icon" onClick={() => handleEditClick('address')} />
                              </>
                            ) : (
                              <>
                                <div>{data.address}</div>
                                <FiEdit2 className="edit-icon" onClick={() => handleEditClick('address')} />
                              </>
                            )}
                          </MDBCol>
                        </MDBRow>
                        <hr />
                        <button type="submit">Save</button>
                      </form>
                    </MDBCardBody>
                  </MDBCard>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-4"></div>
                <MDBRow></MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}

export default Profile;
