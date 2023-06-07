import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardBody, MDBTypography } from 'mdb-react-ui-kit';
import { FiEdit2 } from 'react-icons/fi'; // pencil icon
import { MdCameraAlt } from 'react-icons/md'; // camera icon
import { FiEye, FiEyeOff } from 'react-icons/fi'; // Eye icons for show/hide password
import { ThreeDots } from "react-loader-spinner";

import './CssFiles/Profile.css';

function Profile() {
  const [loading, setLoading] = useState(true); // Initial loading state
  const [imageKey, setImageKey] = useState(Date.now());
  const [showPassword, setShowPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef();

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
    address: false,
    password: false,
  });
  // Handle input field changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };
  // Handle edit click for a specific field
  const handleEditClick = (field) => {
    setEditable({ ...editable, [field]: !editable[field] });
    if (field === 'password' && !editable.password) {
      setShowPassword(false);
    }
  };
  // Handle click on the image container to open file dialog
  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  // Handle image change
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    const localImageUrl = URL.createObjectURL(file);

    // Set local URL of selected image immediately
    setData((prevData) => ({ ...prevData, image: localImageUrl }));
    setSelectedFile(file); // Store the selected file in state
  };
  // Handle form submission
  const handleFormSubmit = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('_id', data._id);
      formData.append('fname', data.fname);
      formData.append('lname', data.lname);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('phone', data.phone);
      formData.append('address', data.address);
      formData.append('image', selectedFile);

      try {
        
        const response = await axios.post('http://localhost:5000/updateManager', formData, {
          
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.Status === 'Success') {
          console.log('Successfully updated data');
          // Update the data state with the updated manager info
          setData(response.data.Result);
          setEditable({ email: false, phone: false, address: false, password: false }); // Close all fields
        }
      } catch (error) {
        console.log('Failed to update data:', error);
      }
    } else {
      try {
        const response = await axios.post('http://localhost:5000/updateManager', {
          _id: data._id,
          fname: data.fname,
          lname: data.lname,
          email: data.email,
          password: data.password,
          phone: data.phone,
          address: data.address,
        });

        if (response.data.Status === 'Success') {
          console.log('Successfully updated data');
          // Update the data state with the updated manager info
          setData(response.data.Result);
          setEditable({ email: false, phone: false, address: false, password: false }); // Close all fields
        }
      } catch (error) {
        console.log('Failed to update data:', error);
      }
    }
  };
  // Fetch initial data for the profile

  useEffect(() => {
    axios
      .get('http://localhost:5000/getManager')
      .then((res) => {
        if (res.data.Status === 'Success') {
          setData(res.data.Result);
        }
        setLoading(false); // Set loading to false after data retrieval
      })
      .catch((err) => {
        console.log('Failed to fetch data');
        setLoading(false); // Set loading to false if there is an error
      });
  }, [editable.email, editable.phone, editable.address, editable.password]);
  
  // Handle key press event on the form "Enter"
  const handleFormKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleFormSubmit();
    }
  };
  // Render loading spinner if data is still loading
  if (loading) {
    return (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
      <ThreeDots color="#0b0436" height={50} width={50} />
    </div>
    );
  }

  return (
    <div className="gradient-custom-2">
      <MDBContainer>
        <MDBRow className="justify-content-center">
          <MDBCol lg="10" xl="8">
            <MDBCard className="card-shadow">
              <div className="rounded-top text-white d-flex flex-row top-container">
                <div className="position-relative">
                  <div className="img-container d-flex justify-content-center align-items-center">
                  <img
                      key={imageKey}
                          src={data.image.includes('blob:') ? data.image : `http://localhost:5000/images/` + data.image}
                            alt="Profile Picture"
                            className="img-thumbnail rounded-circle profile-image"
                    />
                  </div>
                  <MdCameraAlt className="camera-icon" onClick={handleImageClick} />
                  <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageChange} />
                </div>
                <div className="ms-3 d-flex align-items-center">
                  <MDBTypography tag="h3" className="mb-0 text-white profile-name">{data.fname + ' ' + data.lname}</MDBTypography>
                </div>
              </div>
              <MDBCardBody className="p-5">
                <div className="mb-6">
                  <MDBCard className="mb-6">
                    <MDBCardBody className="profile-info">
                      <div onKeyDown={handleFormKeyDown}>
                        <MDBRow>
                          <MDBCol sm="3">
                            <MDBTypography className='label-text' tag="h6">First Name</MDBTypography>
                          </MDBCol>
                          <MDBCol  sm="9" className="d-flex align-items-center label-data">
                            <div>{data.fname}</div>
                          </MDBCol>
                        </MDBRow>
                        <hr />
                        <MDBRow>
                          <MDBCol sm="3">
                            <MDBTypography className='label-text' tag="h6">Last Name</MDBTypography>
                          </MDBCol>
                          <MDBCol sm="9" className="d-flex align-items-center label-data">
                            <div>{data.lname}</div>
                          </MDBCol>
                        </MDBRow>
                        <hr />
                        <MDBRow>
                          <MDBCol sm="3">
                            <MDBTypography className='label-text' tag="h6">Email</MDBTypography>
                          </MDBCol>
                          <MDBCol sm="9" className="d-flex align-items-center label-data">
                            {editable.email ? (
                              <>
                                <input type="text" name="email" value={data.email} onChange={handleInputChange} />
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
                            <MDBTypography className='label-text' tag="h6">Phone</MDBTypography>
                          </MDBCol>
                          <MDBCol sm="9" className="d-flex align-items-center label-data">
                            {editable.phone ? (
                              <>
                                <input type="text" name="phone" value={data.phone} onChange={handleInputChange} />
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
                            <MDBTypography className='label-text' tag="h6">Address</MDBTypography>
                          </MDBCol>
                          <MDBCol sm="9" className="d-flex align-items-center label-data">
                            {editable.address ? (
                              <>
                                <input type="text" name="address" value={data.address} onChange={handleInputChange} />
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
                        <MDBRow>
                          <MDBCol sm="3">
                            <MDBTypography className='label-text' tag="h6">Password</MDBTypography>
                          </MDBCol>
                          <MDBCol sm="9" className="d-flex align-items-center password-container label-data">
                            {editable.password ? (
                              <>
                                <input
                                  type={showPassword ? 'text' : 'password'}
                                  name="password"
                                  value={data.password}
                                  onChange={handleInputChange}
                                />
                                <FiEdit2 className="edit-icon" onClick={() => handleEditClick('password')} />
                                {showPassword ? (
                                  <FiEye className="password-toggle" onClick={() => setShowPassword(!showPassword)} />
                                ) : (
                                  <FiEyeOff className="password-toggle" onClick={() => setShowPassword(!showPassword)} />
                                )}
                              </>
                            ) : (
                              <>
                                <div>
                                  {showPassword && editable.password ? data.password : '*'.repeat(data.password.length)}
                                </div>
                                <FiEdit2 className="edit-icon" onClick={() => handleEditClick('password')} />
                              </>
                            )}
                          </MDBCol>
                        </MDBRow>
                      </div>
                    </MDBCardBody>
                  </MDBCard>
                </div>
                <div className="d-flex justify-content-end mt-4">
                  <button
                    type="button"
                    className="save-button"
                    onClick={handleFormSubmit}
                  >
                    Save
                  </button>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}

export default Profile;
